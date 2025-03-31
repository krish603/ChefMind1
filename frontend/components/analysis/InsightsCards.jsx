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
    const suggestion = parseFloat(wasteRatio) > 15 ? "Buy Less Next Time" : "Stock More";

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://1a17-202-131-110-12.ngrok-free.app/api/ingredient-history/${item}`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json(); // Convert response to JSON
        
                console.log("Recommendation data:", data);
                setRecommendation(data.recommendation);
            } catch (err) {
                console.log("Error fetching recommendation:", err);
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
                    <div className="bg-white p-3 rounded-full shadow-inner border border-chefmind-teal/20 mb-2">
                        <div className={`text-xl md:text-2xl font-bold ${suggestion === "Stock More" ? "text-chefmind-green" : "text-amber-600"} px-4`}>
                            {suggestion}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center mt-2">
                        Based on current waste-to-demand ratio
                    </p>
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