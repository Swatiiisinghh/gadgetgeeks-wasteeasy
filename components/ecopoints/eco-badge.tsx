"use client"

import { useEffect, useState } from "react"
import { Leaf, Loader2 } from "lucide-react"

interface EcoPointsData {
  totalEarned: number
  availablePoints: number
  totalSpent: number
}

export function EcoBadge() {
  const [ecoPoints, setEcoPoints] = useState<EcoPointsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEcoPoints = async () => {
      try {
        const response = await fetch("/api/ecopoints")
        const data = await response.json()
        setEcoPoints(data)
      } catch (error) {
        console.error("[v0] Error fetching eco points:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEcoPoints()
  }, [])

  if (isLoading) {
    return <Loader2 className="h-5 w-5 animate-spin" />
  }

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full">
      <Leaf className="h-5 w-5" />
      <span className="font-bold">{ecoPoints?.availablePoints || 0}</span>
      <span className="text-sm">Eco Points</span>
    </div>
  )
}
