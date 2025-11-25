import { createClient } from "@/lib/server/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total eco points earned
    const { data: pointsData, error: pointsError } = await supabase
      .from("eco_points")
      .select("points")
      .eq("user_id", user.id)

    if (pointsError) throw pointsError

    const totalEarned = pointsData?.reduce((sum: number, item: any) => sum + item.points, 0) || 0

    // Get total points spent
    const { data: spentData, error: spentError } = await supabase
      .from("user_eco_purchases")
      .select("points_spent")
      .eq("user_id", user.id)

    if (spentError) throw spentError

    const totalSpent = spentData?.reduce((sum: number, item: any) => sum + item.points_spent, 0) || 0
    const availablePoints = totalEarned - totalSpent

    // Get recent activities
    const { data: recentActivities } = await supabase
      .from("eco_points")
      .select("*")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })
      .limit(5)

    return NextResponse.json({
      totalEarned,
      totalSpent,
      availablePoints,
      recentActivities,
    })
  } catch (error) {
    console.error("[v0] Eco points API error:", error)
    return NextResponse.json({ error: "Failed to fetch eco points" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { points, activity, activityType } = await req.json()

    if (!points || !activity) {
      return NextResponse.json({ error: "Points and activity are required" }, { status: 400 })
    }

    // Add points
    const { error } = await supabase.from("eco_points").insert([
      {
        user_id: user.id,
        points,
        activity,
        activity_type: activityType || "general",
      },
    ])

    if (error) throw error

    return NextResponse.json({ success: true, message: "Points added successfully" })
  } catch (error) {
    console.error("[v0] Error adding eco points:", error)
    return NextResponse.json({ error: "Failed to add eco points" }, { status: 500 })
  }
}
