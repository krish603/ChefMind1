import CustomDishCreator from "@/components/ai-kitchen/custom-dish-creator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CustomDishCreatorPage() {
    return (
        <div className="p-6 bg-amber-50 space-y-6">

            <CustomDishCreator />
        </div>
    )
}

