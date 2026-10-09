"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn, signInWithGoogle } from "@/lib/auth/actions"
import { Mail, Key, Sparkles, Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Icon entrance
      if (iconRef.current) {
        tl.from(iconRef.current, {
          scale: 0,
          rotation: -180,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
      }

      // Heading fade in
      if (headingRef.current) {
        tl.from(
          headingRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
      }

      // Buttons stagger in
      if (buttonsRef.current) {
        tl.from(
          buttonsRef.current.children,
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
          },
          "-=0.3"
        )
      }

      // Footer fade in
      if (footerRef.current) {
        tl.from(
          footerRef.current,
          {
            y: 10,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.2"
        )
      }
    })

    return () => ctx.revert()
  }, [])

  const handleEmailSignIn = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    const result = await signIn(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    const result = await signInWithGoogle()

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div
        ref={containerRef}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo/Icon */}
        <div ref={iconRef} className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* Heading */}
        <div ref={headingRef} className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Dawn</h1>
          <p className="text-muted-foreground">
            Sign in to find your next design client
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Auth Options */}
        <div ref={buttonsRef} className="space-y-3">
          {!showEmailForm ? (
            <>
              {/* Continue with Gmail */}
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base"
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

              <Separator className="my-4" />

              {/* Continue with Email */}
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base"
                onClick={() => setShowEmailForm(true)}
                disabled={isLoading}
              >
                <Mail className="mr-2 h-5 w-5" />
                Continue with Email
              </Button>

              {/* Continue with Passkey */}
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base"
                disabled
              >
                <Key className="mr-2 h-5 w-5" />
                Continue with Passkey
              </Button>
            </>
          ) : (
            <form action={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowEmailForm(false)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div ref={footerRef} className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              asChild
            >
              <Link href="/register">Register</Link>
            </Button>
          </p>

          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
