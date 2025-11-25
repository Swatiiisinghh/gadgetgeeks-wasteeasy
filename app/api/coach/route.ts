import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { createClient } from "@/lib/server/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, conversationHistory } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Fetch user's recent waste data for context
    const { data: recentLogs } = await supabase
      .from("waste_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(7)

    const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

    // Calculate average waste
    const avgDailyWaste =
      recentLogs?.reduce((sum: number, log: any) => sum + (log.total_kg || 0), 0) / (recentLogs?.length || 1) || 0

    // Build context-aware system prompt
    const systemPrompt = `You are an expert waste management coach helping Indian households reduce waste sustainably. 
Your role is to provide personalized, actionable advice based on the user's waste patterns.

User Context:
- Daily waste average: ${avgDailyWaste.toFixed(1)} kg
- Household size: ${userProfile?.household_size || 1} people
- Recent logs: ${recentLogs?.length || 0} entries

Guidelines:
1. Be encouraging and celebrate small wins
2. Provide specific, actionable recommendations
3. Reference Indian context and local solutions
4. Focus on waste reduction, composting, and sustainable practices
5. Use relatable examples and analogies
6. Ask clarifying questions to understand their situation better
7. Suggest habits that can compound over time

Respond helpfully and conversationally.`

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Save conversation to database
    await supabase.from("ai_recommendations").insert([
      {
        user_id: user.id,
        recommendation_text: text,
        category: "coach",
      },
    ])

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Coach API error:", error)
    return NextResponse.json({ error: "Failed to generate response. Please try again." }, { status: 500 })
  }
}
