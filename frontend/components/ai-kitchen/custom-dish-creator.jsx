"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChefHat, Sparkles, Clock, DollarSign, Utensils, PlusCircle, Trash2, ArrowLeft } from "lucide-react"

// Mock data for demonstration
const MOCK_INGREDIENTS = [
    { id: 1, name: "Lettuce", quantity: 24, unit: "units", expiring: true },
    { id: 2, name: "Tomatoes", quantity: 24, unit: "units", expiring: false },
    { id: 3, name: "Bell Peppers", quantity: 24, unit: "units", expiring: false },
    { id: 4, name: "Onions", quantity: 24, unit: "units", expiring: false },
    { id: 5, name: "Carrots", quantity: 24, unit: "units", expiring: true },
    { id: 6, name: "Cabbage", quantity: 24, unit: "units", expiring: false },
    { id: 7, name: "Olive Oil", quantity: 5, unit: "liters", expiring: false },
    { id: 8, name: "Basil", quantity: 10, unit: "bunches", expiring: true },
    { id: 9, name: "Vegetable Stock", quantity: 8, unit: "liters", expiring: false },
    { id: 10, name: "Cream", quantity: 3, unit: "liters", expiring: false },
]

const MOCK_GENERATED_DISHES = [
    {
        id: 1,
        name: "Mediterranean Vegetable Tart",
        description:
            "A savory tart featuring roasted bell peppers, tomatoes, and onions on a crisp pastry base, drizzled with olive oil and garnished with fresh basil.",
        ingredients: ["Bell Peppers", "Tomatoes", "Onions", "Olive Oil", "Basil"],
        preparationTime: "45 mins",
        cost: "$6.75",
        complexity: "Medium",
    },
    {
        id: 2,
        name: "Harvest Vegetable Soup",
        description:
            "A hearty soup combining carrots, cabbage, and onions in a rich vegetable stock, perfect for using surplus vegetables.",
        ingredients: ["Carrots", "Cabbage", "Onions", "Vegetable Stock"],
        preparationTime: "35 mins",
        cost: "$4.25",
        complexity: "Easy",
    },
    {
        id: 3,
        name: "Garden Fresh Pasta Primavera",
        description: "Light pasta dish tossed with sautéed bell peppers, tomatoes, and basil in a light cream sauce.",
        ingredients: ["Bell Peppers", "Tomatoes", "Basil", "Cream"],
        preparationTime: "30 mins",
        cost: "$7.50",
        complexity: "Easy",
    },
]

export default function CustomDishCreator() {
    const [ingredients, setIngredients] = useState(MOCK_INGREDIENTS)
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [generatedDishes, setGeneratedDishes] = useState(MOCK_GENERATED_DISHES)
    const [isGenerating, setIsGenerating] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [preferences, setPreferences] = useState({
        complexity: 50,
        preparationTime: 30,
        costEfficiency: 70,
    })

    const toggleIngredient = (id) => {
        if (selectedIngredients.includes(id)) {
            setSelectedIngredients(selectedIngredients.filter((i) => i !== id))
        } else {
            setSelectedIngredients([...selectedIngredients, id])
        }
    }

    const generateDishes = () => {
        setIsGenerating(true)
        // Simulate API call
        setTimeout(() => {
            setIsGenerating(false)
        }, 2000)
    }

    const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="container mx-auto py-6 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1e4d40] flex items-center">
                        <ChefHat className="mr-2 h-6 w-6" />
                        Custom Dish Creator
                    </h1>
                    <p className="text-gray-600">Generate new dish ideas based on your available inventory</p>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border-[#5ba36a]/20 shadow-sm">
                        <CardHeader className="bg-[#f2f9f3] pb-3">
                            <CardTitle className="text-[#1e4d40] flex items-center text-lg">
                                <Utensils className="mr-2 h-5 w-5" />
                                Available Ingredients
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="mb-4">
                                <Input
                                    placeholder="Search ingredients..."
                                    className="border-[#5ba36a]/20"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 mb-4">
                                {filteredIngredients.length > 0 ? (
                                    filteredIngredients.map((ingredient) => (
                                        <div
                                            key={ingredient.id}
                                            onClick={() => toggleIngredient(ingredient.id)}
                                            className={`
                                                flex items-center justify-between p-2 rounded-md cursor-pointer border
                                                ${selectedIngredients.includes(ingredient.id)
                                                    ? "bg-[#e8f5e9] border-[#5ba36a]"
                                                    : "bg-white border-gray-200 hover:bg-gray-50"
                                                }
                                                transition-colors duration-150
                                            `}
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-4 h-4 rounded-sm mr-3 flex items-center justify-center ${selectedIngredients.includes(ingredient.id)
                                                        ? "bg-[#5ba36a] text-white"
                                                        : "border border-gray-300"
                                                        }`}
                                                >
                                                    {selectedIngredients.includes(ingredient.id) && (
                                                        <svg
                                                            width="10"
                                                            height="10"
                                                            viewBox="0 0 10 10"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M8.5 2.5L3.5 7.5L1.5 5.5"
                                                                stroke="white"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="font-medium">{ingredient.name}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500 mr-2">
                                                    {ingredient.quantity} {ingredient.unit}
                                                </span>
                                                {ingredient.expiring && (
                                                    <Badge className="bg-amber-500 text-xs font-medium">Expiring</Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">No ingredients found</div>
                                )}
                            </div>

                            {selectedIngredients.length > 0 && (
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="text-sm font-medium mb-2">Selected: {selectedIngredients.length} ingredients</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedIngredients.map((id) => {
                                            const ingredient = ingredients.find((i) => i.id === id)
                                            return ingredient ? (
                                                <Badge
                                                    key={id}
                                                    className="bg-[#5ba36a] hover:bg-[#4c8d59] cursor-pointer py-1 px-2 flex items-center"
                                                    onClick={() => toggleIngredient(id)}
                                                >
                                                    {ingredient.name}
                                                    <Trash2 className="ml-1.5 h-3 w-3" />
                                                </Badge>
                                            ) : null
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-[#5ba36a]/20 shadow-sm">
                        <CardHeader className="bg-[#f2f9f3] pb-3">
                            <CardTitle className="text-[#1e4d40] flex items-center text-lg">
                                <ChefHat className="mr-2 h-5 w-5" />
                                Dish Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-5">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium">Complexity</label>
                                    <span className="text-sm text-gray-500 font-medium">
                                        {preferences.complexity < 33 ? "Simple" : preferences.complexity < 66 ? "Medium" : "Complex"}
                                    </span>
                                </div>
                                <Slider
                                    value={[preferences.complexity]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => setPreferences({ ...preferences, complexity: value[0] })}
                                    className="[&>span]:bg-[#5ba36a]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium">Preparation Time</label>
                                    <span className="text-sm text-gray-500 font-medium">{preferences.preparationTime} mins</span>
                                </div>
                                <Slider
                                    value={[preferences.preparationTime]}
                                    min={10}
                                    max={60}
                                    step={5}
                                    onValueChange={(value) => setPreferences({ ...preferences, preparationTime: value[0] })}
                                    className="[&>span]:bg-[#5ba36a]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium">Cost Efficiency</label>
                                    <span className="text-sm text-gray-500 font-medium">
                                        {preferences.costEfficiency < 33 ? "Low" : preferences.costEfficiency < 66 ? "Medium" : "High"}
                                    </span>
                                </div>
                                <Slider
                                    value={[preferences.costEfficiency]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => setPreferences({ ...preferences, costEfficiency: value[0] })}
                                    className="[&>span]:bg-[#5ba36a]"
                                />
                            </div>

                            <Button
                                onClick={generateDishes}
                                disabled={selectedIngredients.length === 0 || isGenerating}
                                className="w-full bg-[#1e4d40] hover:bg-[#163a30] flex items-center justify-center mt-2"
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                {isGenerating ? "Generating Dishes..." : "Generate Dish Ideas"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="border-[#5ba36a]/20 shadow-sm h-full">
                        <CardHeader className="bg-[#f2f9f3] pb-3">
                            <CardTitle className="text-[#1e4d40] flex items-center text-lg">
                                <Sparkles className="mr-2 h-5 w-5" />
                                AI-Generated Dish Ideas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {generatedDishes.length > 0 ? (
                                <Tabs defaultValue={generatedDishes[0].id.toString()} className="h-full">
                                    <TabsList className="bg-[#e8f5e9] border border-[#5ba36a]/20 w-full mb-2">
                                        {generatedDishes.map((dish, index) => (
                                            <TabsTrigger
                                                key={dish.id}
                                                value={dish.id.toString()}
                                                className="flex-1 data-[state=active]:bg-[#5ba36a] data-[state=active]:text-white"
                                            >
                                                Idea {index + 1}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {generatedDishes.map((dish) => (
                                        <TabsContent key={dish.id} value={dish.id.toString()} className="mt-4 space-y-6 focus:outline-none">
                                            <div className="bg-[#f5fbf6] p-4 rounded-lg border border-[#5ba36a]/20">
                                                <h3 className="text-xl font-semibold text-[#1e4d40] mb-2">{dish.name}</h3>
                                                <p className="text-gray-600 mb-3">{dish.description}</p>

                                                <div className="grid grid-cols-3 gap-2 mb-4">
                                                    <div className="flex items-center gap-1 bg-white p-2 rounded-md border border-gray-100">
                                                        <Clock className="h-4 w-4 text-[#5ba36a]" />
                                                        <span className="text-sm">{dish.preparationTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-white p-2 rounded-md border border-gray-100">
                                                        <DollarSign className="h-4 w-4 text-[#5ba36a]" />
                                                        <span className="text-sm">{dish.cost}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-white p-2 rounded-md border border-gray-100">
                                                        <ChefHat className="h-4 w-4 text-[#5ba36a]" />
                                                        <span className="text-sm">{dish.complexity}</span>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <h4 className="text-sm font-medium text-[#1e4d40] mb-1.5">Ingredients:</h4>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {dish.ingredients.map((ingredient, idx) => (
                                                            <Badge key={idx} variant="outline" className="bg-[#e8f5e9] text-[#1e4d40]">
                                                                {ingredient}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-medium text-[#1e4d40] border-b border-gray-200 pb-2">Customize This Dish</h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium block mb-1">Dish Name</label>
                                                        <Input defaultValue={dish.name} className="border-[#5ba36a]/20" />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium block mb-1">Preparation Time</label>
                                                        <Input defaultValue={dish.preparationTime} className="border-[#5ba36a]/20" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium block mb-1">Description</label>
                                                    <Textarea defaultValue={dish.description} className="border-[#5ba36a]/20 min-h-[100px]" />
                                                </div>

                                                <div className="flex justify-end space-x-3 mt-6">
                                                    <Button variant="outline" className="border-[#1e4d40] text-[#1e4d40]">
                                                        Regenerate
                                                    </Button>
                                                    <Button className="bg-[#5ba36a] hover:bg-[#4c8d59]">
                                                        <PlusCircle className="mr-2 h-4 w-4" /> Add to Menu
                                                    </Button>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                                    <ChefHat className="h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Dishes Generated Yet</h3>
                                    <p className="text-gray-500 max-w-md">
                                        Select ingredients from your inventory and set your preferences to generate custom dish ideas.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}