import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Use admin client to check if user exists
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // List users by email using admin API
    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error("Email check error:", error)
      return NextResponse.json(
        { error: "Unable to check email" },
        { status: 500 }
      )
    }

    // Check if any user has this email
    const userExists = data.users.some(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    )

    return NextResponse.json({ exists: userExists })
  } catch (error) {
    console.error("Email check error:", error)
    return NextResponse.json(
      { error: "Unable to check email" },
      { status: 500 }
    )
  }
}
