from pydantic import BaseModel
from typing import List
import google.generativeai as genai
import json
import os


class RecipeRequest(BaseModel):
    ingredients: List[str]

class Recipe(BaseModel):
    name: str
    description: str
    prep_time_minutes: int
    meal_type: str
    instructions: List[str]
    difficulty_level: str

class RecipeResponse(BaseModel):
    recipes: List[Recipe]

def generate_recipe_prompt(ingredients: List[str]) -> str:
    return f"""
    Create 3 practical restaurant-quality recipes using ingredients from this list: {", ".join(ingredients)}.
    
    Only suggest recipes that are well-established and commonly enjoyed (no experimental combinations).
    Each recipe should include:
    1. A professional recipe name
    2. A brief, appetizing description
    3. A realistic preparation time in minutes
    4. Meal type (appetizer, main, or dessert)
    5. Step-by-step instructions
    6. Difficulty level (easy, medium, or hard)
    
    FORMAT YOUR RESPONSE AS A JSON LIST with this structure:
    [
        {{
            "name": "Recipe Name",
            "description": "Brief, appetizing description",
            "prep_time_minutes": 30,
            "meal_type": "appetizer|main|dessert",
            "instructions": [
                "Step 1: Do this...",
                "Step 2: Do that...",
                "Step 3: Finish up..."
            ],
            "difficulty_level": "easy|medium|hard"
        }}
    ]
    
    IMPORTANT: Your response must be ONLY the valid JSON array, nothing else.
    """

def fetch_recipes_from_ai(prompt: str) -> List[Recipe]:
    model = genai.GenerativeModel('gemini-1.5-pro')
    response = model.generate_content(prompt)
    response_text = response.text.strip()
    
    # Remove any markdown code block indicators if present
    if response_text.startswith("```json"):
        response_text = response_text.replace("```json", "", 1)
    if response_text.endswith("```"):
        response_text = response_text[:-3]
    
    recipe_data = json.loads(response_text)
    return [Recipe(**recipe) for recipe in recipe_data]

