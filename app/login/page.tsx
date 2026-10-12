"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInWithGoogle, sendEmailOtp } from "@/lib/auth/actions"
import { Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const googleButtonRef = useRef<HTMLButtonElement>(null)
  const continueButtonRef = useRef<HTMLButtonElement>(null)

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

  const handleEmailContinue = async () => {
    setEmailError(null)
    setIsLoading(true)

    if (!email) {
      setEmailError("Email is required.")
      setIsLoading(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    try {
      const result = await sendEmailOtp(email)

      if (result?.error) {
        setError("We're having trouble sending the code. Please try again.")
        setIsLoading(false)
      } else {
        // Redirect to verification page with email
        router.push(`/verify-code?email=${encodeURIComponent(email)}`)
      }
    } catch (err) {
      console.error("Send OTP error:", err)
      setError("We're experiencing technical difficulties. Please try again.")
      setIsLoading(false)
    }
  }

  const handleGoogleButtonHover = (isHovering: boolean) => {
    if (!googleButtonRef.current) return

    gsap.to(googleButtonRef.current, {
      borderRadius: isHovering ? "16px" : "9999px",
      backgroundColor: isHovering ? "rgba(18, 9, 2, 0.05)" : "transparent",
      borderColor: isHovering ? "rgba(18, 9, 2, 0.3)" : "rgba(18, 9, 2, 0.15)",
      duration: 0.05,
      ease: "power1.out"
    })
  }

  const handleContinueButtonHover = (isHovering: boolean) => {
    if (!continueButtonRef.current) return

    gsap.to(continueButtonRef.current, {
      borderRadius: isHovering ? "16px" : "9999px",
      duration: 0.05,
      ease: "power1.out"
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-[16px] py-[32px] sm:px-[24px] md:px-[32px]">
      <div className="w-full max-w-[448px] flex flex-col gap-[32px]">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/dawn-logo.svg"
            alt="Dawn"
            className="h-[56px] w-auto sm:h-[64px]"
          />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.2]">
            Welcome back, let's jam!
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-[16px] w-[16px]" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Auth Form */}
        <div className="flex flex-col gap-[24px]">
          {/* Continue with Gmail */}
          <Button
            ref={googleButtonRef}
            variant="outline"
            size="lg"
            className="w-full h-[50px] text-[16px] font-semibold tracking-[-0.02em] bg-transparent border-[#120902]/15 rounded-full text-foreground/80"
            onClick={handleGoogleSignIn}
            onMouseEnter={() => handleGoogleButtonHover(true)}
            onMouseLeave={() => handleGoogleButtonHover(false)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-[8px] h-[20px] w-[20px] animate-spin" />
            ) : (
              <svg className="mr-[8px] h-[20px] w-[20px]" viewBox="0 0 24 24">
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
            <div className="relative flex justify-center text-[12px]">
              <span className="bg-background px-[8px] text-[#120902]/70">or</span>
            </div>
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-[12px]">
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
              className={`h-[50px] text-[16px] sm:text-[20px] px-[24px] rounded-[16px] tracking-[-0.02em] placeholder:text-[#120902]/80 placeholder:font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 transition-all autofill:bg-[rgba(255,175,105,0.08)] autofill:text-[#120902]/95 autofill:border-[#FFAF69] autofill:shadow-[0_0_0_1000px_rgba(255,175,105,0.08)_inset] ${
                emailError
                  ? "bg-[#DF3E0D]/8 border-[2px] border-[#DF3E0D] text-[#120902]/60"
                  : email
                    ? "bg-[rgba(255,175,105,0.08)] border-[2px] border-[#FFAF69] text-[#120902]/95 font-semibold"
                    : "bg-[#120902]/5 border-[2px] border-transparent hover:border-[#120902]/30 focus:border-[#FFAF69] text-[#120902]/95"
              }`}
            />
            {emailError && (
              <p className="text-[14px] text-[#A23F21]">{emailError}</p>
            )}
          </div>

          {/* Continue Button */}
          <Button
            ref={continueButtonRef}
            size="lg"
            className="w-full h-[54px] text-[16px] font-semibold tracking-[-0.02em] rounded-full relative z-10"
            onClick={handleEmailContinue}
            onMouseEnter={() => handleContinueButtonHover(true)}
            onMouseLeave={() => handleContinueButtonHover(false)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-[8px] h-[16px] w-[16px] animate-spin" />
                Continue...
              </>
            ) : (
              "Continue"
            )}
          </Button>

          {/* Terms */}
          <p className="text-[12px] text-center text-muted-foreground leading-[1.5] tracking-[0px]">
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
        <p className="text-[14px] text-center font-semibold text-[#120902]/70 tracking-[-0.03em]">
          Don't have an account yet?{" "}
          <Link
            href="/register"
            className="underline hover:text-foreground transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
