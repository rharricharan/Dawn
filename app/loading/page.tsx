"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

type AnimationType = "breathing" | "wave" | "elastic" | "orbit"

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

      case "wave":
        // Wave effect - undulating motion with rotation and scale
        tl.to(logoRef.current, {
          y: -8,
          rotation: 3,
          scale: 1.05,
          opacity: 0.9,
          duration: 0.8,
          ease: "sine.inOut",
        })
          .to(logoRef.current, {
            y: 8,
            rotation: -3,
            scale: 0.98,
            opacity: 0.75,
            duration: 1.6,
            ease: "sine.inOut",
          })
          .to(logoRef.current, {
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 0.7,
            duration: 0.8,
            ease: "sine.inOut",
          })
        break

      case "elastic":
        // Elastic overshoot with 3D perspective
        tl.to(logoRef.current, {
          scale: 1.3,
          rotation: 8,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(2)",
        })
          .to(logoRef.current, {
            scale: 0.95,
            rotation: -2,
            opacity: 0.8,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
          })
          .to(logoRef.current, {
            scale: 1,
            rotation: 0,
            opacity: 0.7,
            duration: 0.4,
            ease: "power2.inOut",
          })
          .to({}, { duration: 0.3 })
        break

      case "orbit":
        // Circular orbit path with rotation
        const radius = 15
        tl.to(logoRef.current, {
          motionPath: {
            path: [
              { x: 0, y: 0 },
              { x: radius, y: -radius },
              { x: radius * 2, y: 0 },
              { x: radius, y: radius },
              { x: 0, y: 0 },
            ],
            curviness: 1.5,
          },
          rotation: 360,
          scale: 1.08,
          opacity: 0.95,
          duration: 3,
          ease: "power1.inOut",
        })
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
    { type: "wave", label: "Wave" },
    { type: "elastic", label: "Elastic" },
    { type: "orbit", label: "Orbit" },
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
