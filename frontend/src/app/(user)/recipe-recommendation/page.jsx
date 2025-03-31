import RecipeRecommendations from "@/components/ai-kitchen/recipe-recommendations";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";

export default function RecipeRecommendationsPage() {
    return (
        <div className="p-6 bg-amber-50 h-full space-y-6">
            <RecipeRecommendations />
        </div>
    );
}
