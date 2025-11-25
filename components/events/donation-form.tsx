"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader } from "lucide-react"

interface DonationFormProps {
  onSuccess?: () => void
}

export function DonationForm({ onSuccess }: DonationFormProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    event_name: "",
    event_date: "",
    food_quantity_kg: 0,
    address: "",
    latitude: 0,
    longitude: 0,
    instructions: "",
  })

  const handleGetLocation = async () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }))
          resolve(true)
        },
        () => resolve(false),
      )
    })
  }

  const handleSubmit = async () => {
    if (!formData.event_name || !formData.event_date || formData.food_quantity_kg <= 0) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name: formData.event_name,
          event_date: formData.event_date,
          food_quantity_kg: formData.food_quantity_kg,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      })

      if (response.ok) {
        alert("Event donation request created successfully!")
        setFormData({
          event_name: "",
          event_date: "",
          food_quantity_kg: 0,
          address: "",
          latitude: 0,
          longitude: 0,
          instructions: "",
        })
        setStep(1)
        onSuccess?.()
      } else {
        alert("Failed to create donation request")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className={`w-12 h-1 mx-2 ${step > s ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Event Details */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Event Details</h3>

          <div className="space-y-2">
            <Label htmlFor="event_name">Event Name</Label>
            <Input
              id="event_name"
              placeholder="e.g., Wedding Reception"
              value={formData.event_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, event_name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date">Event Date</Label>
            <Input
              id="event_date"
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, event_date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="food_quantity">Expected Food Surplus (kg)</Label>
            <Input
              id="food_quantity"
              type="number"
              min="0"
              step="0.5"
              placeholder="50"
              value={formData.food_quantity_kg}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  food_quantity_kg: Number.parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <Button onClick={() => setStep(2)} className="w-full bg-primary hover:bg-primary/90">
            Next Step
          </Button>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Event Location</h3>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main Street, City"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <Button onClick={handleGetLocation} variant="outline" className="w-full bg-transparent">
            Use Current Location
          </Button>

          {formData.latitude && formData.longitude && (
            <div className="bg-green-500/10 p-3 rounded-lg text-sm">
              Location set: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Any special handling or delivery instructions..."
              value={formData.instructions}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  instructions: e.target.value,
                }))
              }
              className="min-h-24"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-primary/90">
              Next Step
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Review Your Request</h3>

          <div className="bg-muted p-6 rounded-lg space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Event Name</p>
              <p className="text-lg font-semibold">{formData.event_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Event Date</p>
              <p className="text-lg font-semibold">{formData.event_date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Food Surplus</p>
              <p className="text-lg font-semibold">{formData.food_quantity_kg} kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-lg font-semibold">{formData.address || "Current location"}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="flex-1 bg-primary hover:bg-primary/90">
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
