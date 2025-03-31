"use client";
import React from 'react';

const IngredientCard = ({ ingredient, handleViewMore }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-chefmind-green/20 hover:shadow-lg transition-shadow duration-300">
            <div className="p-5 border-b border-chefmind-green/10">
                <h3 className="text-lg font-semibold text-chefmind-teal">{ingredient}</h3>
                <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">Current Inventory</div>
                    <div className="font-semibold text-gray-700">24 units</div>
                </div>
            </div>
            <div className="p-5">
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Weekly Demand</span>
                        <span className="font-medium text-chefmind-green">16.23 units</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-chefmind-green h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                </div>
                <div className="mb-5">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Waste Ratio</span>
                        <span className="font-medium text-amber-600">18.97%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: '18.97%' }}></div>
                    </div>
                </div>
                <button 
                    onClick={() => handleViewMore(ingredient)}
                    className="w-full bg-gradient-to-r from-chefmind-green to-chefmind-teal hover:from-chefmind-green/90 hover:to-chefmind-teal/90 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default IngredientCard;