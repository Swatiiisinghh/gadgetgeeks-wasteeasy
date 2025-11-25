import { createClient } from "@/lib/server/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: products, error } = await supabase
      .from("eco_store")
      .select("*")
      .gt("stock", 0)
      .order("points_cost", { ascending: true })

    if (error) throw error

    return NextResponse.json({ products })
  } catch (error) {
    console.error("[v0] Eco store API error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, pointsToSpend } = await req.json()

    // Get current user points
    const { data: pointsData, error: pointsError } = await supabase
      .from("eco_points")
      .select("points")
      .eq("user_id", user.id)

    if (pointsError) throw pointsError

    const totalEarned = pointsData?.reduce((sum: number, item: any) => sum + item.points, 0) || 0

    // Get spent points
    const { data: spentData, error: spentError } = await supabase
      .from("user_eco_purchases")
      .select("points_spent")
      .eq("user_id", user.id)

    if (spentError) throw spentError

    const totalSpent = spentData?.reduce((sum: number, item: any) => sum + item.points_spent, 0) || 0
    const availablePoints = totalEarned - totalSpent

    if (availablePoints < pointsToSpend) {
      return NextResponse.json({ error: "Insufficient eco points" }, { status: 400 })
    }

    // Record purchase
    const { error: purchaseError } = await supabase.from("user_eco_purchases").insert([
      {
        user_id: user.id,
        product_id: productId,
        points_spent: pointsToSpend,
      },
    ])

    if (purchaseError) throw purchaseError

    return NextResponse.json({ success: true, message: "Product purchased successfully" })
  } catch (error) {
    console.error("[v0] Error purchasing eco product:", error)
    return NextResponse.json({ error: "Failed to complete purchase" }, { status: 500 })
  }
}
