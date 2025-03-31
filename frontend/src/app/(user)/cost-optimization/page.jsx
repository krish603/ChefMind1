import CostOptimization from "@/components/ai-kitchen/cost-optimization";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Link from "next/link";

export default function CostOptimizationPage() {
    return (
        <div className="p-6 bg-amber-50 space-y-6">

            <CostOptimization />
        </div>
    );
}
