import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import pickle
from typing import List, Dict, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException

# Import functions from existing modules
from waste_prediction import *
from demand_prediction import *
from typing import Union

# Define Pydantic models for API responses
class ReplenishmentSuggestion(BaseModel):
    ingredient: str
    current_stock: int
    optimal_stock: int
    suggested_order: int
    expected_demand: int
    predicted_waste: float
    predicted_waste_percentage: float
    confidence_score: float
    reason: str

class InventoryOptimizationResponse(BaseModel):
    suggestions: List[ReplenishmentSuggestion]
    total_cost_savings: float
    total_waste_reduction: float

class StockRecommendation(BaseModel):
    current_stock: int
    recommended_stock: int
    recommended_order: int
    expected_demand: int
    confidence_score: float
    reasoning: str

class IngredientHistory(BaseModel):
    recommendation: StockRecommendation

# Initialize FastAPI app
app = FastAPI(title="Restaurant Inventory Optimization API")

# Load data
try:
    df = load_data('restaurant_inventory_data.csv')
    df['Date'] = pd.to_datetime(df['Date'])
except Exception as e:
    print(f"Error loading data: {e}")
    df = pd.DataFrame()  # Create empty DataFrame if file cannot be loaded

# Reinforcement Learning Agent for Dynamic Stock Adjustment
class RLStockOptimizer:
    def __init__(self, learning_rate=0.1, discount_factor=0.9, exploration_rate=0.2):
        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.exploration_rate = exploration_rate
        self.q_table = {}
        self.state_history = {}
    
    def get_state_key(self, demand, waste_percentage, stock_level, is_weekend, is_holiday, month):
        """Convert continuous state variables into discrete buckets for Q-learning"""
        # Discretize demand into buckets
        demand_bucket = int(demand / 10)
        
        # Discretize waste percentage into buckets
        waste_bucket = int(waste_percentage / 5)
        
        # Discretize stock level
        stock_bucket = int(stock_level / 10)
        
        return f"{demand_bucket}_{waste_bucket}_{stock_bucket}_{is_weekend}_{is_holiday}_{month}"
    
    def get_optimal_stock(self, ingredient, current_state, expected_demand):
        """Get optimal stock level based on Q-learning"""
        state_key = self.get_state_key(*current_state)
        
        # Initialize state in Q-table if not exists
        if state_key not in self.q_table:
            self.q_table[state_key] = {}
            # Initialize possible actions (stock levels as percentage of expected demand)
            for stock_percentage in range(100, 151, 10):  # 100% to 150% of expected demand
                self.q_table[state_key][stock_percentage] = 0
        
        # Exploration vs exploitation
        if np.random.random() < self.exploration_rate:
            # Explore: choose a random action
            action = np.random.choice(list(self.q_table[state_key].keys()))
        else:
            # Exploit: choose the best action
            action = max(self.q_table[state_key], key=self.q_table[state_key].get)
        
        # Calculate optimal stock level based on the chosen action (percentage)
        optimal_stock = int(expected_demand * (action / 100))
        
        return optimal_stock, action
    
    def update_q_table(self, ingredient, state, action, reward, next_state):
        """Update Q-table using the Q-learning algorithm"""
        state_key = self.get_state_key(*state)
        next_state_key = self.get_state_key(*next_state)
        
        # Initialize state in Q-table if not exists
        if state_key not in self.q_table:
            self.q_table[state_key] = {}
            for stock_percentage in range(100, 151, 10):
                self.q_table[state_key][stock_percentage] = 0
        
        # Initialize action in Q-table if not exists
        if action not in self.q_table[state_key]:
            self.q_table[state_key][action] = 0
        
        # Initialize next state if not exists
        if next_state_key not in self.q_table:
            self.q_table[next_state_key] = {}
            for stock_percentage in range(100, 151, 10):
                self.q_table[next_state_key][stock_percentage] = 0
        
        # Get the max Q-value for the next state
        max_next_q = max(self.q_table[next_state_key].values())
        
        # Update the Q-value for the current state-action pair
        current_q = self.q_table[state_key][action]
        new_q = current_q + self.learning_rate * (reward + self.discount_factor * max_next_q - current_q)
        self.q_table[state_key][action] = new_q
        
        # Record state-action history for this ingredient
        if ingredient not in self.state_history:
            self.state_history[ingredient] = []
        
        self.state_history[ingredient].append({
            'state': state,
            'action': action,
            'reward': reward,
            'q_value': new_q,
            'timestamp': datetime.now()
        })
    
    def calculate_reward(self, stock_level, demand, waste, unit_price):
        """Calculate reward based on stock coverage, waste and cost"""
        # Penalty for stock-out or near stock-out
        if stock_level < demand:
            stock_out_penalty = -50  # Heavy penalty for stock-out
        elif stock_level < demand * 1.1:
            stock_out_penalty = -10  # Smaller penalty for getting close to stock-out
        else:
            stock_out_penalty = 0
        
        # Penalty for waste
        waste_penalty = -1 * waste * unit_price
        
        # Penalty for over-stocking (holding cost)
        if stock_level > demand * 1.5:
            overstock_penalty = -0.1 * (stock_level - demand * 1.5) * unit_price
        else:
            overstock_penalty = 0
        
        # Calculate total reward
        reward = stock_out_penalty + waste_penalty + overstock_penalty
        
        return reward
    
    def save_model(self, filepath='rl_stock_optimizer.pkl'):
        """Save the Q-table and state history to a file"""
        with open(filepath, 'wb') as f:
            pickle.dump({'q_table': self.q_table, 'state_history': self.state_history}, f)
    
    def load_model(self, filepath='rl_stock_optimizer.pkl'):
        """Load the Q-table and state history from a file"""
        try:
            with open(filepath, 'rb') as f:
                data = pickle.load(f)
                self.q_table = data['q_table']
                self.state_history = data['state_history']
            return True
        except FileNotFoundError:
            return False

# Initialize RL optimizer
rl_optimizer = RLStockOptimizer()

# Try to load existing model
rl_optimizer.load_model()

def train_rl_model_with_historical_data(df):
    """Train the RL model using historical data"""
    # Sort data by date
    df_sorted = df.sort_values('Date')
    
    for ingredient in df_sorted['Ingredient'].unique():
        ingredient_data = df_sorted[df_sorted['Ingredient'] == ingredient]
        
        for i in range(1, len(ingredient_data)):
            prev_row = ingredient_data.iloc[i-1]
            curr_row = ingredient_data.iloc[i]
            
            # Create state tuple (demand, waste_percentage, stock_level, is_weekend, is_holiday, month)
            prev_state = (
                prev_row['Demand'], 
                prev_row['Waste_Percentage'],
                prev_row['Stock_Level'],
                prev_row['Is_Weekend'],
                prev_row['Is_Holiday'],
                prev_row['Month']
            )
            
            curr_state = (
                curr_row['Demand'], 
                curr_row['Waste_Percentage'],
                curr_row['Stock_Level'],
                curr_row['Is_Weekend'],
                curr_row['Is_Holiday'],
                curr_row['Month']
            )
            
            # Get the action that was taken (stock level as percentage of demand)
            if prev_row['Demand'] > 0:
                action = int((prev_row['Stock_Level'] / prev_row['Demand']) * 100)
                # Round to nearest 10
                action = round(action / 10) * 10
                # Keep within bounds
                action = max(100, min(150, action))
            else:
                action = 100  # Default if no demand
            
            # Calculate the reward
            reward = rl_optimizer.calculate_reward(
                prev_row['Stock_Level'],
                prev_row['Demand'],
                prev_row['Waste'],
                prev_row['Unit_Price']
            )
            
            # Update Q-table
            rl_optimizer.update_q_table(ingredient, prev_state, action, reward, curr_state)
    
    # Save the trained model
    rl_optimizer.save_model()

# Train the model if data is available
if not df.empty:
    train_rl_model_with_historical_data(df)

def calculate_ingredient_history(ingredient: str, df, rl_optimizer, waste_model, waste_features):
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

    for _, row in ingredient_data.iterrows():
        date_str = row['Date'].strftime('%Y-%m-%d')

        # State for RL agent
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

    # Forecast demand
    forecast_df, _, _ = forecast_demand(df, ingredient, forecast_days=7)

    # Predict waste
    waste_prediction_result = predict_waste_for_ingredient(df, ingredient, waste_model, waste_features)
    predicted_waste, predicted_waste_percentage = waste_prediction_result if waste_prediction_result else (0, 0)

    # Get latest data
    latest_data = ingredient_data.sort_values('Date', ascending=False).iloc[0]
    expected_demand = forecast_df.iloc[0]['Predicted_Demand']

    # Define RL state
    current_state = (
        expected_demand,
        predicted_waste_percentage,
        latest_data['Stock_Level'],
        1 if datetime.now().weekday() >= 5 else 0,
        0,  # Assuming not a holiday
        datetime.now().month
    )

    # Get recommended stock level
    recommended_stock, _ = rl_optimizer.get_optimal_stock(ingredient, current_state, expected_demand)

    # Confidence Score Calculation
    state_key = rl_optimizer.get_state_key(*current_state)
    confidence_score = 0.7  # Default

    if state_key in rl_optimizer.q_table:
        state_visits = sum(1 for entry in rl_optimizer.state_history.get(ingredient, []) 
                          if rl_optimizer.get_state_key(*entry['state']) == state_key)
        if state_visits > 10:
            confidence_score = 0.9
        elif state_visits > 5:
            confidence_score = 0.8
        elif state_visits > 0:
            confidence_score = 0.7
        else:
            confidence_score = 0.6

    # Recommended Order Calculation
    current_stock = latest_data['Stock_Level']
    recommended_order = max(0, int(recommended_stock) - int(current_stock))

    # Generate reasoning
    if current_stock >= recommended_stock:
        reasoning = "Current stock level is more than sufficient based on demand forecast and waste prediction."
    elif predicted_waste_percentage > 15:
        reasoning = "Reduced order suggested due to high predicted waste percentage."
    elif expected_demand > latest_data['Demand'] * 1.2:
        reasoning = "Increased order suggested due to expected demand spike."
    else:
        reasoning = "Standard replenishment based on optimal stock calculations."

    return {
        "current_stock": int(current_stock),
        "recommended_stock": int(recommended_stock),
        "recommended_order": recommended_order,
        "expected_demand": int(expected_demand),
        "confidence_score": confidence_score,
        "reasoning": reasoning,
    }