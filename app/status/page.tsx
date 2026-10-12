"use client"

import { useEffect, useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, RefreshCw, ArrowLeft, Shield, Activity, Clock, TrendingUp, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts"
import Link from "next/link"
import { gsap } from "gsap"

interface ServiceStatus {
  name: string
  status: "operational" | "degraded" | "down"
  description?: string
  uptime?: number
  responseTime?: number
}

interface ErrorLog {
  id: string
  title: string
  count: number
  firstSeen: string
  lastSeen: string
  status: "unresolved" | "resolved"
  level: string
  category?: string
}

interface VulnerabilityItem {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  status: "open" | "fixed"
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  // Mock data for error trends (replace with real data from API)
  const errorTrendData = [
    { time: "00:00", errors: 2 },
    { time: "04:00", errors: 1 },
    { time: "08:00", errors: 4 },
    { time: "12:00", errors: 3 },
    { time: "16:00", errors: 1 },
    { time: "20:00", errors: 0 },
  ]

  const errorCategoryData = [
    { category: "Authentication", count: 5, fill: "#FFAF69" },
    { category: "Database", count: 2, fill: "#DF3E0D" },
    { category: "API", count: 3, fill: "#120902" },
  ]

  const chartConfig = {
    errors: {
      label: "Errors",
      color: "#FFAF69",
    },
  } satisfies ChartConfig

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const supabaseStatus = await fetch('https://status.supabase.com/api/v2/status.json')
      const supabaseData = await supabaseStatus.json()

      const sentryErrors = await fetch('/api/sentry/issues')
      const sentryData = await sentryErrors.json()

      // Calculate uptime (mock for now)
      const baseUptime = 99.9

      setServices([
        {
          name: "Authentication",
          status: supabaseData.status.indicator === "none" ? "operational" : "degraded",
          description: supabaseData.status.description,
          uptime: baseUptime,
          responseTime: 125
        },
        {
          name: "Database",
          status: supabaseData.status.indicator === "none" ? "operational" : "degraded",
          uptime: 99.95,
          responseTime: 89
        },
        {
          name: "Application",
          status: sentryData.errorCount > 0 ? "degraded" : "operational",
          uptime: 99.8,
          responseTime: 234
        }
      ])

      // Categorize errors
      const categorizedErrors = (sentryData.issues || []).map((error: any) => ({
        ...error,
        category: error.title?.includes("auth") || error.title?.includes("login") ? "Authentication" :
                  error.title?.includes("database") || error.title?.includes("query") ? "Database" : "API"
      }))

      setErrors(categorizedErrors)

      // Mock vulnerabilities (replace with real scanning)
      setVulnerabilities([
        {
          id: "1",
          severity: "medium",
          title: "Rate Limiting Not Enabled",
          description: "Login endpoint should have rate limiting to prevent brute force attacks",
          status: "open"
        },
        {
          id: "2",
          severity: "low",
          title: "Missing Security Headers",
          description: "Some security headers are not configured",
          status: "open"
        }
      ])

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    )
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-[rgba(255,175,105,0.1)] text-[#FFAF69]"
      case "degraded":
        return "bg-[#DF3E0D]/10 text-[#DF3E0D]"
      case "down":
        return "bg-[#DF3E0D]/20 text-[#DF3E0D]"
      default:
        return "bg-[#120902]/10 text-[#120902]"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-[20px] w-[20px] text-[#FFAF69]" />
      case "degraded":
      case "down":
        return <AlertCircle className="h-[20px] w-[20px] text-[#DF3E0D]" />
      default:
        return <Clock className="h-[20px] w-[20px] text-[#120902]/60" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-[#DF3E0D] text-white"
      case "high":
        return "bg-[#DF3E0D]/80 text-white"
      case "medium":
        return "bg-[#FFAF69] text-white"
      case "low":
        return "bg-[#120902]/20 text-[#120902]"
      default:
        return "bg-[#120902]/10 text-[#120902]"
    }
  }

  const overallHealth = Math.round(
    services.reduce((sum, s) => sum + (s.uptime || 0), 0) / services.length
  )

  return (
    <div className="min-h-screen bg-[#fcf7f4] px-[16px] py-[32px] sm:px-[24px] md:px-[32px]">
      <div ref={containerRef} className="max-w-[1200px] mx-auto space-y-[32px]">
        {/* Header */}
        <div className="flex flex-col gap-[24px]">
          <Link href="/register" className="inline-flex items-center text-[14px] text-[#120902]/70 hover:text-[#120902] transition-colors font-semibold">
            <ArrowLeft className="mr-[8px] h-[16px] w-[16px]" />
            Back to app
          </Link>

          <div className="flex justify-center">
            <img src="/dawn-logo.svg" alt="Dawn" className="h-[56px] w-auto sm:h-[64px]" />
          </div>

          <div className="text-center">
            <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.03em] leading-[1.2] text-[#120902]">
              System Status
            </h1>
            <p className="text-[#120902]/70 mt-[12px] text-[14px] font-medium">
              Real-time monitoring, performance metrics, and security insights
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

        {/* Overall Health Score */}
        <div className="bg-gradient-to-br from-[#FFAF69]/20 to-[#EED0FF]/20 rounded-[24px] p-[32px] border border-[#FFAF69]/30">
          <div className="flex items-center justify-between flex-wrap gap-[24px]">
            <div>
              <p className="text-[14px] text-[#120902]/70 mb-[8px] font-medium">Overall System Health</p>
              <p className="text-[56px] font-semibold text-[#120902] tracking-[-0.04em]">{overallHealth}%</p>
            </div>
            <div className="flex items-center gap-[12px]">
              <Activity className="h-[48px] w-[48px] text-[#FFAF69]" />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
          <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] border border-[#120902]/10">
            <p className="text-[14px] text-[#120902]/60 mb-[8px] font-medium">Total Errors (24h)</p>
            <p className="text-[32px] font-semibold text-[#120902] tracking-[-0.03em]">
              {errors.reduce((sum, e) => sum + e.count, 0)}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] border border-[#120902]/10">
            <p className="text-[14px] text-[#120902]/60 mb-[8px] font-medium">Unresolved</p>
            <p className="text-[32px] font-semibold text-[#DF3E0D] tracking-[-0.03em]">
              {errors.filter(e => e.status === "unresolved").length}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] border border-[#120902]/10">
            <p className="text-[14px] text-[#120902]/60 mb-[8px] font-medium">Avg Response</p>
            <p className="text-[32px] font-semibold text-[#FFAF69] tracking-[-0.03em]">
              {Math.round(services.reduce((sum, s) => sum + (s.responseTime || 0), 0) / services.length)}ms
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] border border-[#120902]/10">
            <p className="text-[14px] text-[#120902]/60 mb-[8px] font-medium">Vulnerabilities</p>
            <p className="text-[32px] font-semibold text-[#120902] tracking-[-0.03em]">
              {vulnerabilities.filter(v => v.status === "open").length}
            </p>
          </div>
        </div>

        {/* Error Trend Chart */}
        <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] sm:p-[32px] border border-[#120902]/10">
          <div className="flex items-center gap-[12px] mb-[24px]">
            <TrendingUp className="h-[24px] w-[24px] text-[#FFAF69]" />
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#120902]">
              Error Rate Trend (24h)
            </h2>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={errorTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#120902" opacity={0.1} />
              <XAxis dataKey="time" stroke="#120902" opacity={0.6} fontSize={12} />
              <YAxis stroke="#120902" opacity={0.6} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="errors"
                stroke="#FFAF69"
                strokeWidth={3}
                dot={{ fill: "#FFAF69", r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Error Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
          <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] sm:p-[32px] border border-[#120902]/10">
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#120902] mb-[24px]">
              Error Categories
            </h2>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={errorCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#120902" opacity={0.1} />
                <XAxis dataKey="category" stroke="#120902" opacity={0.6} fontSize={12} />
                <YAxis stroke="#120902" opacity={0.6} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {errorCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>

          {/* Service Status */}
          <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] sm:p-[32px] border border-[#120902]/10">
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#120902] mb-[8px]">
              Service Status
            </h2>
            <p className="text-[14px] text-[#120902]/60 mb-[24px]">
              Current operational status
            </p>
            <div className="space-y-[12px]">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-[16px] bg-white rounded-[16px] border border-[#120902]/10"
                >
                  <div className="flex items-center gap-[12px]">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="font-semibold text-[14px] text-[#120902]">{service.name}</p>
                      <p className="text-[12px] text-[#120902]/60">
                        {service.uptime}% uptime · {service.responseTime}ms
                      </p>
                    </div>
                  </div>
                  <div className={`px-[12px] py-[4px] rounded-full text-[11px] font-semibold ${getStatusColor(service.status)}`}>
                    {service.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Vulnerabilities */}
        <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] sm:p-[32px] border border-[#120902]/10">
          <div className="flex items-center gap-[12px] mb-[24px]">
            <Shield className="h-[24px] w-[24px] text-[#FFAF69]" />
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#120902]">
              Security & Vulnerabilities
            </h2>
          </div>
          {vulnerabilities.length === 0 ? (
            <div className="text-center py-[32px]">
              <Shield className="h-[48px] w-[48px] text-[#FFAF69] mx-auto mb-[16px]" />
              <p className="text-[16px] font-semibold text-[#120902]">No Vulnerabilities Detected</p>
              <p className="text-[14px] text-[#120902]/60 mt-[8px]">All security checks passed</p>
            </div>
          ) : (
            <div className="space-y-[12px]">
              {vulnerabilities.map((vuln) => (
                <div
                  key={vuln.id}
                  className="p-[20px] bg-white rounded-[16px] border border-[#120902]/10"
                >
                  <div className="flex items-start justify-between gap-[16px] mb-[8px]">
                    <div className="flex items-center gap-[12px] flex-wrap">
                      <AlertTriangle className="h-[20px] w-[20px] text-[#DF3E0D]" />
                      <p className="font-semibold text-[16px] text-[#120902]">{vuln.title}</p>
                      <div className={`px-[12px] py-[4px] rounded-full text-[11px] font-semibold ${getSeverityColor(vuln.severity)}`}>
                        {vuln.severity}
                      </div>
                    </div>
                  </div>
                  <p className="text-[14px] text-[#120902]/70 ml-[32px]">{vuln.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Issues */}
        <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-[24px] sm:p-[32px] border border-[#120902]/10">
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#120902] mb-[8px]">
            Recent Issues
          </h2>
          <p className="text-[14px] text-[#120902]/60 mb-[24px]">
            Errors tracked in the last 24 hours
          </p>
          {errors.length === 0 ? (
            <div className="text-center py-[48px]">
              <div className="inline-flex p-[16px] bg-[rgba(255,175,105,0.1)] rounded-full mb-[16px]">
                <CheckCircle2 className="h-[32px] w-[32px] text-[#FFAF69]" />
              </div>
              <p className="text-[18px] font-semibold text-[#120902] mb-[8px]">No Errors Detected</p>
              <p className="text-[14px] text-[#120902]/60">All systems operating normally</p>
            </div>
          ) : (
            <div className="space-y-[12px]">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className="p-[20px] bg-white rounded-[16px] border border-[#120902]/10"
                >
                  <div className="flex items-start justify-between gap-[16px]">
                    <div className="flex-1">
                      <div className="flex items-center gap-[12px] flex-wrap mb-[8px]">
                        <p className="font-semibold text-[16px] text-[#120902]">{error.title}</p>
                        <div className={`px-[12px] py-[4px] rounded-full text-[11px] font-semibold ${
                          error.status === "resolved" ? "bg-[rgba(255,175,105,0.1)] text-[#FFAF69]" : "bg-[#DF3E0D]/10 text-[#DF3E0D]"
                        }`}>
                          {error.status}
                        </div>
                        {error.category && (
                          <Badge variant="outline" className="text-[11px] border-[#120902]/20">
                            {error.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[14px] text-[#120902]/60 mb-[8px]">
                        Occurred {error.count} time{error.count !== 1 ? 's' : ''}
                      </p>
                      <div className="flex flex-wrap gap-[16px] text-[12px] text-[#120902]/50">
                        <span>First: {new Date(error.firstSeen).toLocaleString()}</span>
                        <span>Last: {new Date(error.lastSeen).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
