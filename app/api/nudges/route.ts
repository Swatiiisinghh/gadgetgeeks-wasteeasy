import { createClient } from "@/lib/server/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's last 30 days of waste logs
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: logs, error: logsError } = await supabase
      .from("waste_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", thirtyDaysAgo.toISOString().split("T")[0])

    if (logsError) {
      return NextResponse.json({ error: logsError.message }, { status: 500 })
    }

    // Generate nudges based on patterns
    const nudges = generateNudges(logs || [])

    return NextResponse.json({ nudges })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateNudges(logs: any[]): any[] {
  const nudges = []

  if (logs.length === 0) {
    nudges.push({
      type: "info",
      text: "Start logging your waste to get personalized insights!",
    })
    return nudges
  }

  // Calculate trends
  const totalWaste = logs.reduce((sum, log) => sum + (log.total_kg || 0), 0)
  const avgDaily = totalWaste / logs.length
  const plasticWaste = logs.reduce((sum, log) => sum + (log.plastic_kg || 0), 0)

  if (avgDaily < 3) {
    nudges.push({
      type: "success",
      text: "Amazing! You're generating only " + avgDaily.toFixed(1) + "kg waste daily. Keep it up!",
    })
  }

  if (plasticWaste > totalWaste * 0.3) {
    nudges.push({
      type: "warning",
      text: "Your plastic waste is high. Try using reusable bags and containers!",
    })
  }

  nudges.push({
    type: "tip",
    text: "You could save ₹" + Math.round(avgDaily * 8 * 30) + " monthly by composting your organic waste!",
  })

  return nudges
}
