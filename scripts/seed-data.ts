import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDatabase() {
  console.log("Starting database seeding...")

  try {
    // Create demo user
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([
        {
          email: "demo@wastewise.app",
          name: "Demo User",
          household_size: 4,
        },
      ])
      .select()

    if (userError) {
      console.error("Error creating user:", userError)
      return
    }

    const userId = user?.[0]?.id
    console.log("Created demo user:", userId)

    // Add waste logs for last 30 days
    const wasteLogsData = Array.from({ length: 30 }, (_, i) => ({
      user_id: userId,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      kitchen_kg: 2 + Math.random() * 2,
      plastic_kg: 0.5 + Math.random() * 1,
      paper_kg: 0.3 + Math.random() * 0.5,
      garden_kg: 1 + Math.random() * 2,
      total_kg: 3.8 + Math.random() * 5,
    }))

    const { error: logsError } = await supabase.from("waste_logs").insert(wasteLogsData)

    if (logsError) {
      console.error("Error creating waste logs:", logsError)
    } else {
      console.log("Created 30 waste log entries")
    }

    // Add community locations
    const locationsData = [
      {
        name: "Community Biogas Digester - Bangalore",
        type: "digester",
        address: "123 Green Street, Bangalore",
        contact: "+91 98765 43210",
        latitude: 12.9716,
        longitude: 77.5946,
      },
      {
        name: "Eco Compost Hub",
        type: "compost",
        address: "456 Eco Lane, Bangalore",
        contact: "+91 87654 32109",
        latitude: 12.9352,
        longitude: 77.6245,
      },
      {
        name: "Waste Pickup Route - Zone A",
        type: "pickup",
        address: "Various locations",
        contact: "+91 76543 21098",
        latitude: 12.9897,
        longitude: 77.611,
      },
    ]

    const { error: locationsError } = await supabase.from("community_locations").insert(locationsData)

    if (locationsError) {
      console.error("Error creating locations:", locationsError)
    } else {
      console.log("Created 3 community locations")
    }

    // Add habit nudges
    const nudgesData = [
      {
        user_id: userId,
        nudge_text: "You reduced waste by 15% this week! Keep it up!",
        nudge_type: "success",
      },
      {
        user_id: userId,
        nudge_text: "Your plastic waste increased 10%. Try using reusable bags!",
        nudge_type: "warning",
      },
      {
        user_id: userId,
        nudge_text: "You could save ₹500 monthly by composting organic waste",
        nudge_type: "tip",
      },
    ]

    const { error: nudgesError } = await supabase.from("habit_nudges").insert(nudgesData)

    if (nudgesError) {
      console.error("Error creating nudges:", nudgesError)
    } else {
      console.log("Created 3 habit nudges")
    }

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Seeding failed:", error)
  }
}

seedDatabase()
