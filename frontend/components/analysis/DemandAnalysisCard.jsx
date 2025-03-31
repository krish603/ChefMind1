"use client";
import React, { useEffect ,useState} from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent } from "@/components/ui/card";
import { demand } from '@/src/actions/graphActions';
const DemandAnalysisCard = ({ timeframe, setTimeframe, isClient, item }) => {   
    // const ingredientData = {
    //     ingredient: item,
    //     patterns: {
    //         weekly: [
    //             { DayOfWeek: 0, DayName: "Monday", Demand: 30.61 },
    //             { DayOfWeek: 1, DayName: "Tuesday", Demand: 30.56 },
    //             { DayOfWeek: 2, DayName: "Wednesday", Demand: 30.09 },
    //             { DayOfWeek: 3, DayName: "Thursday", Demand: 30.28 },
    //             { DayOfWeek: 4, DayName: "Friday", Demand: 30.26 },
    //             { DayOfWeek: 5, DayName: "Saturday", Demand: 36.42 },
    //             { DayOfWeek: 6, DayName: "Sunday", Demand: 36.84 }
    //         ],
    //         monthly: [
    //             { Month: 1, MonthName: "January", Demand: 32.81 },
    //             { Month: 2, MonthName: "February", Demand: 35.12 },
    //             { Month: 3, MonthName: "March", Demand: 36.02 },
    //             { Month: 4, MonthName: "April", Demand: 36.05 },
    //             { Month: 5, MonthName: "May", Demand: 34.44 },
    //             { Month: 6, MonthName: "June", Demand: 31.03 },
    //             { Month: 7, MonthName: "July", Demand: 31.45 },
    //             { Month: 8, MonthName: "August", Demand: 26.06 },
    //             { Month: 9, MonthName: "September", Demand: 25.75 },
    //             { Month: 10, MonthName: "October", Demand: 26.90 },
    //             { Month: 11, MonthName: "November", Demand: 28.83 },
    //             { Month: 12, MonthName: "December", Demand: 41.34 }
    //         ],
    //         yearly: [
    //             { Year: 2023, Demand: 30.67 },
    //             { Year: 2024, Demand: 33.62 },
    //             { Year: 2025, Demand: 33.00 }
    //         ],
    //         daily: [
    //             { Day: 1, Demand: 32.72 },
    //             { Day: 2, Demand: 31.21 },
    //             { Day: 3, Demand: 31.92 },
    //             { Day: 4, Demand: 32.50 },
    //             { Day: 5, Demand: 31.63 },
    //             { Day: 6, Demand: 32.04 },
    //             { Day: 7, Demand: 32.17 },
    //             { Day: 8, Demand: 30.88 },
    //             { Day: 9, Demand: 31.79 },
    //             { Day: 10, Demand: 31.75 },
    //             { Day: 11, Demand: 31.92 },
    //             { Day: 12, Demand: 30.38 },
    //             { Day: 13, Demand: 30.25 },
    //             { Day: 14, Demand: 32.33 },
    //             { Day: 15, Demand: 32.96 },
    //             { Day: 16, Demand: 32.29 },
    //             { Day: 17, Demand: 32.08 },
    //             { Day: 18, Demand: 32.00 },
    //             { Day: 19, Demand: 32.00 },
    //             { Day: 20, Demand: 32.38 },
    //             { Day: 21, Demand: 32.00 },
    //             { Day: 22, Demand: 33.71 },
    //             { Day: 23, Demand: 32.33 },
    //             { Day: 24, Demand: 33.75 },
    //             { Day: 25, Demand: 31.79 },
    //             { Day: 26, Demand: 32.50 },
    //             { Day: 27, Demand: 32.38 },
    //             { Day: 28, Demand: 32.21 },
    //             { Day: 29, Demand: 33.17 },
    //             { Day: 30, Demand: 33.36 },
    //             { Day: 31, Demand: 32.57 }
    //         ]
    //     }
    // };

    const [ingredientData, setIngredientData] = useState(null)
useEffect(() => {
    try {
        const fetchDemandData = async () => {
            const response = await demand(item);
            if (response && response.success) {
                console.log("Demand data fetched successfully:", response.data);
                setIngredientData(response.data);
            } else {
                console.error("Failed to fetch demand data:", response.message);
            }
        };
        fetchDemandData();
    } catch (error) {
        
    }
},[])

    // Get the current data based on timeframe
    const currentData = ingredientData?.patterns["weekly"] ;
    
    if (!currentData || currentData.length === 0) {
        return (
            <Card className="shadow-xl border border-chefmind-green/30 bg-white rounded-xl overflow-hidden p-6">
                <p className="text-center text-gray-500">No demand data available for this timeframe</p>
            </Card>
        );
    }

    // Process labels and values
    const labels = currentData.map(item => {
        if (timeframe === 'weekly') return item.DayName;
        if (timeframe === 'monthly') return item.MonthName;
        if (timeframe === 'yearly') return item.Year.toString();
        return `Day ${item.Day}`;
    });

    const values = currentData.map(item => item.Demand);
    const avgDemand = values.reduce((sum, value) => sum + value, 0) / values.length;
    const maxDemand = Math.max(...values);
    const minDemand = Math.min(...values);
    const maxIndex = values.indexOf(maxDemand);
    const minIndex = values.indexOf(minDemand);

    const chartData = {
        labels: labels,
        datasets: [{
            label: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Demand (Units)`,
            data: values,
            borderColor: "#54aa52",
            backgroundColor: "rgba(84, 170, 82, 0.2)",
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "#54aa52",
            tension: 0.3,
            fill: true
        }]
    };

    return (
        <Card className="shadow-xl border border-chefmind-green/30 bg-white rounded-xl overflow-hidden transform transition-transform hover:shadow-2xl">
            <div className="bg-gradient-to-r from-chefmind-green/90 to-chefmind-green/70 p-3 md:p-4 flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold text-white">Demand Analysis</h3>
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="bg-white text-chefmind-green px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-50 transition-all shadow-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-chefmind-green/50"
                >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>
            <CardContent className="p-4 md:p-6">
                <div className="h-64 md:h-72">
                    {isClient && (
                        <Line
                            data={chartData}
                            options={{
                                maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'top',
                                        labels: {
                                            boxWidth: 12,
                                            usePointStyle: true,
                                            font: { size: 13 }
                                        }
                                    },
                                    tooltip: {
                                        backgroundColor: 'rgba(84, 170, 82, 0.8)',
                                        titleFont: { size: 14, weight: 'bold' },
                                        bodyFont: { size: 13 },
                                        padding: 10,
                                        cornerRadius: 8
                                    },
                                    title: {
                                        display: true,
                                        text: `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Product Demand Trend`,
                                        font: { size: 16 },
                                        color: '#255653',
                                        padding: { bottom: 15 }
                                    }
                                },
                                scales: {
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Demand (Units)',
                                            font: { weight: 'bold' }
                                        },
                                        ticks: { 
                                            color: "#255653", 
                                            font: { size: 12 } 
                                        },
                                        grid: { color: "rgba(84, 170, 82, 0.1)" },
                                        beginAtZero: true
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Date',
                                            font: { weight: 'bold' }
                                        },
                                        ticks: { 
                                            color: "#255653", 
                                            font: { size: 12 } 
                                        },
                                        grid: { 
                                            color: "rgba(84, 170, 82, 0.1)", 
                                            display: false 
                                        }
                                    }
                                },
                                elements: {
                                    line: {
                                        tension: 0.3
                                    }
                                }
                            }}
                        />
                    )}
                </div>
                
                <div className="mt-6 bg-chefmind-green/5 p-4 rounded-lg border border-chefmind-green/10">
                    <h4 className="font-semibold text-chefmind-teal mb-2">Key Insights:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Average demand: <span className="font-medium">{avgDemand.toFixed(2)} units</span></li>
                        <li>• Highest demand: <span className="font-medium">{labels[maxIndex]} ({maxDemand.toFixed(2)} units)</span></li>
                        <li>• Lowest demand: <span className="font-medium">{labels[minIndex]} ({minDemand.toFixed(2)} units)</span></li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default DemandAnalysisCard;