import { InventoryCard } from "./inventory-card"

export function InventoryList({ items, onDelete, onEdit }) {
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
                <InventoryCard key={item.id} item={item} onDelete={onDelete} onEdit={onEdit} />
            ))}
        </div>
    )
}

