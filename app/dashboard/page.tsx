"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Zap, Leaf, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

interface EcoPointsData {
  availablePoints: number
  totalEarned: number
  totalSpent: number
}

export default function DashboardPage() {
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

  const weeklyData = [
    { day: "Mon", waste: 5.2, target: 6 },
    { day: "Tue", waste: 4.8, target: 6 },
    { day: "Wed", waste: 5.5, target: 6 },
    { day: "Thu", waste: 4.2, target: 6 },
    { day: "Fri", waste: 5.1, target: 6 },
    { day: "Sat", waste: 6.3, target: 6 },
    { day: "Sun", waste: 4.9, target: 6 },
  ]

  const monthlyStats = [
    { week: "Week 1", biogas: 150, electricity: 10, savings: 800 },
    { week: "Week 2", biogas: 180, electricity: 12, savings: 960 },
    { week: "Week 3", biogas: 165, electricity: 11, savings: 880 },
    { week: "Week 4", biogas: 195, electricity: 13, savings: 1040 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome back, Eco Warrior! 🌱</h1>
          <p className="text-lg text-muted-foreground">Your sustainable journey continues</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Waste This Month</p>
                <p className="text-3xl font-bold">157.5</p>
                <p className="text-xs text-muted-foreground mt-2">kg total</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/40" />
            </div>
            <div className="text-sm text-green-600">↓ 12% from last month</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-secondary">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Energy Generated</p>
                <p className="text-3xl font-bold">42.5</p>
                <p className="text-xs text-muted-foreground mt-2">kWh this month</p>
              </div>
              <Zap className="h-8 w-8 text-secondary/40" />
            </div>
            <div className="text-sm text-green-600">↑ 8% from last month</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cost Saved</p>
                <p className="text-3xl font-bold">₹340</p>
                <p className="text-xs text-muted-foreground mt-2">this month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500/40" />
            </div>
            <div className="text-sm text-green-600">↑ Increasing savings</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-amber-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">CO₂ Reduced</p>
                <p className="text-3xl font-bold">47.3</p>
                <p className="text-xs text-muted-foreground mt-2">kg per year</p>
              </div>
              <Leaf className="h-8 w-8 text-amber-500/40" />
            </div>
            <div className="text-sm text-green-600">↑ Great progress!</div>
          </Card>
        </div>

        {!isLoading && ecoPoints && ecoPoints.availablePoints > 0 && (
          <Card className="p-8 mb-12 bg-gradient-to-r from-green-500/10 to-emerald-600/10 border-2 border-green-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <Leaf className="h-6 w-6 text-green-600" />
                  <h3 className="text-2xl font-bold">Eco-Points Earned!</h3>
                </div>
                <p className="text-lg font-bold text-green-700 mb-2">{ecoPoints.availablePoints} Points Available</p>
                <p className="text-muted-foreground">
                  You've earned {ecoPoints.totalEarned} points for your waste reduction activities. Redeem them for
                  eco-friendly products!
                </p>
              </div>
              <Link href="/ecostore" className="flex-shrink-0">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                  <Leaf className="h-4 w-4 mr-2" />
                  Visit Eco Store
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Weekly Waste Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="waste"
                    stroke="var(--color-chart-1)"
                    name="Your Waste (kg)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="var(--color-chart-2)"
                    name="Daily Target"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Monthly Impact</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="biogas" fill="var(--color-chart-1)" name="Biogas (L)" />
                  <Bar dataKey="electricity" fill="var(--color-chart-2)" name="Electricity (kWh)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/calculator" className="flex flex-col items-start">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <p className="font-semibold mb-2">Calculate Waste</p>
              <p className="text-sm text-muted-foreground">See your impact</p>
              <ArrowRight className="h-4 w-4 mt-4 text-primary/50 group-hover:text-primary transition-colors" />
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/maps" className="flex flex-col items-start">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <p className="font-semibold mb-2">Find Locations</p>
              <p className="text-sm text-muted-foreground">Community resources</p>
              <ArrowRight className="h-4 w-4 mt-4 text-secondary/50 group-hover:text-secondary transition-colors" />
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/coach" className="flex flex-col items-start">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <Leaf className="h-6 w-6 text-green-500" />
              </div>
              <p className="font-semibold mb-2">AI Coach</p>
              <p className="text-sm text-muted-foreground">Get recommendations</p>
              <ArrowRight className="h-4 w-4 mt-4 text-green-500/50 group-hover:text-green-500 transition-colors" />
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/events" className="flex flex-col items-start">
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Users className="h-6 w-6 text-amber-500" />
              </div>
              <p className="font-semibold mb-2">Food Donation</p>
              <p className="text-sm text-muted-foreground">Connect with NGOs</p>
              <ArrowRight className="h-4 w-4 mt-4 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { activity: "Logged 5.2 kg waste", time: "Today", points: "+52" },
              { activity: "Generated 0.5 kWh energy", time: "Yesterday", points: "—" },
              { activity: "Saved ₹48 this week", time: "3 days ago", points: "—" },
              { activity: "Completed weekly challenge", time: "5 days ago", points: "+100" },
              { activity: "Added garden waste log", time: "1 week ago", points: "+45" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <span className="text-sm">{item.activity}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                  {item.points !== "—" && (
                    <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      {item.points}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
