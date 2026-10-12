"use client"

import { useEffect, useRef, ReactNode } from "react"
import { gsap } from "gsap"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!containerRef.current) return

    // Animate in on mount or route change
    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    )
  }, [pathname])

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}
