"use client"

import { Trash2, AlertTriangle } from "lucide-react"
import { formatDate } from "./utils"
import { deleteItem } from "@/src/actions/inventoryActions"
import { useRouter } from "next/navigation"

export function InventoryCard({ item }) {
    const router = useRouter()
    const isExpired = item.expirationDate && new Date(item.expirationDate) < new Date()

    const handleDelete = async () => {
        try {
            const response = await deleteItem(item.id)
            if (response.success) {
                // Refresh the page to show updated inventory
                router.reload()
            } else {
                console.error("Failed to delete:", response.error)
            }
        } catch (error) {
            console.error("Error deleting item:", error)
        }
    }

    return (
        <div className={`bg-white rounded-lg shadow-md p-4 ${isExpired || item.spoilage ? "border-l-4 border-red-500" : ""}`}>
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                    <h3 className="font-medium text-[#255653]">{item.name}</h3>
                    {item.description && (
                        <p className="text-sm text-[#255653]/70 truncate">{item.description}</p>
                    )}
                </div>

                <div className="text-[#255653]">
                    <span className="font-semibold">{item.quantity}</span>{" "}
                    <span className="text-sm">{item.unit || "units"}</span>
                </div>

                {item.expirationDate && (
                    <div className={`text-sm ${isExpired ? "text-red-500" : "text-[#255653]/70"}`}>
                        Expires: {formatDate(item.expirationDate)}
                        {isExpired && <AlertTriangle size={14} className="inline ml-1" />}
                    </div>
                )}

                {item.spoilage && (
                    <div className="text-red-500 text-sm flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        Spoiled
                    </div>
                )}

                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={handleDelete}
                        className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                        aria-label="Delete item"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

