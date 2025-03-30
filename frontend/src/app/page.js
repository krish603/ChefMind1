import React from 'react'
import Image from 'next/image'
import {Navbar} from '../components/landing-page/navbar'
import {HeroSection} from '../components/landing-page/hero-section'
import {HowItWorks} from '../components/landing-page/how-it-works'
import {RestaurantLogos} from '../components/landing-page/restaurant-logos'
import {InventoryManagement} from '../components/landing-page/inventory-management'
import {FoodWasteImpact} from '../components/landing-page/food-waste-impact'
import {Calculator} from '../components/landing-page/calculator'
import {KeyFeatures} from '../components/landing-page/key-features'

export default function Home() {
  return (
    <div>
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <RestaurantLogos />
      <InventoryManagement />
      <FoodWasteImpact />
      <Calculator />
      <KeyFeatures />
      <footer className="bg-[#255653] text-[#f9f6eb] py-8 text-center">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} ChefMind. All rights reserved.</p>
        </div>
      </footer>
      <div className="bg-[#f9f6eb] py-8">
        <div className="container mx-auto text-center">
          <p>Made with ❤️ by ChefMind Team</p>
        </div>
        </div>
    </main>
    </div>
  )
}

