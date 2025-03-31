"use client";
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardContent } from '@/components/ui/card';

const DemandAnalysisChart = ({ timeframe, setTimeframe, ingredientsLength }) => {
    const chartLabels = {
        daily: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        weekly: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    };

    const generateChartData = (length, variance = 10) => {
        return chartLabels[timeframe].map(() =>
            Math.max(0, Math.random() * variance)
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
            <Card className="overflow-hidden border-0 shadow-xl rounded-xl bg-white">
                <div className="bg-gradient-to-r from-chefmind-green/90 to-chefmind-green/70 p-3 md:p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Demand Analysis</h2>
                        <p className="text-green-100 text-sm">Sample demand data</p>
                    </div>
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="bg-white text-chefmind-green px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-50 transition-all shadow-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-chefmind-green/50"
                    >
                        <option value="daily">Daily View</option>
                        <option value="weekly">Weekly View</option>
                        <option value="monthly">Monthly View</option>
                    </select>
                </div>
                <CardContent className="p-4">
                    <div className="h-64">
                        <Line
                            data={{
                                labels: chartLabels[timeframe],
                                datasets: [
                                    {
                                        label: 'Sample Demand',
                                        data: generateChartData(ingredientsLength, 5),
                                        borderColor: '#54aa52',
                                        backgroundColor: 'rgba(84, 170, 82, 0.2)',
                                        borderWidth: 2,
                                        tension: 0.4,
                                        fill: true,
                                        pointBackgroundColor: '#54aa52',
                                        pointRadius: 4,
                                        pointHoverRadius: 6
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                        labels: {
                                            boxWidth: 10,
                                            font: { size: 12 }
                                        }
                                    },
                                    tooltip: {
                                        backgroundColor: 'rgba(37, 86, 83, 0.8)',
                                        titleFont: { size: 14 },
                                        bodyFont: { size: 13 },
                                        padding: 10,
                                        cornerRadius: 6
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            color: 'rgba(84, 170, 82, 0.1)'
                                        },
                                        ticks: {
                                            color: '#255653'
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false
                                        },
                                        ticks: {
                                            color: '#255653'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DemandAnalysisChart;