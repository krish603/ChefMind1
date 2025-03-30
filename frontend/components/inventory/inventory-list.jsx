"use client"

import { useState, useEffect } from "react"
import { InventoryCard } from "./inventory-card"
import { getInventory } from "@/src/actions/inventoryActions"

export function InventoryList({ onDelete, onEdit }) {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchInventory() {
            try {
                const result = await getInventory("cuid1")
                if (result.success) {
                    setItems(result.items)
                } else {
                    setError(result.error || "Failed to fetch inventory")
                }
            } catch (err) {
                setError("Failed to load inventory")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchInventory()
    }, [])

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-[#255653]">Loading inventory...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-[#255653]">No inventory items found.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <InventoryCard
                    key={item.id}
                    item={item}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    )
}

