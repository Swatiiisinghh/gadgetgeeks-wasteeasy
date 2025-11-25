"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DonationForm } from "@/components/events/donation-form"
import { Plus, Phone, CheckCircle, Clock, Truck } from "lucide-react"

interface EventRequest {
  id: string
  event_name: string
  food_quantity_kg: number
  event_date: string
  status: "pending" | "accepted" | "completed"
  ngo_name?: string
  ngo_phone?: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events")
        if (response.ok) {
          const data = await response.json()
          setEvents(data.events || [])
        } else {
          // Use mock data for demo
          setEvents([
            {
              id: "1",
              event_name: "Wedding Reception",
              food_quantity_kg: 50,
              event_date: "2025-12-15",
              status: "accepted",
              ngo_name: "Hunger Relief Foundation",
              ngo_phone: "+91 98765 43210",
            },
            {
              id: "2",
              event_name: "Corporate Team Outing",
              food_quantity_kg: 30,
              event_date: "2025-12-10",
              status: "pending",
            },
            {
              id: "3",
              event_name: "Birthday Party",
              food_quantity_kg: 20,
              event_date: "2025-12-05",
              status: "completed",
              ngo_name: "Community Food Bank",
              ngo_phone: "+91 87654 32109",
            },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700"
      case "accepted":
        return "bg-green-500/10 text-green-700"
      case "completed":
        return "bg-blue-500/10 text-blue-700"
      default:
        return "bg-gray-500/10 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "completed":
        return <Truck className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Don't Let Food Go to Waste</h1>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Connect your event surplus food with verified NGOs. Transform what would be wasted into meals for those in
              need.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Donation Request
            </Button>
          </div>
        </section>

        {/* Form Modal */}
        {showForm && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">New Donation Request</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
            <DonationForm
              onSuccess={() => {
                setShowForm(false)
                // Refetch events
                window.location.reload()
              }}
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-primary mb-2">12.5 T</p>
            <p className="text-sm text-muted-foreground">Food Saved This Month</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-secondary mb-2">2,450+</p>
            <p className="text-sm text-muted-foreground">Meals Provided</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-green-600 mb-2">45</p>
            <p className="text-sm text-muted-foreground">NGOs Connected</p>
          </Card>
        </div>

        {/* Active Requests */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Your Donation Requests</h2>
          {isLoading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading your events...</p>
            </Card>
          ) : events.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No donation requests yet</p>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Request
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{event.event_name}</h3>
                        <Badge className={`${getStatusColor(event.status)} border-0`}>
                          <span className="inline-block mr-1">{getStatusIcon(event.status)}</span>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Food Quantity:{" "}
                        <span className="font-semibold text-foreground">{event.food_quantity_kg} kg</span> • Event Date:{" "}
                        <span className="font-semibold text-foreground">
                          {new Date(event.event_date).toLocaleDateString()}
                        </span>
                      </p>

                      {event.status === "accepted" && event.ngo_name && (
                        <div className="bg-green-500/5 rounded-lg p-3 mt-3">
                          <p className="text-sm font-semibold mb-2">Assigned NGO:</p>
                          <p className="font-medium">{event.ngo_name}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm">
                            <Phone className="h-4 w-4" />
                            {event.ngo_phone}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {event.status === "pending" && <Button size="sm">Confirm</Button>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Utensil Rental Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Eco-Friendly Utensil Rentals</h2>
            <p className="text-lg text-muted-foreground">Need sustainable serving solutions for your event?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Starter Pack",
                plates: 50,
                price: 500,
                items: "Steel plates & glasses",
              },
              {
                name: "Standard Pack",
                plates: 100,
                price: 900,
                items: "Steel plates, glasses & utensils",
              },
              {
                name: "Premium Pack",
                plates: 200,
                price: 1800,
                items: "Steel plates, glasses, cutlery & serving spoons",
              },
            ].map((pack) => (
              <Card key={pack.name} className="p-6">
                <h3 className="text-xl font-bold mb-2">{pack.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pack.items}</p>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-primary">₹{pack.price}</p>
                  <p className="text-xs text-muted-foreground">one-time rental</p>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  Request Rental
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/30 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Request",
                description: "Tell us about your event, food quantity, and date",
              },
              {
                step: "2",
                title: "Get Matched",
                description: "Our AI finds the best NGOs based on location & capacity",
              },
              {
                step: "3",
                title: "Make Impact",
                description: "Food reaches those in need, you reduce waste",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Rajesh's Wedding",
                story: "Donated 120 kg of food to feed 500+ people at local shelter",
                impact: "12 Tonnes CO₂ saved",
              },
              {
                name: "Tech Company Outing",
                story: "Connected 80 kg surplus food with 3 local NGOs",
                impact: "330 Meals provided",
              },
            ].map((story, i) => (
              <Card key={i} className="p-6">
                <p className="font-bold text-lg mb-2">{story.name}</p>
                <p className="text-sm text-muted-foreground mb-3">{story.story}</p>
                <Badge className="bg-green-500/10 text-green-700 border-0">{story.impact}</Badge>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
