import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  // Update auth session
  const response = await updateSession(request)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/register')
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding')
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')

  // If user is logged in and trying to access auth pages, redirect to home
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is not logged in and trying to access protected pages
  if (!user && (isDashboard || isOnboardingPage)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in and trying to access dashboard, check onboarding
  if (user && isDashboard) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single()

    if (!profile?.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
