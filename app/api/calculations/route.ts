import { createClient } from "@/lib/server/supabase"
import { performCalculations } from "@/lib/calculations"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const CalculationSchema = z.object({
  kitchen_kg: z.number().min(0).max(10),
  plastic_kg: z.number().min(0).max(5),
  paper_kg: z.number().min(0).max(3),
  garden_kg: z.number().min(0).max(5),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = CalculationSchema.parse(body)

    // Perform calculations
    const results = performCalculations(
      validatedData.kitchen_kg,
      validatedData.plastic_kg,
      validatedData.paper_kg,
      validatedData.garden_kg,
    )

    // Save to database
    const { data, error } = await supabase.from("calculations").insert([
      {
        user_id: user.id,
        biogas_l: results.biogasLiters,
        electricity_kwh: results.electricityKwh,
        cost_savings_inr: results.costSavingsInr,
        co2_reduction_kg: results.co2ReductionKg,
        fertilizer_kg: results.fertilizerKg,
      },
    ])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const totalWaste =
      validatedData.kitchen_kg + validatedData.plastic_kg + validatedData.paper_kg + validatedData.garden_kg
    const ecoPointsEarned = Math.round(totalWaste * 10) // 10 points per kg of waste tracked

    await supabase.from("eco_points").insert([
      {
        user_id: user.id,
        points: ecoPointsEarned,
        activity: `Tracked ${totalWaste.toFixed(1)}kg of waste - Biogas: ${results.biogasLiters.toFixed(1)}L, CO₂ saved: ${results.co2ReductionKg.toFixed(1)}kg`,
        activity_type: "waste_tracking",
      },
    ])

    return NextResponse.json(
      {
        success: true,
        calculation_id: data?.[0]?.id,
        results,
        ecoPointsEarned,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("[v0] Calculation error:", error)
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

    // Get user's calculations
    const { data, error } = await supabase
      .from("calculations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ calculations: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
