import { NextResponse } from "next/server"
import { generateRegistrationOptions } from "@simplewebauthn/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Generate registration options
    const options = await generateRegistrationOptions({
      rpName: "Dawn",
      rpID: process.env.NEXT_PUBLIC_RP_ID || "localhost",
      userName: email,
      userDisplayName: email,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform", // Prefer platform authenticators (Touch ID, Face ID)
      },
    })

    // Store challenge in database
    await supabase.from("passkey_challenges").insert({
      challenge: options.challenge,
      email,
      type: "registration",
    })

    return NextResponse.json(options)
  } catch (error) {
    console.error("Passkey registration options error:", error)
    return NextResponse.json(
      { error: "Failed to generate registration options" },
      { status: 500 }
    )
  }
}
