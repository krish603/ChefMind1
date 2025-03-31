from fastapi import FastAPI, File, UploadFile, HTTPException, Query
import shutil
import os
import json
import pandas as pd
from food_detection import detect_food_with_gemini, process_video
from fastapi.middleware.cors import CORSMiddleware
from demand_prediction import *
from datetime import timedelta
from waste_prediction import *
from recipe_recommendation import *
from dynamic_inventory import *
from generate_recipes import *
from typing import List

app = FastAPI()
# Configure CORS middleware

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
from dotenv import load_dotenv

# Load environment variables for API keys
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure the generative AI model
genai.configure(api_key=GOOGLE_API_KEY)

df = pd.read_csv("restaurant_inventory_data.csv")  # Load your dataset

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.post("/detect-food")
async def detect_food(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    result = detect_food_with_gemini(file_path)
    os.remove(file_path)
    
    # Clean the response by removing markdown code block formatting if present
    if isinstance(result, str):
        if "```json" in result and "```" in result:
            # Extract just the JSON content between the triple backticks
            json_start = result.find("```json") + 7  # Skip past ```json
            json_end = result.rfind("```")
            result = result[json_start:json_end].strip()
        
        try:
            # Try to parse the cleaned JSON string
            return json.loads(result)
        except json.JSONDecodeError as e:
            # Log the error and return a structured error response
            print(f"Error parsing JSON from Gemini: {e}")
            print(f"Raw response: {result}")
            raise HTTPException(status_code=500, detail="Failed to parse AI response")
    else:
        # If result is not a string (unlikely but handling just in case)
        return {"error": "Invalid response format"}

@app.post("/process-video")
async def analyze_video(file: UploadFile = File(...)):
    try:
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Call the function to get results
        result = process_video(file_path)
        
        # Clean up the temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Make sure we're returning a non-None value
        if result is None:
            result = {"frames": []}
            
        return result
    except Exception as e:
        # Log the error
        print(f"Error processing video: {str(e)}")
        # Return a proper error response
        raise HTTPException(status_code=500, detail=f"Failed to process video: {str(e)}")
    

# API Routes
@app.get("/api/ingredients", response_model=IngredientsResponse, tags=["Ingredients"])
async def get_ingredients():
    """
    Get a list of all available ingredients in the dataset
    """
    ingredients = df['Ingredient'].unique().tolist()
    return {"ingredients": ingredients}

@app.get("/api/forecast/{ingredient}", response_model=ForecastResponse, tags=["Forecasting"])
async def get_forecast(
    ingredient: str,
    days: int = Query(30, description="Number of days to forecast"),
    optimize: bool = Query(True, description="Whether to optimize Prophet parameters")
):
    """
    Get demand forecast for a specific ingredient
    """
    try:
        forecast_df, prophet_results, _ = forecast_demand(df, ingredient, days, optimize)
        
        # Convert dates to strings for JSON
        forecast_df['Date'] = forecast_df['Date'].dt.strftime('%Y-%m-%d')
        
        # Convert to dict for JSON response
        forecast_data = forecast_df.to_dict(orient='records')
        
        # Get metrics
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

@app.get("/api/patterns/{ingredient}", response_model=PatternsResponse, tags=["Patterns"])
async def get_patterns(ingredient: str):
    """
    Get temporal patterns (daily, weekly, monthly, yearly) for a specific ingredient
    """
    try:
        # Filter data for the specific ingredient
        ingredient_data = df[df['Ingredient'] == ingredient].copy()
        
        if ingredient_data.empty:
            raise HTTPException(status_code=404, detail=f"No data found for ingredient: {ingredient}")
        
        # Get pattern data
        patterns = get_temporal_patterns(ingredient_data)
        
        return {
            'ingredient': ingredient,
            'patterns': patterns
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/waste_prediction/{ingredient}")
def get_waste_prediction(ingredient: str):
    avg_waste = analyze_ingredient_waste(df, ingredient)
    if avg_waste is None:
        raise HTTPException(status_code=404, detail=f"No data available for {ingredient}.")
    
    waste_prediction, predicted_waste_percentage = predict_waste_for_ingredient(df, ingredient, waste_model, waste_features)
    if waste_prediction is None:
        raise HTTPException(status_code=404, detail=f"Unable to predict waste for {ingredient}.")
    
    return {
        "ingredient": ingredient,
        "average_waste": int(avg_waste),
        "predicted_waste": int(waste_prediction),
        "predicted_waste_percentage": round(predicted_waste_percentage, 2)
    }


@app.get("/high_risk_items", response_model=List[WasteResponse])
def api_get_high_risk_items():
    """
    Get a list of high-risk ingredients sorted by predicted waste percentage
    """
    return get_high_risk_items()

@app.get("/recipe_recommendations", response_model=RecipeListResponse)
def api_get_recipe_recommendations(model = Depends(get_gemini_model)):
    """
    Get AI-generated recipe recommendations based on high-risk ingredients
    """
    high_risk_items = get_high_risk_items()
    recipes = generate_recipe_recommendations(high_risk_items, model)
    return {"recipes": recipes}


@app.get("/api/ingredient-history/{ingredient}", response_model=IngredientHistory)
def get_ingredient_history(ingredient: str):
    """
    Get historical data, optimization trends, and recommended stock level for a specific ingredient
    """
    recommendation = calculate_ingredient_history(ingredient, df, rl_optimizer, waste_model, waste_features)
    
    return {"recommendation": recommendation}

@app.post("/generate-recipes/", response_model=RecipeResponse)
async def generate_recipes(request: RecipeRequest):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="API key for generative AI not configured")
    
    if not request.ingredients or len(request.ingredients) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 ingredients")
    
    try:
        prompt = generate_recipe_prompt(request.ingredients)
        recipes = fetch_recipes_from_ai(prompt)
        return RecipeResponse(recipes=recipes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recipes: {str(e)}")



# @app.get("/high_risk_items", response_model=list[WasteResponse])
# def get_high_risk_items():
#     prepared_data = prepare_waste_features(df)
#     latest_data = prepared_data.sort_values('Date').groupby('Ingredient').tail(1).reset_index(drop=True)
#     latest_X = latest_data[waste_features]
#     waste_predictions = waste_model.predict(latest_X)
    
#     latest_data['Predicted_Waste'] = waste_predictions
#     latest_data['Predicted_Waste_Percentage'] = (latest_data['Predicted_Waste'] / latest_data['Demand']) * 100

#     high_risk = latest_data.sort_values('Predicted_Waste_Percentage', ascending=False).head(10)

#     # Renaming columns to match WasteResponse model
#     high_risk = high_risk.rename(columns={
#         "Ingredient": "ingredient",
#         "Predicted_Waste": "predicted_waste",
#         "Predicted_Waste_Percentage": "predicted_waste_percentage"
#     })

#     return high_risk[['ingredient', 'predicted_waste', 'predicted_waste_percentage']].to_dict(orient='records')



# @app.get("/api/chart/{ingredient}", response_model=ChartResponse, tags=["Chart"])
# async def get_chart_data_endpoint(
#     ingredient: str,
#     days: int = Query(30, description="Number of days to forecast"),
#     optimize: bool = Query(True, description="Whether to optimize Prophet parameters")
# ):
#     """
#     Get chart-ready data including both historical and forecast data for visualization
#     """
#     try:
#         # Get forecast results
#         _, prophet_results, ingredient_data = forecast_demand(df, ingredient, days, optimize)
        
#         # Get chart data
#         chart_data = get_chart_data(ingredient_data, prophet_results, days)
        
#         # Get metrics
#         metrics = {
#             'mae': float(prophet_results['mae']),
#             'rmse': float(prophet_results['rmse'])
#         }
        
#         return {
#             'ingredient': ingredient,
#             'chart_data': chart_data,
#             'metrics': metrics
#         }
#     except ValueError as e:
#         raise HTTPException(status_code=404, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)