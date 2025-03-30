import { Trash2, Droplet, DollarSign, Wind } from "lucide-react"

export function FoodWasteImpact() {
  const impactData = [
    {
      icon: <Trash2 className="h-12 w-12 text-[#54aa52]" />,
      title: "Global Food Waste",
      description: "This represents 1.3 billion tons of food waste, with 14% coming from the food service market.",
    },
    {
      icon: <Wind className="h-12 w-12 text-[#54aa52]" />,
      title: "CO2 Emissions",
      description: "1 kg of wasted food = 4.5 kg CO2 (a major contributor to pollution).",
    },
    {
      icon: <Droplet className="h-12 w-12 text-[#54aa52]" />,
      title: "Water Waste",
      description: "1 kg of wasted food = 7000 liters of water (equivalent to 120 showers).",
    },
    {
      icon: <DollarSign className="h-12 w-12 text-[#54aa52]" />,
      title: "Financial Loss",
      description: "1 kg of wasted food = €7 worth of financial loss.",
    },
  ]

  return (
    <section id="impact" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#255653] mb-6">Food Waste Impact</h2>
          <p className="text-lg md:text-xl text-[#255653] font-semibold max-w-3xl mx-auto">
            Understanding the true cost of food waste is the first step toward reducing it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactData.map((item, index) => (
            <div key={index} className="bg-[#f9f6eb] p-6 rounded-lg text-center flex flex-col items-center">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-[#255653] mb-2">{item.title}</h3>
              <p className="text-[#255653] font-semibold">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

