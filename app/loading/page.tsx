"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export default function LoadingPage() {
  const logoRef = useRef<HTMLImageElement>(null)
  const percentRef = useRef<HTMLSpanElement>(null)
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    if (!logoRef.current || !percentRef.current) return

    const tl = gsap.timeline({ repeat: -1 })

    // Logo animation - breathing effect with scale and opacity
    tl.to(logoRef.current, {
      scale: 1.1,
      opacity: 1,
      duration: 1.2,
      ease: "power2.inOut",
    })
      .to(logoRef.current, {
        scale: 1,
        opacity: 0.7,
        duration: 1.2,
        ease: "power2.inOut",
      })

    // Percentage counter animation
    const percentTl = gsap.timeline()
    percentTl.to(
      {},
      {
        duration: 3,
        onUpdate: function () {
          const progress = Math.floor(this.progress() * 100)
          setPercentage(progress)
        },
        ease: "power2.out",
      }
    )

    // Animate percentage text
    gsap.to(percentRef.current, {
      opacity: 0.6,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    })

    return () => {
      tl.kill()
      percentTl.kill()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#fcf7f4] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <img
          ref={logoRef}
          src="/dawn-logo.svg"
          alt="Dawn"
          className="h-[40px] w-auto opacity-70"
          style={{ transformOrigin: "center" }}
        />
        <p
          ref={percentRef}
          className="text-[16px] font-semibold text-[#120902] tracking-[-0.02em] mt-[16px]"
        >
          {percentage}%
        </p>
      </div>
    </div>
  )
}
