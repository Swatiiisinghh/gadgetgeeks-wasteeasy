"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [ecoPoints, setEcoPoints] = useState(0)

  useEffect(() => {
    const fetchEcoPoints = async () => {
      try {
        const response = await fetch("/api/ecopoints")
        const data = await response.json()
        setEcoPoints(data.availablePoints || 0)
      } catch (error) {
        console.error("[v0] Error fetching eco points:", error)
      }
    }
    fetchEcoPoints()
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Leaf className="h-6 w-6" />
            <span>WasteWise</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/calculator" className="text-sm hover:text-primary transition-colors">
              Calculator
            </Link>
            <Link href="/maps" className="text-sm hover:text-primary transition-colors">
              Maps
            </Link>
            <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/coach" className="text-sm hover:text-primary transition-colors">
              AI Coach
            </Link>
            <Link href="/events" className="text-sm hover:text-primary transition-colors">
              Events
            </Link>
            <Link href="/ecostore" className="text-sm hover:text-primary transition-colors flex items-center gap-1">
              <Leaf className="h-4 w-4" />
              Eco Store
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {ecoPoints > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                {ecoPoints}
              </div>
            )}
            <Button variant="outline">Login</Button>
            <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-border pt-4">
            <Link href="/calculator" className="block py-2 hover:text-primary transition-colors">
              Calculator
            </Link>
            <Link href="/maps" className="block py-2 hover:text-primary transition-colors">
              Maps
            </Link>
            <Link href="/dashboard" className="block py-2 hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/coach" className="block py-2 hover:text-primary transition-colors">
              AI Coach
            </Link>
            <Link href="/events" className="block py-2 hover:text-primary transition-colors">
              Events
            </Link>
            <Link href="/ecostore" className="block py-2 hover:text-primary transition-colors flex items-center gap-1">
              <Leaf className="h-4 w-4" />
              Eco Store
            </Link>
            {ecoPoints > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 w-fit">
                <Leaf className="h-4 w-4" />
                {ecoPoints}
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 bg-transparent">
                Login
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90">Sign Up</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
