"use client";
import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { ingredients as fetchIngredients } from '@/src/actions/graphActions';
import DemandAnalysisChart from '@/components/food-prediction/DemandAnalysisChart';
import IngredientsInventory from '@/components/food-prediction/IngredientsInventory';
import LoadingState from '@/components/loading-state';

Chart.register(...registerables);

const FoodPrediction = () => {
    const [ingredients, setIngredients] = useState([]);
    const [timeframe, setTimeframe] = useState('weekly');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadIngredients = async () => {
            try {
                const result = await fetchIngredients();
                if(result && result.success) {
                    setIngredients(result.data.ingredients);
                }
            } catch (error) {
                console.error('Error fetching ingredients:', error);
                setIngredients([]);
            } finally {
                setLoading(false);
            }
        };

        loadIngredients();
    }, []);

    return (
        <div className="min-h-screen bg-amber-50">
            <div className="p-6">
                        <DemandAnalysisChart 
                            timeframe={timeframe} 
                            setTimeframe={setTimeframe} 
                            ingredientsLength={ingredients.length} 
                        />
                {loading ? (
                    <LoadingState message="Loading ingredients..." />
                ) : ingredients.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-xl shadow-md border border-chefmind-green/20">
                        <svg 
                            className="mx-auto h-12 w-12 text-gray-400" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-700">No ingredients available</h3>
                        <p className="mt-1 text-gray-500">We couldn't find any ingredients to display</p>
                    </div>
                ) : (
                    <div>
                        
                        
                        <IngredientsInventory 
                            ingredients={ingredients} 
                            searchTerm={searchTerm} 
                            setSearchTerm={setSearchTerm} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodPrediction;