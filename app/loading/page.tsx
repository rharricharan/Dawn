"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function LoadingPage() {
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!logoRef.current) return

    // Create a pulsing animation
    gsap.to(logoRef.current, {
      opacity: 0.5,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#fcf7f4] flex items-center justify-center">
      <img
        ref={logoRef}
        src="/dawn-logo.svg"
        alt="Dawn"
        className="h-[80px] w-auto"
      />
    </div>
  )
}
