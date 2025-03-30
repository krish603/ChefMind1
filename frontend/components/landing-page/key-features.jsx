import { Brain, BarChart3, ShoppingCart, FileText } from "lucide-react"

export function KeyFeatures() {
  const features = [
    {
      icon: <ShoppingCart className="h-10 w-10 text-[#54aa52]" />,
      title: "Smart Inventory",
      description: "Image recognition & real-time stock tracking to keep your kitchen organized and efficient.",
    },
    {
      icon: <Brain className="h-10 w-10 text-[#54aa52]" />,
      title: "AI Predictions",
      description: "Sales forecasting & waste minimization through advanced machine learning algorithms.",
    },
    {
      icon: <FileText className="h-10 w-10 text-[#54aa52]" />,
      title: "Menu Optimization",
      description: "AI-driven dish suggestions & cost analysis to maximize profits and minimize waste.",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-[#54aa52]" />,
      title: "Waste Analytics",
      description: "Vision-based tracking & financial impact reports to help you understand and reduce waste.",
    },
  ]

  return (
    <section id="features" className="py-16 md:py-24 bg-[#f9f6eb]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#255653] mb-4">Key Features</h2>
          <p className="text-lg md:text-xl text-[#54aa52] max-w-3xl mx-auto">
            Our comprehensive solution offers everything you need to manage your kitchen inventory and reduce waste.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#255653] mb-3">{feature.title}</h3>
              <p className="text-[#255653]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

