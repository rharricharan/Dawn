"use client"

import { useEffect, useRef, ReactNode } from "react"
import { gsap } from "gsap"
import { usePathname, useRouter } from "next/navigation"

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    // Create timeline for complex sequenced animations
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    })

    // Get all child elements for staggered animation
    const logo = contentRef.current.querySelector('img')
    const heading = contentRef.current.querySelector('h1')
    const subtext = contentRef.current.querySelector('h1 + p, h1 + div > p')
    const form = contentRef.current.querySelector('form, .flex.flex-col.gap-\\[24px\\]')
    const footer = contentRef.current.querySelector('p:last-child')

    // Set initial states
    gsap.set(containerRef.current, { opacity: 0 })
    gsap.set([logo, heading, subtext, form, footer], {
      opacity: 0,
      y: 30,
    })

    // Animate in sequence
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

  }, [pathname])

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
