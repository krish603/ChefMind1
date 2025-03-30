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
