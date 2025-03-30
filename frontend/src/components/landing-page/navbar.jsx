import { currentUser } from '@clerk/nextjs/server'
import { syncAction } from '@/src/actions/userActions'
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"

export function Navbar() {
const fetchUserData = async () => {
        const user = await currentUser()
        console.log("In the navbar")
        if (user) {
          const result = await syncAction()
          if (result.success) {
            console.log("user in table")
          }
          console.log(result.message)
        }
      }
      fetchUserData()

  return (
    <nav className="bg-[#f9f6eb] py-4 sticky top-0 z-50 shadow-sm">
      <inNav />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="ChefMind Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-[#255653] font-bold text-xl">ChefMind</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="#how-it-works" className="text-[#255653] hover:text-[#54aa52] transition-colors">
              How It Works
            </Link>
            <Link href="#inventory" className="text-[#255653] hover:text-[#54aa52] transition-colors">
              Inventory
            </Link>
            <Link href="#impact" className="text-[#255653] hover:text-[#54aa52] transition-colors">
              Impact
            </Link>
            <Link href="#calculator" className="text-[#255653] hover:text-[#54aa52] transition-colors">
              Savings Calculator
            </Link>
            <Link href="#features" className="text-[#255653] hover:text-[#54aa52] transition-colors">
              Features
            </Link>
            <Button 
              className="w-full bg-[#54aa52] hover:bg-[#255653] text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
              <SignedOut>
                <SignInButton mode="modal" />
                <SignUpButton mode="modal" />
              </SignedOut>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-[#255653] focus:outline-none">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <Link
              href="#how-it-works"
              className="block text-[#255653] hover:text-[#54aa52] transition-colors"
              onClick={toggleMenu}
            >
              How It Works
            </Link>
            <Link
              href="#inventory"
              className="block text-[#255653] hover:text-[#54aa52] transition-colors"
              onClick={toggleMenu}
            >
              Inventory
            </Link>
            <Link
              href="#impact"
              className="block text-[#255653] hover:text-[#54aa52] transition-colors"
              onClick={toggleMenu}
            >
              Impact
            </Link>
            <Link
              href="#calculator"
              className="block text-[#255653] hover:text-[#54aa52] transition-colors"
              onClick={toggleMenu}
            >
              Savings Calculator
            </Link>
            <Link
              href="#features"
              className="block text-[#255653] hover:text-[#54aa52] transition-colors"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Button 
              className="w-full bg-[#54aa52] hover:bg-[#255653] text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
              <SignedOut>
                <SignInButton mode="modal" />
                <SignUpButton mode="modal" />
              </SignedOut>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}

