"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"

export function Calculator() {
  const [binsPerWeek, setBinsPerWeek] = useState(5)
  const [kgPerBin, setKgPerBin] = useState(20)

  // Calculate savings
  const annualWaste = binsPerWeek * kgPerBin * 52 // 52 weeks in a year
  const financialSavings = annualWaste * 7 // €7 per kg
  const co2Reduction = annualWaste * 4.5 // 4.5 kg CO2 per kg
  const waterSavings = annualWaste * 7000 // 7000 liters per kg

  return (
    <section id="calculator" className="py-16 md:pt-18 pb-24 bg-[#f0c14b]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#255653] mb-4">Savings Calculator</h2>
            <p className="text-lg md:text-xl font-semibold text-[#255653]">
              See how much you could save by reducing food waste in your kitchen.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="mb-8">
              <label className="block text-[#255653] font-medium mb-2">Dustbins disposed per week: {binsPerWeek}</label>
              <Slider
                value={[binsPerWeek]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) => setBinsPerWeek(value[0])}
                className="mb-6"
              />

              <label className="block text-[#255653] font-medium mb-2">
                Average kg of food waste per bin: {kgPerBin} kg
              </label>
              <Slider value={[kgPerBin]} min={5} max={50} step={5} onValueChange={(value) => setKgPerBin(value[0])} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#f9f6eb] p-4 rounded-md">
                <h3 className="text-lg font-semibold text-[#255653] mb-2">Annual Food Waste</h3>
                <p className="text-3xl font-bold text-[#54aa52]">{annualWaste.toLocaleString()} kg</p>
              </div>

              <div className="bg-[#f9f6eb] p-4 rounded-md">
                <h3 className="text-lg font-semibold text-[#255653] mb-2">Financial Savings</h3>
                <p className="text-3xl font-bold text-[#54aa52]">€{financialSavings.toLocaleString()}</p>
              </div>

              <div className="bg-[#f9f6eb] p-4 rounded-md">
                <h3 className="text-lg font-semibold text-[#255653] mb-2">CO2 Reduction</h3>
                <p className="text-3xl font-bold text-[#54aa52]">{co2Reduction.toLocaleString()} kg</p>
              </div>

              <div className="bg-[#f9f6eb] p-4 rounded-md">
                <h3 className="text-lg font-semibold text-[#255653] mb-2">Water Savings</h3>
                <p className="text-3xl font-bold text-[#54aa52]">{(waterSavings / 1000).toLocaleString()} m³</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

