from fastapi import APIRouter
import pandas as pd
from fastapi import HTTPException, Query
from app.forcasting import forecast_demand

# Load your data (update the path if your data is located elsewhere)
df = pd.read_csv('data/restaurant_inventory_data.csv', parse_dates=['Date'])

router = APIRouter()

@router.get("/api/ingredients",  tags=["Ingredients"])
async def get_ingredients():
    """
    Get a list of all available ingredients in the dataset
    """
    ingredients = df['Ingredient'].unique().tolist()
    return {"ingredients": ingredients}

@router.get("/", tags=["Test"])
async def hello_world():
    """
    A simple test endpoint that returns Hello World
    """
    return {"message": "Hello World"}


@router.get("/api/forecast/{ingredient}", response_model=ForecastResponse, tags=["Forecasting"])
async def get_forecast(
    ingredient: str,
    days: int = Query(30, description="Number of days to forecast"),
    optimize: bool = Query(True, description="Whether to optimize Prophet parameters")
):
    """
    Get demand forecast for a specific ingredient.
    """
    try:
        forecast_df, prophet_results, _ = forecast_demand(df, ingredient, days, optimize)
        
        # Convert dates to strings for JSON
        forecast_df['Date'] = forecast_df['Date'].dt.strftime('%Y-%m-%d')
        
        # Convert DataFrame to dict for JSON response
        forecast_data = forecast_df.to_dict(orient='records')
        
        # Get evaluation metrics
        metrics = {
            'mae': float(prophet_results['mae']),
            'rmse': float(prophet_results['rmse'])
        }
        
        return {
            'ingredient': ingredient,
            'forecast': forecast_data,
            'metrics': metrics
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/ingredient-history/{ingredient}", response_model=IngredientHistory)
def get_ingredient_history(ingredient: str):
    """
    Get historical data, optimization trends, and recommended stock level for a specific ingredient
    
    Args:
        ingredient: The ingredient to get history for
    """
    if df.empty:
        raise HTTPException(status_code=500, detail="Data not loaded correctly")
    
    if ingredient not in df['Ingredient'].unique():
        raise HTTPException(status_code=404, detail=f"Ingredient '{ingredient}' not found")
    
    ingredient_data = df[df['Ingredient'] == ingredient].sort_values('Date')
    
    # Get patterns
    patterns = get_temporal_patterns(ingredient_data)
    
    # Get optimal stock trend
    optimal_stock_trend = []
    waste_percentage_trend = []
    
    for index, row in ingredient_data.iterrows():
        date_str = row['Date'].strftime('%Y-%m-%d')
        
        # For each historical date, what would have been the optimal stock?
        state = (
            row['Demand'],
            row['Waste_Percentage'],
            row['Stock_Level'],
            row['Is_Weekend'],
            row['Is_Holiday'],
            row['Month']
        )
        
        optimal_stock, _ = rl_optimizer.get_optimal_stock(ingredient, state, row['Demand'])
        
        optimal_stock_trend.append({
            'date': date_str,
            'actual_stock': float(row['Stock_Level']),
            'optimal_stock': float(optimal_stock)
        })
        
        waste_percentage_trend.append({
            'date': date_str,
            'waste_percentage': float(row['Waste_Percentage'])
        })
    
    # Calculate current recommended stock level
    # First get latest demand forecast
    days_ahead = 7  # Default forecast days
    forecast_df, prophet_results, _ = forecast_demand(df, ingredient, forecast_days=days_ahead)
    
    # Get waste prediction
    waste_prediction_result = predict_waste_for_ingredient(df, ingredient, waste_model, waste_features)
    
    if waste_prediction_result is None:
        predicted_waste = 0
        predicted_waste_percentage = 0
    else:
        predicted_waste, predicted_waste_percentage = waste_prediction_result
    
    # Get the latest data for the ingredient
    latest_data = ingredient_data.sort_values('Date', ascending=False).iloc[0]
    
    # Get expected demand from forecast
    expected_demand = forecast_df.iloc[0]['Predicted_Demand']
    
    # Create current state for RL agent
    current_state = (
        expected_demand,
        predicted_waste_percentage,
        latest_data['Stock_Level'],
        1 if datetime.now().weekday() >= 5 else 0,  # Is weekend
        0,  # Assuming not a holiday for simplicity
        datetime.now().month
    )
    
    # Get recommended stock level from RL agent
    recommended_stock, confidence = rl_optimizer.get_optimal_stock(ingredient, current_state, expected_demand)
    
    # Calculate confidence score based on model metrics and RL state exploration
    state_key = rl_optimizer.get_state_key(*current_state)
    confidence_score = 0.7  # Default medium-high confidence
    
    if state_key in rl_optimizer.q_table:
        # Adjust confidence based on how many times we've seen this state
        state_visits = sum(1 for entry in rl_optimizer.state_history.get(ingredient, []) 
                          if rl_optimizer.get_state_key(*entry['state']) == state_key)
        if state_visits > 10:
            confidence_score = 0.9  # High confidence
        elif state_visits > 5:
            confidence_score = 0.8  # Medium-high confidence
        elif state_visits > 0:
            confidence_score = 0.7  # Medium confidence
        else:
            confidence_score = 0.6  # Lower confidence
    
    # Calculate recommended order quantity
    current_stock = latest_data['Stock_Level']
    recommended_order = max(0, int(recommended_stock) - int(current_stock))
    
    # Generate reasoning for recommendation
    if current_stock >= recommended_stock:
        reasoning = "Current stock level is more than sufficient based on demand forecast and waste prediction."
    elif predicted_waste_percentage > 15:
        reasoning = "Reduced order suggested due to high predicted waste percentage."
    elif expected_demand > latest_data['Demand'] * 1.2:
        reasoning = "Increased order suggested due to expected demand spike."
    else:
        reasoning = "Standard replenishment based on optimal stock calculations."
    
    # Return enhanced response with recommendation
    return IngredientHistory(
        recommendation={
            "current_stock": int(current_stock),
            "recommended_stock": int(recommended_stock),
            "recommended_order": recommended_order,
            "expected_demand": int(expected_demand),
            "confidence_score": confidence_score,
            "reasoning": reasoning,
        }
    )