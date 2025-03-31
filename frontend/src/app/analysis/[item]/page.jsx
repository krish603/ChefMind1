"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { waste } from "@/src/actions/graphActions";
import { demand } from "@/src/actions/graphActions";
import AnalysisHeader from "@/components/analysis/AnalysisHeader";
import InsightsCards from "@/components/analysis/InsightsCards";
import ForecastChart from "@/components/analysis/forecast-chart";
import LoadingState from "@/components/loading-state";
import DemandAnalysisCard from "@/components/analysis/DemandAnalysisCard";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables); // Register all components



const AnalysisPage = ({ params }) => {
    const router = useRouter();
    const item = params.item.charAt(0).toUpperCase() + params.item.slice(1);
    const [isClient, setIsClient] = useState(false);
    const [wasteRatio, setWasteRatio] = useState("0");
    const [timeframe, setTimeframe] = useState('weekly');
    const [demandData, setDemandData] = useState({"0": []});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                // Capitalize the first letter of the item
                const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1);

                console.log("Fetching demand data for item:", capitalizedItem);
                const [wasteResult, demandResult] = await Promise.all([
                    waste(capitalizedItem),
                    demand(capitalizedItem)
                ]);

                if (wasteResult) {
                    setWasteRatio(wasteResult.data.predicted_waste_percentage);
                }

                if (demandResult && demandResult.success) {
                    console.log("Demand data fetched successfully:", demandResult.data);
                    setDemandData(demandResult.data);
                } else {
                    console.log("Error fetching demand data:", demandResult?.error);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [item]);

    if (loading) {
        return <LoadingState message={`Analyzing ${item}...`} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-chefmind-beige to-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6 md:space-y-10">
                <AnalysisHeader item={item} />
                
                <InsightsCards 
                    wasteRatio={wasteRatio} 
                    demandData={demandData} 
                    timeframe={timeframe} 
                    item={item}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {demandData && Object.keys(demandData).length > 0 && (
                        <DemandAnalysisCard
                            demandData={demandData} 
                            timeframe={timeframe} 
                            setTimeframe={setTimeframe} 
                            isClient={isClient} 
                            item={item}
                        />
                    )}
                    
                    <ForecastChart 
                        item={item} 
                        timeframe={timeframe} 
                        isClient={isClient} 
                    />
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;