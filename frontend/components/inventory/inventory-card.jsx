"use client"

import { useState } from "react"
import { Edit, Trash2, Save, X, AlertTriangle } from "lucide-react"
import { formatDate } from "./utils"

export function InventoryCard({ item, onDelete, onEdit }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedItem, setEditedItem] = useState(item)

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditedItem(item)
    }

    const handleSave = () => {
        onEdit(editedItem)
        setIsEditing(false)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setEditedItem({
            ...editedItem,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    const isExpired = item.expirationDate && new Date(item.expirationDate) < new Date()

    return (
        <div
            className={`bg-white rounded-lg shadow-md p-4 ${isExpired || item.spoilage ? "border-l-4 border-red-500" : ""}`}
        >
            {isEditing ? (
                // Edit mode
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            name="name"
                            value={editedItem.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-[#255653]"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            name="quantity"
                            value={editedItem.quantity}
                            onChange={handleChange}
                            className="w-20 p-2 border rounded text-[#255653]"
                        />
                        <input
                            type="text"
                            name="unit"
                            value={editedItem.unit || ""}
                            onChange={handleChange}
                            placeholder="unit"
                            className="w-16 p-2 border rounded text-[#255653]"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 text-[#255653]">
                            <input
                                type="checkbox"
                                name="spoilage"
                                checked={editedItem.spoilage}
                                onChange={handleChange}
                                className="rounded text-[#54aa52]"
                            />
                            Spoiled
                        </label>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={handleSave}
                            className="p-1 text-[#54aa52] hover:bg-[#54aa52]/10 rounded"
                            aria-label="Save changes"
                        >
                            <Save size={18} />
                        </button>
                        <button
                            onClick={handleCancel}
                            className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                            aria-label="Cancel editing"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                // View mode
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <h3 className="font-medium text-[#255653]">{item.name}</h3>
                        {item.description && <p className="text-sm text-[#255653]/70 truncate">{item.description}</p>}
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
                            onClick={handleEdit}
                            className="p-1 text-[#54aa52] hover:bg-[#54aa52]/10 rounded"
                            aria-label="Edit item"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                            aria-label="Delete item"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

