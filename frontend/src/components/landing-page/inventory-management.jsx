import { CheckCircle } from "lucide-react"

export function InventoryManagement() {
  const features = [
    "Real-time inventory tracking",
    "Automatic stock depletion alerts",
    "Expiration date monitoring",
    "Supplier management integration",
    "Barcode and QR code scanning",
    "Custom inventory categories",
  ]

  return (
    <section id="inventory" className="py-16 md:py-24 bg-[#255653] text-[#faf6eb]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Manage Inventory</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Our smart inventory system helps you keep track of everything in your kitchen, reducing waste and saving
            money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#1a3e3c] p-6 rounded-lg flex items-start">
              <CheckCircle className="h-6 w-6 text-[#54aa52] mr-3 flex-shrink-0 mt-1" />
              <p className="text-lg">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

