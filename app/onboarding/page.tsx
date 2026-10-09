"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight, Loader2 } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        })
      }
    })

    return () => ctx.revert()
  }, [step])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      jobTitle: formData.get("jobTitle") as string,
      companyName: formData.get("companyName") as string,
      website: formData.get("website") as string,
    }

    try {
      // TODO: Save to Supabase profiles table
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      router.push("/dashboard")
    } catch (error) {
      console.error("Onboarding error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div ref={containerRef} className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of 1</span>
            <span className="text-sm text-muted-foreground">Almost there!</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 1) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Tell us about yourself</h1>
            <p className="text-muted-foreground">
              Help us personalize your experience and find the right prospects for you
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-lg p-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">What&apos;s your role?</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="e.g., Product Designer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company name (optional)</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="e.g., Your Design Studio"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website or portfolio (optional)</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Footer note */}
          <p className="text-center text-sm text-muted-foreground">
            You can always update this information in your settings
          </p>
        </div>
      </div>
    </div>
  )
}
