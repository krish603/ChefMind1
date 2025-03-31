"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const InsightsCards = ({ wasteRatio, demandData, timeframe, item }) => {
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Calculate trend and other metrics from demandData
    const values = demandData[timeframe]?.map(item => item.Demand) || [];
    const demandTrend = values.length > 0 ? values[values.length - 1] - values[0] : 0;

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/ingredient-history/${encodeURIComponent(item)}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setRecommendation(data.recommendation);
            } catch (err) {
                console.error("Error fetching recommendation:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendation();
    }, [item]);

    const getWasteLevelText = (wastePercentage) => {
        if (wastePercentage > 20) return "High waste level";
        if (wastePercentage > 10) return "Moderate waste level";
        return "Optimal waste level";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2">
            {/* Demand Trend Card */}
            <Card className="shadow-xl border border-chefmind-green/30 bg-white rounded-xl overflow-hidden">
                <div className="bg-chefmind-green/10 p-3 border-b border-chefmind-green/20">
                    <h3 className="text-lg font-semibold text-chefmind-green">Demand Trend</h3>
                </div>
                <CardContent className="pt-2 flex items-center justify-between">
                    <div className="text-3xl font-bold text-chefmind-green">
                        {demandTrend > 0 ? "↑" : demandTrend < 0 ? "↓" : "→"}
                        {Math.abs(demandTrend).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                        {demandTrend > 0 
                            ? "Increasing demand trend" 
                            : demandTrend < 0 
                                ? "Decreasing demand trend" 
                                : "Stable demand"}
                    </div>
                </CardContent>
            </Card>

            {/* AI Recommendation Card */}
            <Card className="shadow-xl border-2 border-chefmind-teal/50 bg-gradient-to-br from-white to-chefmind-beige/20 rounded-xl">
                <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center">
                    <h3 className="text-lg md:text-xl font-semibold text-chefmind-teal mb-2">AI Recommendation</h3>
                    
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-4 py-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-amber-600 py-4">
                            Failed to load recommendation: {error}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4 w-full mb-3">
                                <div className="bg-white p-3 rounded-lg shadow-inner border border-chefmind-teal/20 text-center">
                                    <p className="text-sm text-gray-600">Current Stock</p>
                                    <div className="text-xl md:text-2xl font-bold text-chefmind-teal">
                                        {recommendation?.current_stock || '--'} units
                                    </div>
                                </div>
                                
                                <div className="bg-white p-3 rounded-lg shadow-inner border border-chefmind-teal/20 text-center">
                                    <p className="text-sm text-gray-600">Recommended</p>
                                    <div className={`text-xl md:text-2xl font-bold ${
                                        recommendation?.recommended_stock < recommendation?.current_stock 
                                            ? 'text-amber-600' 
                                            : 'text-chefmind-green'
                                    }`}>
                                        {recommendation?.recommended_stock || '--'} units
                                    </div>
                                </div>
                            </div>
                            
                            {/* {recommendation?.recommended_order > 0 && (
                                <div className="bg-chefmind-green/10 p-2 rounded-lg border border-chefmind-green/20 w-full mb-3 text-center">
                                    <p className="text-sm text-gray-600">Recommended Order</p>
                                    <div className="text-lg font-bold text-chefmind-green">
                                        {recommendation.recommended_order} units
                                    </div>
                                </div>
                            )} */}
                            
                            <p className="text-sm text-gray-600 text-center mt-2 px-4">
                                {recommendation?.reasoning || 'No recommendation available'}
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Waste Insight Card */}
            <Card className="shadow-xl border border-chefmind-teal/30 bg-white rounded-xl overflow-hidden">
                <div className="bg-chefmind-teal/10 p-3 border-b border-chefmind-teal/20">
                    <h3 className="text-lg font-semibold text-chefmind-teal">Waste Ratio</h3>
                </div>
                <CardContent className="pt-4 flex items-center justify-between">
                    <div className="text-3xl font-bold text-chefmind-teal">
                        {wasteRatio}%
                    </div>
                    <div className="text-sm text-gray-600">
                        {getWasteLevelText(parseFloat(wasteRatio))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InsightsCards;