import Image from "next/image"

export function RestaurantLogos() {
  // Array of restaurant logos (using placeholders)
  const logos = Array(6).fill("/placeholder.svg?height=100&width=100")

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h3 className="text-xl font-semibold text-center text-[#255653] mb-8">Trusted by Leading Restaurants</h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map((logo, index) => (
            <div key={index} className="w-[100px]">
              <Image
                src={logo || "/placeholder.svg"}
                alt={`Restaurant logo ${index + 1}`}
                width={100}
                height={100}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

