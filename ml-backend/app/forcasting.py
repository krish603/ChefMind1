import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import timedelta
from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
import warnings
warnings.filterwarnings('ignore')

# Load the data
df = pd.read_csv('data/restaurant_inventory_data.csv', parse_dates=['Date'])

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
        print(f"Best parameters: {best_params}")
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
        'rmse': rmse
    }

# Train models for each ingredient
def forecast_demand(df, ingredient, forecast_days=30, optimize=True):
    # Filter data for the specific ingredient
    ingredient_data = df[df['Ingredient'] == ingredient].copy()

    # Train Prophet model with optimized parameters
    prophet_results = train_prophet(ingredient_data, optimize=optimize)

    # Compare models
    print(f"Model performance for {ingredient}:")
    print(f"Prophet - MAE: {prophet_results['mae']:.2f}, RMSE: {prophet_results['rmse']:.2f}")

    # Generate future forecast
    last_date = ingredient_data['Date'].max()
    model = prophet_results['model']
    future = model.make_future_dataframe(periods=forecast_days)
    forecast = model.predict(future)
    future_forecast = forecast.tail(forecast_days)['yhat'].values

    # Round predictions to integers
    future_forecast = np.round(future_forecast).astype(int)

    # Create forecast dataframe
    forecast_df = pd.DataFrame({
        'Date': pd.date_range(start=ingredient_data['Date'].max() + pd.Timedelta(days=1), periods=forecast_days),
        'Ingredient': ingredient,
        'Predicted_Demand': future_forecast
    })

    return forecast_df, prophet_results

# Function to plot forecast
def plot_forecast(ingredient_data, forecast_df, prophet_results, ingredient):
    # Plot forecast
    plt.figure(figsize=(12, 6))

    # Original data
    plt.plot(ingredient_data['Date'], ingredient_data['Demand'], label='Historical Demand', color='blue')

    # Forecast
    plt.plot(forecast_df['Date'], forecast_df['Predicted_Demand'], label='Forecast', color='red', linestyle='--')

    plt.title(f'{ingredient} Demand Forecast (MAE: {prophet_results["mae"]:.2f}, RMSE: {prophet_results["rmse"]:.2f})')
    plt.xlabel('Date')
    plt.ylabel('Demand')
    plt.grid(True)
    plt.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

# Function to plot seasonal components
def plot_seasonal_components(prophet_results, ingredient):
    model = prophet_results['model']
    forecast = prophet_results['forecast']

    # Plot the components
    fig = model.plot_components(forecast)
    plt.suptitle(f'Seasonal Components for {ingredient} Demand')
    plt.tight_layout()
    plt.subplots_adjust(top=0.9)
    plt.show()

# Create specific plots for weekly, monthly, and yearly patterns
def plot_temporal_patterns(ingredient_data, ingredient):
    # Convert to datetime if not already
    ingredient_data['Date'] = pd.to_datetime(ingredient_data['Date'])

    # Extract time components
    ingredient_data['Day'] = ingredient_data['Date'].dt.day
    ingredient_data['DayOfWeek'] = ingredient_data['Date'].dt.dayofweek
    ingredient_data['Month'] = ingredient_data['Date'].dt.month
    ingredient_data['Year'] = ingredient_data['Date'].dt.year

    # Weekly pattern
    plt.figure(figsize=(10, 6))
    weekly_avg = ingredient_data.groupby('DayOfWeek')['Demand'].mean()
    plt.bar(weekly_avg.index, weekly_avg.values)
    plt.title(f'Average {ingredient} Demand by Day of Week')
    plt.xlabel('Day of Week (0=Monday, 6=Sunday)')
    plt.ylabel('Average Demand')
    plt.xticks(range(7), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.show()

    # Monthly pattern
    plt.figure(figsize=(10, 6))
    monthly_avg = ingredient_data.groupby('Month')['Demand'].mean()
    plt.bar(monthly_avg.index, monthly_avg.values)
    plt.title(f'Average {ingredient} Demand by Month')
    plt.xlabel('Month')
    plt.ylabel('Average Demand')
    plt.xticks(range(1, 13), ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.show()

    # Yearly pattern
    if len(ingredient_data['Year'].unique()) > 1:
        plt.figure(figsize=(10, 6))
        yearly_avg = ingredient_data.groupby('Year')['Demand'].mean()
        plt.plot(yearly_avg.index, yearly_avg.values, marker='o')
        plt.title(f'Average {ingredient} Demand by Year')
        plt.xlabel('Year')
        plt.ylabel('Average Demand')
        plt.grid(True, linestyle='--', alpha=0.7)
        plt.tight_layout()
        plt.show()

# Example usage for one ingredient with all visualizations
def analyze_ingredient(df, ingredient, forecast_days=30):
    # Filter data for the specific ingredient
    ingredient_data = df[df['Ingredient'] == ingredient].copy()

    # Get forecast and model results
    forecast_df, prophet_results = forecast_demand(df, ingredient, forecast_days, optimize=True)

    # Show forecast plot
    plot_forecast(ingredient_data, forecast_df, prophet_results, ingredient)

    # Show seasonal components from Prophet
    plot_seasonal_components(prophet_results, ingredient)

    # Show weekly, monthly, and yearly patterns
    plot_temporal_patterns(ingredient_data, ingredient)

    return forecast_df, prophet_results

# Example usage
# tomato_forecast, tomato_results = analyze_ingredient(df, 'Tomatoes', forecast_days=30)