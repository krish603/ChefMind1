import { currentUser } from '@clerk/nextjs/server'
import { syncAction } from '@/src/actions/userActions'
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {  SignUpButton } from "@clerk/nextjs"

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

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {/* <Image
                src="/placeholder.svg?height=40&width=40"
               
                width={40}
                height={40}
                className="mr-2"
              /> */}
              <span className="text-[#255653] font-bold text-3xl">ChefMind</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden font-semibold md:flex space-x-8">
            <Link href="#how-it-works" className="py-2 text-[#255653] hover:text-[#54aa52] transition-colors">
              How It Works
            </Link>
            <Link href="#inventory" className="py-2 text-[#255653] hover:text-[#54aa52] transition-colors">
              Inventory
            </Link>
            <Link href="#impact" className="py-2 text-[#255653] hover:text-[#54aa52] transition-colors">
              Impact
            </Link>
            <Link href="#calculator" className="py-2 text-[#255653] hover:text-[#54aa52] transition-colors">
              Savings Calculator
            </Link>
            <Link href="#features" className="py-2 text-[#255653] hover:text-[#54aa52] transition-colors">
              Features
            </Link>
            {/* <Button
              className=" bg-[#54aa52] mx-2 my-[1.5px] hover:bg-[#255653] text-white"
            >              <SignedOut>
                <SignUpButton mode="modal" >Get Started</SignUpButton>
              </SignedOut>
            </Button> */}
            {/* <SignUpButton mode="modal">
              <Button variant="outline" className="w-full">Sign Up</Button>
            </SignUpButton> */}
          </div>
        </div>
      </div>
    </nav>
  )
}

