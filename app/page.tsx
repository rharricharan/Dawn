import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, redirect to login
  if (!user) {
    redirect("/login")
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single()

  // If onboarding not completed, redirect to onboarding
  if (!profile?.onboarding_completed) {
    redirect("/onboarding")
  }

  // If authenticated and onboarded, go to dashboard
  redirect("/dashboard")
}
