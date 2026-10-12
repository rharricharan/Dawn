"use client"

import { useEffect, useRef, ReactNode, useState } from "react"
import { gsap } from "gsap"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  children: ReactNode
  isHeroPage?: boolean // Mark the register page as the hero page
}

// Track if user has already seen onboarding animation
let hasSeenOnboarding = false

export default function PageTransition({ children, isHeroPage = false }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const contentRef = useRef<HTMLDivElement>(null)
  const logoOverlayRef = useRef<HTMLDivElement>(null)
  const [isInitialMount, setIsInitialMount] = useState(!hasSeenOnboarding)

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    const logo = contentRef.current.querySelector('img')
    const logoContainer = contentRef.current.querySelector('img')?.parentElement
    const heading = contentRef.current.querySelector('h1')
    const subtext = contentRef.current.querySelector('h1 + p, h1 + div > p')
    const form = contentRef.current.querySelector('form, .flex.flex-col.gap-\\[24px\\]')
    const footer = contentRef.current.querySelector('p:last-child')

    if (isInitialMount && !hasSeenOnboarding && isHeroPage) {
      // HERO ANIMATION: Logo from center with dramatic entrance
      hasSeenOnboarding = true
      setIsInitialMount(false)

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
      })

      // Set initial states
      gsap.set(containerRef.current, { opacity: 1 })
      gsap.set([heading, subtext, form, footer], {
        opacity: 0,
        y: 30,
      })

      // Position logo in center of screen initially
      if (logo && logoContainer) {
        const viewportHeight = window.innerHeight
        const logoHeight = 64 // approximate logo height
        const centerY = (viewportHeight / 2) - (logoHeight / 2)
        const logoContainerRect = logoContainer.getBoundingClientRect()
        const offsetY = centerY - logoContainerRect.top

        gsap.set(logo, {
          scale: 1.5,
          opacity: 0,
        })

        gsap.set(logoContainer, {
          y: offsetY,
        })

        // Animate logo from center to top
        tl.to(logo, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        })
        .to(logoContainer, {
          y: 0,
          duration: 0.9,
          ease: "power3.inOut",
        }, "-=0.6")
        .to(heading, {
          opacity: 1,
          y: 0,
          duration: 0.6,
        }, "-=0.2")
        .to(subtext, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        }, "-=0.4")
        .to(form, {
          opacity: 1,
          y: 0,
          duration: 0.6,
        }, "-=0.3")
        .to(footer, {
          opacity: 1,
          y: 0,
          duration: 0.4,
        }, "-=0.4")
      }

    } else if (isInitialMount && !hasSeenOnboarding) {
      // NON-HERO FIRST VISIT: Regular staggered animation
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
