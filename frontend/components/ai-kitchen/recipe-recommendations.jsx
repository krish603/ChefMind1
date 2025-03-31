"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Utensils, ThumbsUp, ArrowLeft, RefreshCw, Star } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const MOCK_RECOMMENDATIONS = [
    {
        id: 1,
        name: "Grilled Chicken & Bell Pepper Pasta Salad",
        description: "A vibrant and flavorful pasta salad with grilled chicken, roasted bell peppers, and crisp lettuce, tossed in a light vinaigrette.",
        ingredients: ["Lettuce", "Bell Peppers", "Chicken", "Pasta"],
        expiryAlert: true,
        preparationTime: "45 mins",
        wasteReduction: 75.7,
        mealType: "main",
    },
    {
        id: 2,
        name: "Beef & Cherry Tomato Stir-Fry with Ginger Sauce",
        description: "Tender beef strips stir-fried with juicy cherry tomatoes and a savory ginger sauce, served over rice.",
        ingredients: ["Beef", "Tomatoes", "Ginger"],
        expiryAlert: true,
        preparationTime: "30 mins",
        wasteReduction: 19.56,
        mealType: "main",
    },
    {
        id: 3,
        name: "Cheesy Baked Oats with Cherry Compote",
        description: "Warm and comforting baked oats with melted cheese and a sweet cherry compote topping, perfect for breakfast or brunch.",
        ingredients: ["Cheese", "Oats", "Cherries"],
        expiryAlert: false,
        preparationTime: "40 mins",
        wasteReduction: 17.85,
        mealType: "dessert",
    },
]

export default function RecipeRecommendations() {
    const [recommendations, setRecommendations] = useState(MOCK_RECOMMENDATIONS)
    const [isLoading, setIsLoading] = useState(false)
    const [favoriteRecipes, setFavoriteRecipes] = useState([])

    const refreshRecommendations = () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
        }, 1500)
    }

    const toggleFavorite = (recipeId) => {
        setFavoriteRecipes(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Header Section with Improved Layout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#e8f5e9] to-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1e4d40]">Recipe Recommendations</h1>
                        <p className="text-gray-600 mt-1">Based on your current inventory and expiry dates</p>
                    </div>
                </div>
                <Button
                    onClick={refreshRecommendations}
                    className="bg-[#1e4d40] hover:bg-[#163a30] shadow-sm transition-all duration-300 px-4"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing Inventory...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Recommendations
                        </>
                    )}
                </Button>
            </div>

            {/* Recipe Grid with Improved Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((recipe) => (
                    <Card
                        key={recipe.id}
                        className="overflow-hidden border border-[#5ba36a]/20 shadow-md hover:shadow-lg transition-all duration-300 h-96 flex flex-col"
                    >
                        <div className="relative bg-[#e8f5e9]/30 h-4"></div>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-[#1e4d40] text-xl line-clamp-1">{recipe.name}</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-amber-500"
                                    onClick={() => toggleFavorite(recipe.id)}
                                >
                                    <Star
                                        className={`h-5 w-5 ${favoriteRecipes.includes(recipe.id) ? "fill-amber-500" : "fill-transparent"
                                            }`}
                                    />
                                </Button>
                            </div>
                            <CardDescription className="line-clamp-2 text-gray-600">{recipe.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1">
                            {recipe.expiryAlert && (
                                <Badge className="w-fit bg-amber-500 text-white px-3 py-1 font-medium">
                                    Uses Soon-to-Expire Items
                                </Badge>
                            )}

                            <div className="flex flex-wrap pt-3 gap-1.5">
                                {recipe.ingredients.map((ingredient, idx) => (
                                    <Badge
                                        key={idx}
                                        variant="outline"
                                        className="bg-[#e8f5e9] text-[#1e4d40] px-2.5 py-0.5"
                                    >
                                        {ingredient}
                                    </Badge>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm bg-[#f9faf9] px-3 pt-3 rounded-md">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-[#5ba36a]" />
                                    <span className="font-medium">{recipe.preparationTime}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ThumbsUp className="h-4 w-4 text-[#5ba36a]" />
                                    <span className="font-medium">{recipe.wasteReduction.toFixed(1)}%</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Utensils className="h-4 w-4 text-[#5ba36a]" />
                                    <span className="capitalize font-medium">{recipe.mealType}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center bg-gray-50 border-t border-[#5ba36a]/10 p-4">
                            <Button className="bg-[#1e4d40] hover:bg-[#163a30] text-white w-full shadow-sm transition-all duration-300">
                                View Recipe
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}