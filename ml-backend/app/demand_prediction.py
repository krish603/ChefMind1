import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error

from typing import List, Optional
from pydantic import BaseModel
import warnings
warnings.filterwarnings('ignore')

# Load the data
df = pd.read_csv('restaurant_inventory_data.csv', parse_dates=['Date'])

# Pydantic models for responses
class Forecast(BaseModel):
    Date: str
    Ingredient: str
    Predicted_Demand: int

class Metrics(BaseModel):
    mae: float
    rmse: float

class ForecastResponse(BaseModel):
    ingredient: str
    forecast: List[dict]
    metrics: dict

class PatternItem(BaseModel):
    DayOfWeek: Optional[int] = None
    DayName: Optional[str] = None
    Month: Optional[int] = None
    MonthName: Optional[str] = None
    Year: Optional[int] = None
    Day: Optional[int] = None
    Demand: float

class PatternsResponse(BaseModel):
    ingredient: str
    patterns: dict

class ChartData(BaseModel):
    date: str
    actual: Optional[float] = None
    predicted: float

class ChartResponse(BaseModel):
    ingredient: str
    chart_data: List[dict]
    metrics: dict

class IngredientsResponse(BaseModel):
    ingredients: List[str]

# Function to train and evaluate Prophet model with improved parameters
def train_prophet(ingredient_data, optimize=True):
    # Prepare data
    prophet_data = ingredient_data[['Date', 'Demand']].rename(columns={'Date': 'ds', 'Demand': 'y'})

    # Train-test split
    train_size = int(len(prophet_data) * 0.8)
    train = prophet_data[:train_size]
    test = prophet_data[train_size:]

    if optimize:
        # Try different parameter combinations to find optimal settings
        best_mae = float('inf')
        best_params = {}
        best_model = None
        best_forecast = None

        # Parameter grid search
        changepoint_prior_scales = [0.001, 0.01, 0.05, 0.1, 0.5]
        seasonality_prior_scales = [0.01, 0.1, 1.0, 10.0]

        for cp_scale in changepoint_prior_scales:
            for s_scale in seasonality_prior_scales:
                # Fit Prophet model with current parameters
                model = Prophet(
                    yearly_seasonality=True,
                    weekly_seasonality=True,
                    daily_seasonality=False,
                    changepoint_prior_scale=cp_scale,
                    seasonality_prior_scale=s_scale
                )
                model.add_country_holidays(country_name='US')
                model.fit(train)

                # Make predictions
                future = model.make_future_dataframe(periods=len(test))
                forecast = model.predict(future)

                # Extract predictions for test period
                predictions = forecast.iloc[train_size:]['yhat'].values

                # Evaluate
                mae = mean_absolute_error(test['y'].values, predictions)

                # Update best parameters if current combination is better
                if mae < best_mae:
                    best_mae = mae
                    best_params = {'changepoint_prior_scale': cp_scale, 'seasonality_prior_scale': s_scale}
                    best_model = model
                    best_forecast = forecast

        # Use best model for final evaluation
        model = best_model
        forecast = best_forecast
    else:
        # Use default improved parameters
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            changepoint_prior_scale=0.05,
            seasonality_prior_scale=10.0
        )
        model.add_country_holidays(country_name='US')
        model.fit(train)

        # Make predictions
        future = model.make_future_dataframe(periods=len(test))
        forecast = model.predict(future)

    # Extract predictions for test period
    predictions = forecast.iloc[train_size:]['yhat'].values

    # Evaluate
    mae = mean_absolute_error(test['y'].values, predictions)
    rmse = np.sqrt(mean_squared_error(test['y'].values, predictions))

    return {
        'model': model,
        'forecast': forecast,
        'predictions': predictions,
        'actual': test['y'].values,
        'mae': mae,
        'rmse': rmse,
        'train_size': train_size
    }

# Train models for each ingredient
def forecast_demand(df, ingredient, forecast_days=30, optimize=True):
    # Filter data for the specific ingredient
    ingredient_data = df[df['Ingredient'] == ingredient].copy()
    
    if ingredient_data.empty:
        raise ValueError(f"No data found for ingredient: {ingredient}")

    # Train Prophet model with optimized parameters
    prophet_results = train_prophet(ingredient_data, optimize=optimize)

    # Generate future forecast
    model = prophet_results['model']
    future = model.make_future_dataframe(periods=forecast_days)
    forecast = model.predict(future)
    future_forecast = forecast.tail(forecast_days)['yhat'].values

    # Round predictions to integers
    future_forecast = np.round(future_forecast).astype(int)

    # COMPLETELY REVISED: Let Prophet handle the future dates directly
    # Get the forecast dates from the Prophet forecast dataframe
    forecast_dates = forecast.tail(forecast_days)['ds'].values
    
    # Create the forecast dataframe
    forecast_df = pd.DataFrame({
        'Date': forecast_dates,
        'Ingredient': ingredient,
        'Predicted_Demand': future_forecast
    })

    return forecast_df, prophet_results, ingredient_data

# Get pattern data for Three.js visualization
def get_temporal_patterns(ingredient_data):
    # Convert to datetime if not already
    ingredient_data['Date'] = pd.to_datetime(ingredient_data['Date'])

    # Extract time components
    ingredient_data['Day'] = ingredient_data['Date'].dt.day
    ingredient_data['DayOfWeek'] = ingredient_data['Date'].dt.dayofweek
    ingredient_data['Month'] = ingredient_data['Date'].dt.month
    ingredient_data['Year'] = ingredient_data['Date'].dt.year

    # Weekly pattern
    weekly_avg = ingredient_data.groupby('DayOfWeek')['Demand'].mean().reset_index()
    weekly_avg['DayName'] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weekly_pattern = weekly_avg[['DayOfWeek', 'DayName', 'Demand']].to_dict(orient='records')

    # Monthly pattern
    monthly_avg = ingredient_data.groupby('Month')['Demand'].mean().reset_index()
    month_names = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December']
    monthly_avg['MonthName'] = [month_names[i-1] for i in monthly_avg['Month']]
    monthly_pattern = monthly_avg[['Month', 'MonthName', 'Demand']].to_dict(orient='records')

    # Daily pattern
    daily_avg = ingredient_data.groupby('Day')['Demand'].mean().reset_index()
    daily_pattern = daily_avg[['Day', 'Demand']].to_dict(orient='records')

    # Yearly pattern (if more than one year of data)
    yearly_pattern = None
    if len(ingredient_data['Year'].unique()) > 1:
        yearly_avg = ingredient_data.groupby('Year')['Demand'].mean().reset_index()
        yearly_pattern = yearly_avg.to_dict(orient='records')

    return {
        'weekly': weekly_pattern,
        'monthly': monthly_pattern,
        'yearly': yearly_pattern,
        'daily': daily_pattern
    }

def get_chart_data(ingredient_data, prophet_results, forecast_days=30):
    # Get model and forecast data
    model = prophet_results['model']
    
    # Create future dataframe for forecast (including historical dates for comparison)
    future = model.make_future_dataframe(periods=forecast_days)
    forecast = model.predict(future)
    
    # Ensure ingredient_data['Date'] is datetime type
    ingredient_data_copy = ingredient_data.copy()
    ingredient_data_copy['Date'] = pd.to_datetime(ingredient_data_copy['Date'])
    
    # Merge with actual data for historical comparison
    historical_data = ingredient_data_copy[['Date', 'Demand']].rename(columns={'Date': 'ds', 'Demand': 'actual'})
    
    # Ensure both dataframes have the same datetime type
    historical_data['ds'] = pd.to_datetime(historical_data['ds'])
    forecast['ds'] = pd.to_datetime(forecast['ds'])
    
    # Use pd.merge with explicit type conversion or pd.concat as suggested by the error
    chart_data = pd.merge(forecast[['ds', 'yhat']], historical_data, on='ds', how='left')
    
    # Rename and format columns
    chart_data = chart_data.rename(columns={'ds': 'date', 'yhat': 'predicted'})
    chart_data['date'] = chart_data['date'].dt.strftime('%Y-%m-%d')
    
    # Round predicted values
    chart_data['predicted'] = np.round(chart_data['predicted']).astype(float)
    
    return chart_data.to_dict(orient='records')