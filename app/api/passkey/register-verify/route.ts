import { NextResponse } from "next/server"
import { verifyRegistrationResponse } from "@simplewebauthn/server"
import { createClient } from "@/lib/supabase/server"
import type { RegistrationResponseJSON } from "@simplewebauthn/types"

export async function POST(request: Request) {
  try {
    const { email, credential } = await request.json() as {
      email: string
      credential: RegistrationResponseJSON
    }

    const supabase = await createClient()

    // Get the challenge
    const { data: challengeData } = await supabase
      .from("passkey_challenges")
      .select("challenge")
      .eq("email", email)
      .eq("type", "registration")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!challengeData) {
      return NextResponse.json(
        { error: "Challenge not found or expired" },
        { status: 400 }
      )
    }

    // Verify the registration
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challengeData.challenge,
      expectedOrigin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      expectedRPID: process.env.NEXT_PUBLIC_RP_ID || "localhost",
    })

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      )
    }

    // Create user account with passkey
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: crypto.randomUUID(), // Random password, won't be used
      options: {
        data: {
          passkey_only: true,
        },
      },
    })

    if (signUpError || !authData.user) {
      return NextResponse.json(
        { error: signUpError?.message || "Failed to create user" },
        { status: 400 }
      )
    }

    // Store the passkey credential
    const { credentialID, credentialPublicKey, counter } = verification.registrationInfo

    await supabase.from("passkey_credentials").insert({
      user_id: authData.user.id,
      credential_id: Buffer.from(credentialID).toString("base64"),
      public_key: Buffer.from(credentialPublicKey).toString("base64"),
      counter,
      device_type: "platform",
    })

    // Clean up challenge
    await supabase
      .from("passkey_challenges")
      .delete()
      .eq("email", email)
      .eq("type", "registration")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Passkey registration verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify registration" },
      { status: 500 }
    )
  }
}
