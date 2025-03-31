import os
import google.generativeai as genai
import pandas as pd
from typing import List, Dict, Any
import json
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from waste_prediction import *

# Load environment variables
load_dotenv()

app = FastAPI(title="Restaurant Waste Management API")

# Recipe response models
class RecipeIngredient(BaseModel):
    name: str
    quantity: str = None
    unit: str = None

class RecipeRecommendation(BaseModel):
    name: str
    description: str
    high_risk_ingredients_used: List[str]
    prep_time_minutes: int
    meal_type: str
    potential_waste_reduction: float = None
    date: str

class RecipeListResponse(BaseModel):
    recipes: List[RecipeRecommendation]

# Setup Gemini API
def get_gemini_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable not set")
    
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-1.5-pro')

def get_high_risk_items():
    """
    Get high-risk items directly from the waste model and data
    """
    prepared_data = prepare_waste_features(df)
    latest_data = prepared_data.sort_values('Date').groupby('Ingredient').tail(1).reset_index(drop=True)
    latest_X = latest_data[waste_features]
    waste_predictions = waste_model.predict(latest_X)
    
    latest_data['Predicted_Waste'] = waste_predictions
    latest_data['Predicted_Waste_Percentage'] = (latest_data['Predicted_Waste'] / latest_data['Demand']) * 100

    high_risk = latest_data.sort_values('Predicted_Waste_Percentage', ascending=False).head(10)
    
    result = []
    for _, row in high_risk.iterrows():
        result.append({
            "ingredient": row['Ingredient'],
            "predicted_waste": float(row['Predicted_Waste']),
            "predicted_waste_percentage": float(row['Predicted_Waste_Percentage'])
        })
    
    return result

def generate_recipe_recommendations(high_risk_items: List[Dict[str, Any]], model):
    """
    Generate recipe recommendations using Gemini 1.5 Pro based on high-risk ingredients.
    """
    if not high_risk_items:
        return []
    
    # Extract ingredient names
    ingredients = [item["ingredient"] for item in high_risk_items]
    ingredient_waste = {item["ingredient"]: item["predicted_waste"] for item in high_risk_items}
    
    # Create a prompt for Gemini
    prompt = f"""
    You are a professional chef tasked with creating daily specials that utilize soon-to-expire ingredients.

    HIGH-RISK INGREDIENTS (in order of priority, highest waste first):
    {', '.join(ingredients)}

    TASK:
    - Create 3 practical restaurant-quality recipe suggestions
    - Each recipe should use at least 2-3 of the high-risk ingredients in combination
    - Only suggest recipes that are well-established and commonly enjoyed (no experimental combinations)
    - Include a recipe name, brief description, main high-risk ingredients used, and preparation time
    - Prioritize ingredients with higher predicted waste

    FORMAT YOUR RESPONSE AS A JSON LIST with this structure:
    [
        {
            "name": "Recipe Name",
            "description": "Brief, appetizing description",
            "high_risk_ingredients_used": ["ingredient1", "ingredient2"],
            "prep_time_minutes": 30,
            "meal_type": "appetizer|main|dessert",
            "instructions": [
            "Step 1: Do this...",
            "Step 2: Do that...",
            "Step 3: Finish up..."
            ],
            "difficulty_level": "easy|medium|hard"
        }
    ]


    Only respond with the JSON, no additional text.
    """
    
    try:
        response = model.generate_content(prompt)
        response_text = response.text
        
        # Extract JSON from response
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_str = response_text.split("```")[1].strip()
        else:
            json_str = response_text.strip()
            
        # Parse JSON
        recipes = json.loads(json_str)
        
        # Add the current date to each recipe
        current_date = datetime.now().strftime("%Y-%m-%d")
        for recipe in recipes:
            recipe["date"] = current_date
            
            # Calculate how much waste this recipe potentially reduces
            waste_reduction = sum(ingredient_waste.get(ingredient, 0) 
                                for ingredient in recipe["high_risk_ingredients_used"])
            recipe["potential_waste_reduction"] = round(waste_reduction, 2)
            
        return recipes
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recipes: {str(e)}")

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

