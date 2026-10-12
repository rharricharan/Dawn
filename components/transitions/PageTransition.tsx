"use client"

import { useEffect, useRef, ReactNode, useState } from "react"
import { gsap } from "gsap"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  children: ReactNode
}

// Track if user has already seen onboarding animation
let hasSeenOnboarding = false

export default function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const contentRef = useRef<HTMLDivElement>(null)
  const [isInitialMount, setIsInitialMount] = useState(!hasSeenOnboarding)

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    const logo = contentRef.current.querySelector('img')
    const heading = contentRef.current.querySelector('h1')
    const subtext = contentRef.current.querySelector('h1 + p, h1 + div > p')
    const form = contentRef.current.querySelector('form, .flex.flex-col.gap-\\[24px\\]')
    const footer = contentRef.current.querySelector('p:last-child')

    if (isInitialMount && !hasSeenOnboarding) {
      // FIRST VISIT: Full staggered animation
      hasSeenOnboarding = true
      setIsInitialMount(false)

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
      })

      gsap.set(containerRef.current, { opacity: 0 })
      gsap.set([logo, heading, subtext, form, footer], {
        opacity: 0,
        y: 30,
      })

      tl.to(containerRef.current, {
        opacity: 1,
        duration: 0.3,
      })
      .to(logo, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.2)",
      }, "-=0.1")
      .to(heading, {
        opacity: 1,
        y: 0,
        duration: 0.5,
      }, "-=0.3")
      .to(subtext, {
        opacity: 1,
        y: 0,
        duration: 0.5,
      }, "-=0.3")
      .to(form, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, "-=0.2")
      .to(footer, {
        opacity: 1,
        y: 0,
        duration: 0.4,
      }, "-=0.3")

    } else {
      // SUBSEQUENT NAVIGATIONS: Fast, seamless crossfade
      // Keep logo in place, only animate content
      gsap.set(logo, { opacity: 1, y: 0 })
      gsap.set([heading, subtext, form, footer], {
        opacity: 0,
        x: 20,
      })
      gsap.set(containerRef.current, { opacity: 1 })

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" }
      })

      tl.to([heading, subtext], {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.05,
      })
      .to([form, footer], {
        opacity: 1,
        x: 0,
        duration: 0.25,
        stagger: 0.03,
      }, "-=0.15")
    }

  }, [pathname, isInitialMount])

  return (
    <div ref={containerRef} style={{ opacity: isInitialMount ? 0 : 1 }}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
