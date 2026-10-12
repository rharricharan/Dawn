"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInWithGoogle } from "@/lib/auth/actions"
import { Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signInWithGoogle()

      if (result?.error) {
        setError("We're having trouble connecting to Google. Please try again in a moment.")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Google sign-in error:", err)
      setError("We're experiencing technical difficulties. Please try again or use a different sign-in method.")
      setIsLoading(false)
    }
  }

  const handleEmailContinue = () => {
    setEmailError(null)

    if (!email) {
      setEmailError("Email is required.")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.")
      return
    }

    // Redirect to register with email pre-filled
    router.push(`/register?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/dawn-logo.svg"
            alt="Dawn"
            className="h-16 w-auto"
          />
        </div>

        {/* Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-[32px] font-semibold tracking-[-0.03em]">
            Create your free account
          </h1>
          <p className="text-muted-foreground text-[13px] font-medium">
            Create your free account to get started.<br />
            No credit card required.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Auth Form */}
        <div className="space-y-6">
          {/* Continue with Gmail */}
          <Button
            variant="outline"
            size="lg"
            className="w-full h-[50px] text-base font-semibold tracking-[-0.02em] bg-transparent border-[#120902]/15 rounded-full hover:bg-[#120902]/5 hover:border-[#120902]/30 transition-colors text-foreground/80"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Gmail
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#120902]/20" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-[#120902]/70">or</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEmailContinue()
                }
              }}
              className={`h-[50px] text-xl px-6 rounded-2xl placeholder:text-[#120902]/80 placeholder:font-medium focus-visible:ring-0 focus-visible:ring-offset-0 transition-all ${
                emailError
                  ? "bg-[#DF3E0D]/8 border-[2px] border-[#DF3E0D] text-[#120902]/60"
                  : `bg-[#120902]/8 border-transparent hover:border-[#120902]/30 focus:border-[#120902] text-[#120902] ${email ? 'font-semibold' : ''}`
              }`}
            />
            {emailError && (
              <p className="text-sm text-[#A23F21]">{emailError}</p>
            )}
          </div>

          {/* Continue Button */}
          <div className="border-beam rounded-full">
            <Button
              size="lg"
              className="w-full h-[54px] text-base font-semibold tracking-[-0.02em] rounded-full hover:scale-[1.01] transition-transform relative z-10"
              onClick={handleEmailContinue}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Continue...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to Dawn's{" "}
            <Link
              href="/terms"
              className="underline hover:text-foreground transition-colors"
            >
              Terms of service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-sm text-center text-muted-foreground">
          Don't have an account yet?{" "}
          <Link
            href="/register"
            className="font-semibold underline hover:text-foreground transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
