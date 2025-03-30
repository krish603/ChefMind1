"use client"

import { useState } from "react"
import { SearchBar } from "./search-bar"
import { InventoryList } from "./inventory-list"
import { AlertsSection } from "./alerts-section"
import { mockInventoryItems } from "./mock-data"

export function InventoryDashboard() {
    const [inventoryItems, setInventoryItems] = useState(mockInventoryItems)
    const [searchQuery, setSearchQuery] = useState("")

    // Filter items based on search query
    const filteredItems = inventoryItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Handle search
    const handleSearch = (query) => {
        setSearchQuery(query)
    }

    // Handle delete item
    const handleDeleteItem = (id) => {
        setInventoryItems(inventoryItems.filter((item) => item.id !== id))
    }

    // Handle edit item
    const handleEditItem = (updatedItem) => {
        setInventoryItems(inventoryItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    }

    // Get spoiled items
    const spoiledItems = inventoryItems.filter((item) => item.spoilage)

    // Get low stock items (less than 10)
    const lowStockItems = inventoryItems.filter((item) => item.quantity < 10)

    return (
        <div className="min-h-screen bg-[#f9f6eb]">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-[#255653] mb-4 tracking-tight">Inventory Management</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* 70% Section - Inventory */}
                    <div className="w-full lg:w-[70%]">
                        <SearchBar onSearch={handleSearch} />
                        <InventoryList items={filteredItems} onDelete={handleDeleteItem} onEdit={handleEditItem} />
                    </div>

                    {/* 30% Section - Alerts */}
                    <div className="w-full lg:w-[30%]">
                        <AlertsSection spoiledItems={spoiledItems} lowStockItems={lowStockItems} />
                    </div>
                </div>
            </div>
        </div>
    )
}

