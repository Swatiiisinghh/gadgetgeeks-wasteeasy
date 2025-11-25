import { createClient } from "@/lib/server/supabase"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const EventSchema = z.object({
  event_name: z.string().min(1),
  event_date: z.string(),
  food_quantity_kg: z.number().min(0),
  latitude: z.number(),
  longitude: z.number(),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = EventSchema.parse(body)

    // Insert event
    const { data: event, error: eventError } = await supabase
      .from("event_food_donations")
      .insert([
        {
          user_id: user.id,
          event_name: validatedData.event_name,
          event_date: validatedData.event_date,
          food_quantity_kg: validatedData.food_quantity_kg,
          latitude: validatedData.latitude,
          longitude: validatedData.longitude,
        },
      ])
      .select()

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 })
    }

    return NextResponse.json({ event: event?.[0] }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("event_food_donations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ events: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
