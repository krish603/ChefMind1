"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    TrendingUp,
    AlertCircle,
    RefreshCw,
    Check,
    ChevronDown
} from 'lucide-react';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Mock data for demonstration
const MOCK_DISHES = [
    {
        id: 1,
        name: "Garden Fresh Salad",
        currentCost: 4.75,
        suggestedCost: 4.25,
        profit: 8.25,
        suggestedProfit: 8.75,
        ingredients: [
            { name: "Lettuce", amount: "150g", cost: 1.20, suggestion: "Reduce to 120g", savings: 0.25 },
            { name: "Tomatoes", amount: "100g", cost: 0.85, suggestion: null, savings: 0 },
            { name: "Bell Peppers", amount: "50g", cost: 0.95, suggestion: "Use seasonal peppers", savings: 0.15 },
            { name: "Onions", amount: "30g", cost: 0.25, suggestion: null, savings: 0 },
            { name: "Olive Oil", amount: "15ml", cost: 0.75, suggestion: "Use house blend", savings: 0.10 },
            { name: "Herbs", amount: "5g", cost: 0.75, suggestion: null, savings: 0 },
        ]
    },
    {
        id: 2,
        name: "Roasted Vegetable Medley",
        currentCost: 5.85,
        suggestedCost: 5.15,
        profit: 7.15,
        suggestedProfit: 7.85,
        ingredients: [
            { name: "Carrots", amount: "150g", cost: 0.95, suggestion: null, savings: 0 },
            { name: "Cabbage", amount: "100g", cost: 0.75, suggestion: "Increase to 120g (surplus)", savings: 0.20 },
            { name: "Bell Peppers", amount: "100g", cost: 1.90, suggestion: "Reduce to 80g", savings: 0.40 },
            { name: "Onions", amount: "80g", cost: 0.65, suggestion: null, savings: 0 },
            { name: "Herbs", amount: "10g", cost: 1.60, suggestion: "Use dried herbs", savings: 0.10 },
        ]
    },
    {
        id: 3,
        name: "Tomato Basil Soup",
        currentCost: 3.95,
        suggestedCost: 3.45,
        profit: 6.05,
        suggestedProfit: 6.55,
        ingredients: [
            { name: "Tomatoes", amount: "300g", cost: 1.80, suggestion: "Use surplus tomatoes", savings: 0.30 },
            { name: "Onions", amount: "50g", cost: 0.40, suggestion: null, savings: 0 },
            { name: "Basil", amount: "15g", cost: 0.95, suggestion: "Use house-grown basil", savings: 0.20 },
            { name: "Vegetable Stock", amount: "500ml", cost: 0.60, suggestion: null, savings: 0 },
            { name: "Cream", amount: "30ml", cost: 0.20, suggestion: null, savings: 0 },
        ]
    }
];

export default function CostOptimization() {
    const [dishes, setDishes] = useState(MOCK_DISHES);
    const [selectedDish, setSelectedDish] = useState(dishes[0]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [appliedSuggestions, setAppliedSuggestions] = useState([]);

    const analyzeCosts = () => {
        setIsAnalyzing(true);
        // Simulate API call
        setTimeout(() => {
            setIsAnalyzing(false);
        }, 1500);
    };

    const applySuggestions = (dishId) => {
        if (!appliedSuggestions.includes(dishId)) {
            setAppliedSuggestions([...appliedSuggestions, dishId]);
        }
    };

    const totalSavings = dishes.reduce((acc, dish) => {
        return acc + (dish.currentCost - dish.suggestedCost);
    }, 0).toFixed(2);

    const totalProfitIncrease = dishes.reduce((acc, dish) => {
        return acc + (dish.suggestedProfit - dish.profit);
    }, 0).toFixed(2);

    const percentageSavings = (((dishes.reduce((acc, dish) => acc + dish.currentCost, 0) -
        dishes.reduce((acc, dish) => acc + dish.suggestedCost, 0)) /
        dishes.reduce((acc, dish) => acc + dish.currentCost, 0)) * 100).toFixed(1);

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold text-[#1e4d40]">Cost Optimization</h1>
                    <p className="text-gray-600 mt-1">Optimize dish costs and increase profit margins</p>
                </div>
                <Button
                    onClick={analyzeCosts}
                    className="bg-[#1e4d40] hover:bg-[#163a30] flex items-center gap-2"
                    disabled={isAnalyzing}
                >
                    <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="overflow-hidden shadow-md border-[#5ba36a]/20 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="bg-[#e8f5e9] pb-2">
                        <CardTitle className="text-lg text-[#1e4d40] flex items-center">
                            <DollarSign className="h-5 w-5 mr-1" />
                            Potential Savings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-baseline">
                            <div className="text-3xl font-bold text-[#1e4d40]">${totalSavings}</div>
                            <div className="ml-2 text-sm px-2 py-1 bg-[#e8f5e9] rounded-full text-[#1e4d40] font-medium">
                                {percentageSavings}%
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Across all menu items</p>
                        <div className="mt-3 h-2 bg-gray-100 rounded-full w-full">
                            <div
                                className="h-2 bg-[#5ba36a] rounded-full"
                                style={{ width: `${percentageSavings}%` }}
                            ></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-md border-[#5ba36a]/20 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="bg-[#e8f5e9] pb-2">
                        <CardTitle className="text-lg text-[#1e4d40] flex items-center">
                            <TrendingUp className="h-5 w-5 mr-1" />
                            Profit Increase
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-baseline">
                            <div className="text-3xl font-bold text-[#1e4d40]">${totalProfitIncrease}</div>
                            <div className="ml-2 text-sm px-2 py-1 bg-[#e8f5e9] rounded-full text-[#1e4d40] font-medium">
                                +{((totalProfitIncrease / dishes.reduce((acc, dish) => acc + dish.profit, 0)) * 100).toFixed(1)}%
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">With suggested changes</p>
                        <div className="mt-3 flex items-center text-sm">
                            <div className="flex items-center mr-4">
                                <div className="w-3 h-3 bg-[#1e4d40] rounded-full mr-1"></div>
                                <span>Current</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#5ba36a] rounded-full mr-1"></div>
                                <span>Suggested</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden shadow-md border-[#5ba36a]/20 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="bg-[#e8f5e9] pb-2">
                        <CardTitle className="text-lg text-[#1e4d40] flex items-center">
                            <AlertCircle className="h-5 w-5 mr-1" />
                            Optimization Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-3xl font-bold text-[#1e4d40]">
                            {appliedSuggestions.length}/{dishes.length}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Optimizations applied</p>
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">Progress</span>
                                <span className="text-xs font-medium text-[#1e4d40]">
                                    {Math.round((appliedSuggestions.length / dishes.length) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full w-full">
                                <div
                                    className="h-2 bg-[#5ba36a] rounded-full"
                                    style={{ width: `${(appliedSuggestions.length / dishes.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-[#5ba36a]/20 shadow-md overflow-hidden">
                <CardHeader className="bg-gray-50 border-b border-[#5ba36a]/10 py-4">
                    <CardTitle className="text-[#1e4d40] text-xl flex items-center">
                        <span className="mr-2">Dish Cost Analysis</span>
                        <span className="bg-[#e8f5e9] text-[#1e4d40] text-xs py-1 px-2 rounded-full">
                            {dishes.length} dishes analyzed
                        </span>
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Select a dish to view detailed cost breakdown and optimization suggestions
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs defaultValue={selectedDish.id.toString()} onValueChange={(value) => {
                        const dish = dishes.find(d => d.id.toString() === value);
                        if (dish) setSelectedDish(dish);
                    }}>
                        <TabsList className="w-full justify-start border-b border-[#5ba36a]/10 rounded-none bg-white overflow-x-auto flex-nowrap">
                            {dishes.map((dish) => (
                                <TabsTrigger
                                    key={dish.id}
                                    value={dish.id.toString()}
                                    className="data-[state=active]:bg-[#e8f5e9] data-[state=active]:text-[#1e4d40] data-[state=active]:border-b-2 data-[state=active]:border-[#5ba36a] rounded-none whitespace-nowrap flex items-center gap-2"
                                >
                                    {dish.name}
                                    {appliedSuggestions.includes(dish.id) && (
                                        <span className="bg-[#5ba36a] text-white p-1 rounded-full flex items-center justify-center">
                                            <Check className="h-3 w-3" />
                                        </span>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {dishes.map((dish) => (
                            <TabsContent key={dish.id} value={dish.id.toString()} className="p-6">
                                <div className="bg-[#f9fdf9] p-4 rounded-lg mb-6 border border-[#5ba36a]/20">
                                    <h3 className="font-medium text-[#1e4d40] mb-2">Cost & Profit Summary</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Current Cost:</span>
                                                <span className="font-semibold">${dish.currentCost.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Suggested Cost:</span>
                                                <span className="font-semibold text-[#5ba36a] flex items-center">
                                                    ${dish.suggestedCost.toFixed(2)}
                                                    <ArrowDownRight className="ml-1 h-4 w-4" />
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-100 w-full rounded-full">
                                                <div
                                                    className="h-2 bg-[#5ba36a] rounded-full"
                                                    style={{ width: `${(dish.suggestedCost / dish.currentCost) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Potential savings: <span className="font-medium text-[#5ba36a]">${(dish.currentCost - dish.suggestedCost).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Current Profit:</span>
                                                <span className="font-semibold">${dish.profit.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Suggested Profit:</span>
                                                <span className="font-semibold text-[#5ba36a] flex items-center">
                                                    ${dish.suggestedProfit.toFixed(2)}
                                                    <ArrowUpRight className="ml-1 h-4 w-4" />
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-100 w-full rounded-full">
                                                <div
                                                    className="h-2 bg-[#5ba36a] rounded-full"
                                                    style={{ width: `${(dish.profit / dish.suggestedProfit) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Profit increase: <span className="font-medium text-[#5ba36a]">+${(dish.suggestedProfit - dish.profit).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="font-medium text-[#1e4d40] mb-3">Ingredient Breakdown</h3>
                                <div className="border rounded-lg overflow-hidden shadow-sm">
                                    <div className="grid grid-cols-5 bg-[#f3f9f4] p-3 border-b">
                                        <div className="col-span-1 font-medium text-[#1e4d40]">Ingredient</div>
                                        <div className="col-span-1 font-medium text-[#1e4d40]">Amount</div>
                                        <div className="col-span-1 font-medium text-[#1e4d40]">Cost</div>
                                        <div className="col-span-1 font-medium text-[#1e4d40]">Suggestion</div>
                                        <div className="col-span-1 font-medium text-[#1e4d40]">Savings</div>
                                    </div>

                                    {dish.ingredients.map((ingredient, idx) => (
                                        <div key={idx} className={`grid grid-cols-5 p-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${idx !== dish.ingredients.length - 1 ? 'border-b' : ''} hover:bg-[#f9fdf9] transition-colors duration-150`}>
                                            <div className="col-span-1 font-medium">{ingredient.name}</div>
                                            <div className="col-span-1">{ingredient.amount}</div>
                                            <div className="col-span-1">${ingredient.cost.toFixed(2)}</div>
                                            <div className="col-span-1 text-[#5ba36a] font-medium">{ingredient.suggestion || '-'}</div>
                                            <div className="col-span-1">
                                                {ingredient.savings > 0 ? (
                                                    <span className="text-[#5ba36a] flex items-center font-medium">
                                                        ${ingredient.savings.toFixed(2)}
                                                        <ArrowDownRight className="ml-1 h-4 w-4" />
                                                    </span>
                                                ) : '-'}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="bg-[#f3f9f4] p-3 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-[#1e4d40]">Total Potential Savings:</span>
                                            <span className="font-bold text-[#5ba36a]">
                                                ${dish.ingredients.reduce((acc, ing) => acc + ing.savings, 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <Button
                                        className={`${appliedSuggestions.includes(dish.id)
                                            ? 'bg-gray-300 text-gray-700 hover:bg-gray-300 cursor-not-allowed'
                                            : 'bg-[#5ba36a] hover:bg-[#4c8d59]'}`}
                                        onClick={() => applySuggestions(dish.id)}
                                        disabled={appliedSuggestions.includes(dish.id)}
                                    >
                                        {appliedSuggestions.includes(dish.id) ? (
                                            <span className="flex items-center">
                                                <Check className="mr-2 h-4 w-4" />
                                                Suggestions Applied
                                            </span>
                                        ) : (
                                            "Apply Suggestions"
                                        )}
                                    </Button>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>

            <div className="bg-[#f9fdf9] p-4 rounded-lg border border-[#5ba36a]/20 flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-[#1e4d40]">Real-time Cost Impact</h3>
                    <p className="text-sm text-gray-600">Apply suggestions to see immediate impact on your bottom line</p>
                </div>
                <Button className="bg-white text-[#1e4d40] border border-[#5ba36a] hover:bg-[#f3f9f4]">
                    <span className="flex items-center">
                        View Reports
                        <ChevronDown className="ml-1 h-4 w-4" />
                    </span>
                </Button>
            </div>
        </div>
    );
}