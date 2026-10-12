"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, Clock, RefreshCw, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { gsap } from "gsap"

interface ServiceStatus {
  name: string
  status: "operational" | "degraded" | "down"
  description?: string
}

interface ErrorLog {
  id: string
  title: string
  count: number
  firstSeen: string
  lastSeen: string
  status: "unresolved" | "resolved"
  level: string
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchStatus = async () => {
    setLoading(true)
    try {
      // Fetch Supabase status
      const supabaseStatus = await fetch('https://status.supabase.com/api/v2/status.json')
      const supabaseData = await supabaseStatus.json()

      // Fetch Sentry errors (we'll create this API route)
      const sentryErrors = await fetch('/api/sentry/issues')
      const sentryData = await sentryErrors.json()

      setServices([
        {
          name: "Authentication",
          status: supabaseData.status.indicator === "none" ? "operational" : "degraded",
          description: supabaseData.status.description
        },
        {
          name: "Database",
          status: supabaseData.status.indicator === "none" ? "operational" : "degraded"
        },
        {
          name: "Application",
          status: sentryData.errorCount > 0 ? "degraded" : "operational"
        }
      ])

      setErrors(sentryData.issues || [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    // Animate page entrance
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }
    )
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600 bg-green-50"
      case "degraded":
        return "text-yellow-600 bg-yellow-50"
      case "down":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "degraded":
      case "down":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-[#fcf7f4] px-[16px] py-[32px] sm:px-[24px] md:px-[32px]">
      <div ref={containerRef} className="max-w-[1200px] mx-auto space-y-[32px]">
        {/* Header with Logo */}
        <div className="flex flex-col gap-[24px]">
          <Link href="/register" className="inline-flex items-center text-[14px] text-[#120902]/70 hover:text-[#120902] transition-colors font-semibold">
            <ArrowLeft className="mr-[8px] h-[16px] w-[16px]" />
            Back to app
          </Link>

          <div className="flex justify-center">
            <img
              src="/dawn-logo.svg"
              alt="Dawn"
              className="h-[56px] w-auto sm:h-[64px]"
            />
          </div>

          <div className="text-center">
            <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.03em] leading-[1.2] text-[#120902]">
              System Status
            </h1>
            <p className="text-[#120902]/70 mt-[12px] text-[14px] font-medium">
              Monitor service health and system performance
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[12px] text-[#120902]/60">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStatus}
              disabled={loading}
              className="rounded-full border-[#120902]/15 bg-transparent hover:bg-[#120902]/5 hover:border-[#120902]/30 transition-all"
            >
              <RefreshCw className={`h-[14px] w-[14px] mr-[8px] ${loading ? 'animate-spin' : ''}`} />
              <span className="text-[14px] font-semibold">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Service Status */}
        <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] sm:p-[32px] border border-[#120902]/10">
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#120902] mb-[8px]">
            Service Status
          </h2>
          <p className="text-[14px] text-[#120902]/60 mb-[24px]">
            Current operational status of all services
          </p>

          {loading ? (
            <div className="space-y-[16px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[72px] bg-[#120902]/5 rounded-[16px] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-[12px]">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-[20px] bg-white rounded-[16px] border border-[#120902]/10 hover:border-[#FFAF69]/50 transition-all"
                >
                  <div className="flex items-center gap-[16px]">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="font-semibold text-[16px] text-[#120902] tracking-[-0.01em]">
                        {service.name}
                      </p>
                      {service.description && (
                        <p className="text-[14px] text-[#120902]/60 mt-[4px]">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`px-[16px] py-[6px] rounded-full text-[12px] font-semibold ${getStatusColor(service.status)}`}>
                    {service.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Errors */}
        <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] sm:p-[32px] border border-[#120902]/10">
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#120902] mb-[8px]">
            Recent Issues
          </h2>
          <p className="text-[14px] text-[#120902]/60 mb-[24px]">
            Errors tracked by our monitoring system
          </p>

          {loading ? (
            <div className="space-y-[16px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[96px] bg-[#120902]/5 rounded-[16px] animate-pulse" />
              ))}
            </div>
          ) : errors.length === 0 ? (
            <div className="text-center py-[48px]">
              <div className="inline-flex p-[16px] bg-[rgba(255,175,105,0.1)] rounded-full mb-[16px]">
                <CheckCircle2 className="h-[32px] w-[32px] text-[#FFAF69]" />
              </div>
              <p className="text-[18px] font-semibold text-[#120902] mb-[8px]">No Errors Detected</p>
              <p className="text-[14px] text-[#120902]/60">
                All systems operating normally
              </p>
            </div>
          ) : (
            <div className="space-y-[12px]">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className="p-[20px] bg-white rounded-[16px] border border-[#120902]/10 space-y-[12px] hover:border-[#FFAF69]/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-[16px]">
                    <div className="flex-1">
                      <div className="flex items-center gap-[12px] flex-wrap">
                        <p className="font-semibold text-[16px] text-[#120902] tracking-[-0.01em]">
                          {error.title}
                        </p>
                        <div className={`px-[12px] py-[4px] rounded-full text-[11px] font-semibold ${
                          error.status === "resolved"
                            ? "bg-[rgba(255,175,105,0.1)] text-[#FFAF69]"
                            : "bg-[#DF3E0D]/10 text-[#DF3E0D]"
                        }`}>
                          {error.status}
                        </div>
                      </div>
                      <p className="text-[14px] text-[#120902]/60 mt-[4px]">
                        Occurred {error.count} time{error.count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-[16px] text-[12px] text-[#120902]/50">
                    <span>First: {new Date(error.firstSeen).toLocaleString()}</span>
                    <span>Last: {new Date(error.lastSeen).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] border border-[#120902]/10">
            <p className="text-[14px] text-[#120902]/60 mb-[8px] font-medium">Total Errors (24h)</p>
            <p className="text-[40px] font-semibold text-[#120902] tracking-[-0.03em]">
              {errors.reduce((sum, e) => sum + e.count, 0)}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] border border-[#120902]/10">
            <p className="text-[14px] text-[#120902]/60 mb-[8px] font-medium">Unresolved Issues</p>
            <p className="text-[40px] font-semibold text-[#DF3E0D] tracking-[-0.03em]">
              {errors.filter(e => e.status === "unresolved").length}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] border border-[#120902]/10">
            <p className="text-[14px] text-[#120902]/60 mb-[8px] font-medium">Resolved (24h)</p>
            <p className="text-[40px] font-semibold text-[#FFAF69] tracking-[-0.03em]">
              {errors.filter(e => e.status === "resolved").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
