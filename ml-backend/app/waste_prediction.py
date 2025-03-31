import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from pydantic import BaseModel

def load_data(file_path):
    df = pd.read_csv(file_path)
    return df

def prepare_waste_features(df):
    data = df.copy()
    
    for ingredient in data['Ingredient'].unique():
        ingredient_data = data[data['Ingredient'] == ingredient].sort_values('Date')
        
        for lag in [1, 2, 3, 7]:
            data.loc[data['Ingredient'] == ingredient, f'Demand_Lag_{lag}'] = \
                ingredient_data['Demand'].shift(lag).values
            data.loc[data['Ingredient'] == ingredient, f'Waste_Lag_{lag}'] = \
                ingredient_data['Waste'].shift(lag).values
        
        data.loc[data['Ingredient'] == ingredient, 'Demand_Rolling_7d'] = \
            ingredient_data['Demand'].rolling(7).mean().values
        data.loc[data['Ingredient'] == ingredient, 'Waste_Rolling_7d'] = \
            ingredient_data['Waste'].rolling(7).mean().values
    
    data = data.dropna()
    data['Demand_Volatility'] = data['Demand'] / data['Demand_Rolling_7d']
    ingredient_dummies = pd.get_dummies(data['Ingredient'], prefix='Ingredient')
    data = pd.concat([data, ingredient_dummies], axis=1)
    
    return data

def train_waste_model(X_train, y_train):
    rf = RandomForestRegressor(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    return rf

def analyze_ingredient_waste(df, ingredient):
    """
    Analyze waste trends for a given ingredient.
    
    Args:
        df (DataFrame): The dataset containing restaurant inventory data.
        ingredient (str): The ingredient to analyze.
        
    Returns:
        float: The average waste for the past year.
    """
    # Convert Date column to datetime (if not already done)
    df["Date"] = pd.to_datetime(df["Date"])

    # Filter data for the given ingredient
    ingredient_df = df[df["Ingredient"] == ingredient]

    # Get the date range for the past year
    one_year_ago = df["Date"].max() - pd.DateOffset(years=1)

    # Filter records within the last year
    recent_data = ingredient_df[ingredient_df["Date"] >= one_year_ago]

    # Calculate average waste
    avg_waste = recent_data["Waste"].mean()

    return avg_waste


def predict_waste_for_ingredient(df, ingredient, waste_model, waste_features):
    prepared_data = prepare_waste_features(df)
    latest_data = prepared_data[prepared_data['Ingredient'] == ingredient].sort_values('Date').tail(1)
    
    if latest_data.empty:
        return None
    
    latest_X = latest_data[waste_features]
    waste_prediction = waste_model.predict(latest_X)[0]
    predicted_waste_percentage = float((waste_prediction / latest_data['Demand'].values[0]) * 100)
    
    return waste_prediction, predicted_waste_percentage

# Load and prepare data
df = load_data('restaurant_inventory_data.csv')
waste_data = prepare_waste_features(df)
waste_features = [col for col in waste_data.columns if col.startswith('Demand_') or
                  col.startswith('Waste_') or col.startswith('Ingredient_') or col in ['Stock_Level']]
X = waste_data[waste_features]
y = waste_data['Waste']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
waste_model = train_waste_model(X_train, y_train)

# API Response Model
class WasteResponse(BaseModel):
    ingredient: str
    predicted_waste: float
    predicted_waste_percentage: float
