import Image from "next/image"

export function RestaurantLogos() {
  // Array of restaurant logos (using placeholders)
  const logos = [
    { name: "Chick-Fill-A", logo: "/restaurant-logos/r1.png" },
    { name: "Taco Bell", logo: "/restaurant-logos/r2.png" },
    { name: "KFC", logo: "/restaurant-logos/r3.png" },
    { name: "Pizza Hut", logo: "/restaurant-logos/r4.png" },
    { name: "McDonalds", logo: "/restaurant-logos/r5.png" },
    { name: "Dunkin Donuts", logo: "/restaurant-logos/r6.png" },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h3 className="text-xl font-semibold text-center text-[#255653] mb-8">
          Trusted by Leading Restaurants
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map((logo, index) => (
            <div key={index} className="w-[100px]">
              <Image
                src={logo.logo} // Corrected to use the `logo` property
                alt={logo.name} // Use the restaurant name for better accessibility
                width={250}
                height={250}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

