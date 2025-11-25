"use client"

import { useEffect, useRef, useState } from "react"

interface Location {
  id: string
  name: string
  type: "digester" | "compost" | "pickup"
  latitude: number
  longitude: number
  address: string
  contact: string
  distance?: number
}

interface CommunityMapProps {
  locations: Location[]
  selectedLocation?: Location | null
  onLocationSelect?: (location: Location) => void
  userLat?: number
  userLng?: number
}

export function CommunityMap({
  locations,
  selectedLocation,
  onLocationSelect,
  userLat = 12.9716,
  userLng = 77.5946,
}: CommunityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      setError("Mapbox token not configured")
      return
    }

    const loadMapbox = async () => {
      try {
        // Use CDN instead of npm import
        const script = document.createElement("script")
        script.src = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"
        script.async = true
        script.onload = () => {
          const link = document.createElement("link")
          link.href = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
          link.rel = "stylesheet"
          document.head.appendChild(link)

          // Initialize map after scripts load
          if (mapContainer.current && !map.current) {
            ;(window as any).mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

            map.current = new (window as any).mapboxgl.Map({
              container: mapContainer.current,
              style: "mapbox://styles/mapbox/outdoors-v12",
              center: [userLng, userLat],
              zoom: 12,
            })

            map.current.on("load", () => {
              setMapLoaded(true)

              // Add source for locations
              map.current?.addSource("locations", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: locations.map((loc) => ({
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [loc.longitude, loc.latitude],
                    },
                    properties: {
                      id: loc.id,
                      name: loc.name,
                      type: loc.type,
                      address: loc.address,
                      contact: loc.contact,
                    },
                  })),
                },
              })

              // Add layer with color coding
              map.current?.addLayer({
                id: "locations-layer",
                type: "circle",
                source: "locations",
                paint: {
                  "circle-radius": 8,
                  "circle-color": [
                    "match",
                    ["get", "type"],
                    "digester",
                    "#22c55e",
                    "compost",
                    "#f59e0b",
                    "pickup",
                    "#3b82f6",
                    "#999",
                  ],
                  "circle-stroke-width": 2,
                  "circle-stroke-color": "#fff",
                },
              })

              // Add click handler
              map.current?.on("click", "locations-layer", (e: any) => {
                const feature = e.features?.[0]
                if (feature?.properties) {
                  const location = locations.find((loc) => loc.id === feature.properties.id)
                  if (location && onLocationSelect) {
                    onLocationSelect(location)
                  }
                }
              })

              map.current!.on("mouseenter", "locations-layer", () => {
                map.current!.getCanvas().style.cursor = "pointer"
              })

              map.current!.on("mouseleave", "locations-layer", () => {
                map.current!.getCanvas().style.cursor = ""
              })
            })
          }
        }
        script.onerror = () => {
          setError("Failed to load Mapbox GL JS")
        }
        document.head.appendChild(script)
      } catch (err) {
        console.error("[v0] Mapbox loading error:", err)
        setError("Failed to initialize map")
      }
    }

    loadMapbox()

    return () => {
      // Cleanup handled by Next.js
    }
  }, [locations, onLocationSelect, userLat, userLng])

  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedLocation) return

    try {
      // Create popup
      const popup = new (window as any).mapboxgl.Popup().setHTML(
        `
          <div class="p-3">
            <h3 class="font-bold">${selectedLocation.name}</h3>
            <p class="text-sm text-gray-600">${selectedLocation.address}</p>
            <p class="text-sm mt-2">${selectedLocation.contact}</p>
          </div>
        `,
      )

      // Fly to location
      map.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 14,
        duration: 1500,
      })

      // Set marker with popup
      ;new (window as any).mapboxgl.Marker({ color: "#22c55e" })
        .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
        .setPopup(popup)
        .addTo(map.current)
    } catch (err) {
      console.error("[v0] Error handling selected location:", err)
    }
  }, [selectedLocation, mapLoaded])

  return (
    <div>
      {error && (
        <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
    </div>
  )
}
