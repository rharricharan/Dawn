"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyOtp } from "@/lib/auth/actions"
import { Loader2, AlertCircle } from "lucide-react"
import PageTransition from "@/components/transitions/PageTransition"

function VerifyCodeForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState<string | null>(null)
  const continueButtonRef = useRef<HTMLButtonElement>(null)

  const handleVerifyCode = async () => {
    setCodeError(null)
    setIsLoading(true)

    if (!code) {
      setCodeError("Code is required.")
      setIsLoading(false)
      return
    }

    if (code.length !== 6) {
      setCodeError("Please enter a valid 6-digit code.")
      setIsLoading(false)
      return
    }

    try {
      const result = await verifyOtp(email, code)

      if (result?.error) {
        setError("Invalid or expired code. Please try again.")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Verify OTP error:", err)
      setError("We're experiencing technical difficulties. Please try again.")
      setIsLoading(false)
    }
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
    <PageTransition>
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
        <div className="text-center flex flex-col gap-[12px]">
          <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.03em] leading-[1.2]">
            Welcome back, let's jam!
          </h1>
          <p className="text-muted-foreground text-[14px] font-medium leading-[1.5]">
            We sent a temporary login code to {email}
            <br />
            <Link href="/login" className="underline hover:text-foreground transition-colors">
              Not you?
            </Link>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-[16px] w-[16px]" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Verification Form */}
        <div className="flex flex-col gap-[24px]">
          {/* Code Input */}
          <div className="flex flex-col gap-[12px]">
            <Input
              type="text"
              placeholder="Enter login code"
              value={code}
              onChange={(e) => {
                // Only allow numbers and limit to 6 digits
                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                setCode(value)
                if (codeError) setCodeError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleVerifyCode()
                }
              }}
              className={`h-[50px] text-[18px] sm:text-[22px] px-[24px] rounded-[16px] tracking-[-0.02em] placeholder:text-[#120902]/80 placeholder:font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 transition-all autofill:bg-[rgba(255,175,105,0.08)] autofill:text-[#120902]/95 autofill:border-[#FFAF69] autofill:shadow-[0_0_0_1000px_rgba(255,175,105,0.08)_inset] ${
                codeError
                  ? "bg-[#DF3E0D]/8 border-[2px] border-[#DF3E0D] text-[#120902]/60"
                  : code
                    ? "bg-[rgba(255,175,105,0.08)] border-[2px] border-[#FFAF69] text-[#120902]/95 font-semibold"
                    : "bg-[#120902]/5 border-[2px] border-transparent hover:border-[#120902]/30 focus:border-[#FFAF69] text-[#120902]/95"
              }`}
              maxLength={6}
            />
            {codeError && (
              <p className="text-[14px] text-[#A23F21]">{codeError}</p>
            )}
          </div>

          {/* Continue Button */}
          <Button
            ref={continueButtonRef}
            size="lg"
            className="w-full h-[54px] text-[16px] font-semibold tracking-[-0.02em] rounded-full relative z-10"
            onClick={handleVerifyCode}
            onMouseEnter={() => handleContinueButtonHover(true)}
            onMouseLeave={() => handleContinueButtonHover(false)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-[8px] h-[16px] w-[16px] animate-spin" />
                Verifying...
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
      </div>
    </div>
    </PageTransition>
  )
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <VerifyCodeForm />
    </Suspense>
  )
}
