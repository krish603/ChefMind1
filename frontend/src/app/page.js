import React from 'react'
import { Navbar } from '@/components/landing-page/navbar'
import { HeroSection } from '@/components/landing-page/hero-section'
import { HowItWorks } from '@/components/landing-page/how-it-works'
import { RestaurantLogos } from '@/components/landing-page/restaurant-logos'
import { InventoryManagement } from '@/components/landing-page/inventory-management'
import { FoodWasteImpact } from '@/components/landing-page/food-waste-impact'
import { Calculator } from '@/components/landing-page/calculator'
import { KeyFeatures } from '@/components/landing-page/key-features'
import LandingPage from './(landing)/landing-page/page'

export default function Home() {
  return (
    <div>
    <main className="min-h-screen">
      <LandingPage/>
    </main>
    </div>
  )
}

