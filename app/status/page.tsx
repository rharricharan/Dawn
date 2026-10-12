"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">System Status</h1>
            <p className="text-muted-foreground mt-2">
              Monitor service health and recent errors
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStatus}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Last Updated */}
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>

        {/* Overall Status */}
        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>Current operational status of all services</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="font-semibold">{service.name}</p>
                        {service.description && (
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Errors */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
            <CardDescription>
              Errors tracked by our monitoring system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : errors.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-semibold">No Errors Detected</p>
                <p className="text-sm text-muted-foreground">
                  All systems operating normally
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {errors.map((error) => (
                  <div
                    key={error.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{error.title}</p>
                          <Badge variant={error.status === "resolved" ? "secondary" : "destructive"}>
                            {error.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Occurred {error.count} time{error.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>First seen: {new Date(error.firstSeen).toLocaleString()}</span>
                      <span>Last seen: {new Date(error.lastSeen).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Errors (24h)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {errors.reduce((sum, e) => sum + e.count, 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Unresolved Issues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {errors.filter(e => e.status === "unresolved").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Resolved (24h)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {errors.filter(e => e.status === "resolved").length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
