"use client"

import { useState } from "react"
import { performCalculations } from "@/lib/calculations"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Navigation } from "@/components/layout/navigation"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Leaf, Zap, TrendingDown, Droplet, Sprout, AlertCircle, CheckCircle } from "lucide-react"

export default function CalculatorPage() {
  const [kitchen, setKitchen] = useState(2)
  const [plastic, setPlastic] = useState(1)
  const [paper, setPaper] = useState(0.5)
  const [garden, setGarden] = useState(1.5)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [ecoPointsEarned, setEcoPointsEarned] = useState(0)

  const results = performCalculations(kitchen, plastic, paper, garden)

  const wasteComposition = [
    { name: "Kitchen", value: kitchen, fill: "var(--color-chart-1)" },
    { name: "Plastic", value: plastic, fill: "var(--color-chart-5)" },
    { name: "Paper", value: paper, fill: "var(--color-chart-3)" },
    { name: "Garden", value: garden, fill: "var(--color-chart-2)" },
  ]

  const monthlyData = [
    {
      day: "Week 1",
      biogas: results.monthlyProjection.biogas / 4,
      electricity: results.monthlyProjection.electricity / 4,
      savings: results.monthlyProjection.savings / 4,
    },
    {
      day: "Week 2",
      biogas: results.monthlyProjection.biogas / 4,
      electricity: results.monthlyProjection.electricity / 4,
      savings: results.monthlyProjection.savings / 4,
    },
    {
      day: "Week 3",
      biogas: results.monthlyProjection.biogas / 4,
      electricity: results.monthlyProjection.electricity / 4,
      savings: results.monthlyProjection.savings / 4,
    },
    {
      day: "Week 4",
      biogas: results.monthlyProjection.biogas / 4,
      electricity: results.monthlyProjection.electricity / 4,
      savings: results.monthlyProjection.savings / 4,
    },
  ]

  const handleSaveCalculation = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const response = await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitchen_kg: kitchen,
          plastic_kg: plastic,
          paper_kg: paper,
          garden_kg: garden,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setEcoPointsEarned(data.ecoPointsEarned)
        setSaveMessage({
          type: "success",
          text: `✓ Calculation saved! You earned ${data.ecoPointsEarned} Eco Points!`,
        })
      } else {
        setSaveMessage({
          type: "error",
          text: data.error || "Failed to save calculation",
        })
      }
    } catch (error) {
      console.error("[v0] Error saving calculation:", error)
      setSaveMessage({
        type: "error",
        text: "Failed to save calculation. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Waste-to-Energy Calculator</h1>
          <p className="text-lg text-muted-foreground">
            Calculate your household's biogas potential and environmental impact
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Card className="p-8 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Daily Waste (kg)</h2>

              <div className="space-y-6">
                {/* Kitchen Waste */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="kitchen" className="text-base font-semibold">
                      Kitchen Waste
                    </Label>
                    <span className="text-primary font-bold text-lg">{kitchen.toFixed(1)}</span>
                  </div>
                  <Slider
                    id="kitchen"
                    min={0}
                    max={10}
                    step={0.1}
                    value={[kitchen]}
                    onValueChange={(value) => setKitchen(value[0])}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Food scraps, leftovers</p>
                </div>

                {/* Plastic Waste */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="plastic" className="text-base font-semibold">
                      Plastic Waste
                    </Label>
                    <span className="text-primary font-bold text-lg">{plastic.toFixed(1)}</span>
                  </div>
                  <Slider
                    id="plastic"
                    min={0}
                    max={5}
                    step={0.1}
                    value={[plastic]}
                    onValueChange={(value) => setPlastic(value[0])}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Bags, bottles, packaging</p>
                </div>

                {/* Paper Waste */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="paper" className="text-base font-semibold">
                      Paper Waste
                    </Label>
                    <span className="text-primary font-bold text-lg">{paper.toFixed(1)}</span>
                  </div>
                  <Slider
                    id="paper"
                    min={0}
                    max={3}
                    step={0.1}
                    value={[paper]}
                    onValueChange={(value) => setPaper(value[0])}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Newspapers, cardboard</p>
                </div>

                {/* Garden Waste */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="garden" className="text-base font-semibold">
                      Garden Waste
                    </Label>
                    <span className="text-primary font-bold text-lg">{garden.toFixed(1)}</span>
                  </div>
                  <Slider
                    id="garden"
                    min={0}
                    max={5}
                    step={0.1}
                    value={[garden]}
                    onValueChange={(value) => setGarden(value[0])}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Leaves, grass, branches</p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Daily Total:</p>
                  <p className="text-3xl font-bold text-primary">
                    {(kitchen + plastic + paper + garden).toFixed(1)} kg
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Biogas Potential</p>
                    <p className="text-3xl font-bold text-primary">{results.biogasLiters.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">liters/day</p>
                  </div>
                  <Droplet className="h-8 w-8 text-primary/40" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Monthly Electricity</p>
                    <p className="text-3xl font-bold text-secondary">{results.electricityKwh.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">kWh/month</p>
                  </div>
                  <Zap className="h-8 w-8 text-secondary/40" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Cost Savings</p>
                    <p className="text-3xl font-bold text-green-600">₹{results.costSavingsInr}</p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-green-600/40" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">CO₂ Reduction</p>
                    <p className="text-3xl font-bold text-amber-600">{results.co2ReductionKg.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">kg/year</p>
                  </div>
                  <Leaf className="h-8 w-8 text-amber-600/40" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Fertilizer Output</p>
                    <p className="text-3xl font-bold text-emerald-600">{results.fertilizerKg.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">kg/month</p>
                  </div>
                  <Sprout className="h-8 w-8 text-emerald-600/40" />
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Yearly Savings</p>
                    <p className="text-3xl font-bold text-cyan-600">₹{(results.costSavingsInr * 12).toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">/year</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-cyan-600/40" />
                </div>
              </Card>
            </div>

            {/* Eco-Points Reward Message */}
            {saveMessage && (
              <div
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  saveMessage.type === "success"
                    ? "bg-green-500/10 border border-green-500/30 text-green-700"
                    : "bg-red-500/10 border border-red-500/30 text-red-700"
                }`}
              >
                {saveMessage.type === "success" ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{saveMessage.text}</p>
                  {ecoPointsEarned > 0 && (
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <Leaf className="h-4 w-4" />
                      Redeem your points at the Eco Store!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Save Calculation Button */}
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleSaveCalculation}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Calculation & Earn Eco Points"}
            </Button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Waste Composition */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Waste Composition</h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wasteComposition}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}kg`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {wasteComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Projection */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Monthly Projection</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
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

        {/* Additional Info */}
        <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="text-2xl font-bold mb-4">Environmental Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your household generates:</p>
              <p className="text-2xl font-bold">{(kitchen + plastic + paper + garden).toFixed(1)} kg</p>
              <p className="text-xs text-muted-foreground mt-1">of waste daily</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">This can power:</p>
              <p className="text-2xl font-bold">{Math.round(results.electricityKwh * 30)}</p>
              <p className="text-xs text-muted-foreground mt-1">LED bulbs for a month</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Equivalent to planting:</p>
              <p className="text-2xl font-bold">{Math.round(results.co2ReductionKg / 21)}</p>
              <p className="text-xs text-muted-foreground mt-1">trees per year</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
