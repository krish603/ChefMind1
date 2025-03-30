import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#255653] mb-6">
              Reduce your food waste and save tons annually!
            </h1>
            <p className="text-lg md:text-xl text-[#54aa52] mb-8">
              Smart kitchen inventory management that helps you track, reduce, and save.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#255653] hover:bg-[#1a3e3c] text-white px-8 py-6 rounded-md text-lg">
                Get Started
              </Button>
              <Button
                variant="outline"
                className="border-[#54aa52] text-[#54aa52] hover:bg-[#54aa52] hover:text-white px-8 py-6 rounded-md text-lg"
              >
                Book a Demo
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Food waste reduction"
              width={600}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

