"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

type AnimationType = "breathing" | "spin" | "bounce" | "pulse"

export default function LoadingPage() {
  const logoRef = useRef<HTMLImageElement>(null)
  const percentRef = useRef<HTMLSpanElement>(null)
  const [percentage, setPercentage] = useState(0)
  const [animationType, setAnimationType] = useState<AnimationType>("breathing")
  const animationRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!logoRef.current || !percentRef.current) return

    // Kill existing animation
    if (animationRef.current) {
      animationRef.current.kill()
    }

    // Reset logo properties
    gsap.set(logoRef.current, {
      scale: 1,
      opacity: 0.7,
      rotation: 0,
      y: 0,
    })

    const tl = gsap.timeline({ repeat: -1 })

    switch (animationType) {
      case "breathing":
        // Breathing effect - scale and opacity
        tl.to(logoRef.current, {
          scale: 1.1,
          opacity: 1,
          duration: 1.2,
          ease: "power2.inOut",
        }).to(logoRef.current, {
          scale: 1,
          opacity: 0.7,
          duration: 1.2,
          ease: "power2.inOut",
        })
        break

      case "spin":
        // Spinning rotation
        tl.to(logoRef.current, {
          rotation: 360,
          duration: 2,
          ease: "linear",
        })
        break

      case "bounce":
        // Bouncing up and down
        tl.to(logoRef.current, {
          y: -20,
          duration: 0.6,
          ease: "power2.out",
        })
          .to(logoRef.current, {
            y: 0,
            duration: 0.6,
            ease: "bounce.out",
          })
          .to({}, { duration: 0.4 }) // Pause between bounces
        break

      case "pulse":
        // Quick pulse effect
        tl.to(logoRef.current, {
          scale: 1.15,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })
          .to(logoRef.current, {
            scale: 1,
            opacity: 0.7,
            duration: 0.3,
            ease: "power2.in",
          })
          .to({}, { duration: 0.6 }) // Pause
        break
    }

    animationRef.current = tl

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

    return () => {
      tl.kill()
      percentTl.kill()
    }
  }, [animationType])

  const animations: { type: AnimationType; label: string }[] = [
    { type: "breathing", label: "Breathing" },
    { type: "spin", label: "Spin" },
    { type: "bounce", label: "Bounce" },
    { type: "pulse", label: "Pulse" },
  ]

  return (
    <div className="min-h-screen bg-[#fcf7f4] flex flex-col items-center justify-center">
      {/* Animation Selector */}
      <div className="absolute top-[32px] left-1/2 -translate-x-1/2 flex gap-[12px] flex-wrap justify-center">
        {animations.map((anim) => (
          <button
            key={anim.type}
            onClick={() => setAnimationType(anim.type)}
            className={`px-[20px] py-[10px] rounded-full text-[14px] font-semibold tracking-[-0.02em] transition-all cursor-pointer ${
              animationType === anim.type
                ? "bg-[#FFAF69] text-white"
                : "bg-white/60 text-[#120902]/70 hover:bg-white hover:text-[#120902]"
            }`}
          >
            {anim.label}
          </button>
        ))}
      </div>

      {/* Logo and Percentage */}
      <div className="flex flex-col items-center">
        <img
          ref={logoRef}
          src="/dawn-logo.svg"
          alt="Dawn"
          className="h-[56px] w-auto opacity-70"
          style={{ transformOrigin: "center" }}
        />
        <p
          ref={percentRef}
          className="text-[16px] font-semibold text-[#120902]/70 tracking-[-0.02em] mt-[16px]"
        >
          {percentage}%
        </p>
      </div>

      {/* Current Animation Label */}
      <div className="absolute bottom-[32px] left-1/2 -translate-x-1/2">
        <p className="text-[13px] text-[#120902]/50 font-medium">
          Currently: <span className="text-[#FFAF69]">{animationType}</span>
        </p>
      </div>
    </div>
  )
}
