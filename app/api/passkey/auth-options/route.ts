import { NextResponse } from "next/server"
import { generateAuthenticationOptions } from "@simplewebauthn/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()

    // Get all registered credentials (we'll let the browser choose which one to use)
    const { data: credentials } = await supabase
      .from("passkey_credentials")
      .select("credential_id")

    const allowCredentials = credentials?.map(cred => ({
      id: Buffer.from(cred.credential_id, "base64"),
      type: "public-key" as const,
    })) || []

    const options = await generateAuthenticationOptions({
      rpID: process.env.NEXT_PUBLIC_RP_ID || "localhost",
      allowCredentials,
      userVerification: "preferred",
    })

    // Store challenge
    await supabase.from("passkey_challenges").insert({
      challenge: options.challenge,
      type: "authentication",
    })

    return NextResponse.json(options)
  } catch (error) {
    console.error("Passkey authentication options error:", error)
    return NextResponse.json(
      { error: "Failed to generate authentication options" },
      { status: 500 }
    )
  }
}
