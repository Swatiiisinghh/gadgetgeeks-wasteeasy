"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { CommunityMap } from "@/components/maps/community-map"
import { MapPin, Search, NavigationIcon, Phone, Loader2 } from "lucide-react"

interface Location {
  id: string
  name: string
  type: "digester" | "compost" | "pickup"
  address: string
  contact: string
  distance: number
  latitude: number
  longitude: number
}

export default function MapsPage() {
  const [selectedTypes, setSelectedTypes] = useState({
    digester: true,
    compost: true,
    pickup: true,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState({ lat: 12.9716, lng: 77.5946 })

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Get user location first
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            setUserLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            })
          })
        }

        const response = await fetch("/api/locations")
        const data = await response.json()

        // Mock locations for now (would come from API)
        const mockLocations: Location[] = [
          {
            id: "1",
            name: "Community Biogas Digester - Bangalore",
            type: "digester",
            address: "123 Green Street, Bangalore",
            contact: "+91 98765 43210",
            distance: 2.3,
            latitude: 12.9716,
            longitude: 77.5946,
          },
          {
            id: "2",
            name: "Eco Compost Hub",
            type: "compost",
            address: "456 Eco Lane, Bangalore",
            contact: "+91 87654 32109",
            distance: 5.1,
            latitude: 12.9352,
            longitude: 77.6245,
          },
          {
            id: "3",
            name: "Waste Pickup Route - Zone A",
            type: "pickup",
            address: "Various locations",
            contact: "+91 76543 21098",
            distance: 1.8,
            latitude: 12.9897,
            longitude: 77.611,
          },
          {
            id: "4",
            name: "Garden Waste Collection Center",
            type: "compost",
            address: "789 Nature Park, Bangalore",
            contact: "+91 65432 10987",
            distance: 8.5,
            latitude: 12.9089,
            longitude: 77.6412,
          },
          {
            id: "5",
            name: "Advanced Biogas Facility",
            type: "digester",
            address: "321 Tech Park, Bangalore",
            contact: "+91 54321 09876",
            distance: 12.3,
            latitude: 12.8384,
            longitude: 77.6245,
          },
        ]

        setLocations(mockLocations)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch locations:", error)
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [])

  const filteredLocations = locations.filter((loc) => {
    const typeMatch = selectedTypes[loc.type as keyof typeof selectedTypes]
    const searchMatch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase())
    return typeMatch && searchMatch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "digester":
        return "bg-green-500"
      case "compost":
        return "bg-amber-500"
      case "pickup":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "digester":
        return "Biogas Digester"
      case "compost":
        return "Compost Center"
      case "pickup":
        return "Waste Pickup"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Community Locations</h1>
          <p className="text-lg text-muted-foreground">Find waste management facilities near you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="font-bold text-lg mb-6">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search locations"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Type Filters */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-muted-foreground">Location Type</p>
                {[
                  { id: "digester", label: "Biogas Digesters", color: "bg-green-500" },
                  { id: "compost", label: "Compost Centers", color: "bg-amber-500" },
                  { id: "pickup", label: "Waste Pickup", color: "bg-blue-500" },
                ].map((filter) => (
                  <label key={filter.id} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={selectedTypes[filter.id as keyof typeof selectedTypes]}
                      onCheckedChange={(checked) =>
                        setSelectedTypes({
                          ...selectedTypes,
                          [filter.id]: checked,
                        })
                      }
                    />
                    <span className="flex items-center gap-2 text-sm">
                      <span className={`h-2 w-2 rounded-full ${filter.color}`} />
                      {filter.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Location List */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground mb-3">Nearby Locations</p>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredLocations.map((location) => (
                      <div
                        key={location.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedLocation?.id === location.id
                            ? "bg-primary/10 border border-primary"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                        onClick={() => setSelectedLocation(location)}
                      >
                        <p className="font-semibold text-sm">{location.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{location.distance} km away</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mapbox Map */}
            <Card className="overflow-hidden h-96">
              <CommunityMap
                locations={filteredLocations}
                selectedLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
                userLat={userLocation.lat}
                userLng={userLocation.lng}
              />
            </Card>

            {/* Selected Location Details */}
            {selectedLocation ? (
              <Card className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`h-3 w-3 rounded-full ${getTypeColor(selectedLocation.type)}`} />
                      <span className="text-sm font-semibold text-muted-foreground">
                        {getTypeLabel(selectedLocation.type)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold">{selectedLocation.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{selectedLocation.distance}</p>
                    <p className="text-sm text-muted-foreground">km away</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-semibold">{selectedLocation.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-semibold">{selectedLocation.contact}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                  <NavigationIcon className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Select a location from the list to view details</p>
              </Card>
            )}

            {/* Locations Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-4">All Locations ({filteredLocations.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLocations.map((location) => (
                  <Card
                    key={location.id}
                    className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`h-3 w-3 rounded-full ${getTypeColor(location.type)}`} />
                      <span className="text-sm font-semibold text-muted-foreground">{location.distance} km</span>
                    </div>
                    <h4 className="font-semibold mb-2">{location.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{location.address}</p>
                    <p className="text-sm font-medium text-primary">{location.contact}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
