import { createClient } from "@/lib/server/supabase"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const LocationSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["digester", "compost", "pickup"]),
  address: z.string().min(1),
  contact: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
})

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const latitude = searchParams.get("latitude")
    const longitude = searchParams.get("longitude")
    const radius = searchParams.get("radius") || "10" // km

    let query = supabase.from("community_locations").select("*")

    if (type) {
      query = query.eq("type", type)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Filter by distance if coordinates provided
    if (latitude && longitude) {
      const lat = Number.parseFloat(latitude)
      const lng = Number.parseFloat(longitude)
      const radiusKm = Number.parseFloat(radius)

      const filtered = data?.filter((loc: any) => {
        // Simple distance calculation
        const lat1 = lat * (Math.PI / 180)
        const lat2 = loc.latitude * (Math.PI / 180)
        const dLat = ((loc.latitude - lat) * Math.PI) / 180
        const dLng = ((loc.longitude - lng) * Math.PI) / 180

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = 6371 * c

        return distance <= radiusKm
      })

      return NextResponse.json({ locations: filtered || [] })
    }

    return NextResponse.json({ locations: data || [] })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    const validatedData = LocationSchema.parse(body)

    const { data, error } = await supabase.from("community_locations").insert([
      {
        name: validatedData.name,
        type: validatedData.type,
        address: validatedData.address,
        contact: validatedData.contact,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
      },
    ])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ location: data?.[0] }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
