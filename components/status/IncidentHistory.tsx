"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Clock, Bot, User, TrendingUp } from "lucide-react"
import { type IncidentHistory as Incident } from "@/lib/ai/incident-handler"

interface IncidentHistoryProps {
  incidents: Incident[]
}

export function IncidentHistoryLog({ incidents }: IncidentHistoryProps) {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 30) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getResolutionTime = (detectedAt: string, resolvedAt?: string) => {
    if (!resolvedAt) return null

    const detected = new Date(detectedAt)
    const resolved = new Date(resolvedAt)
    const diffMs = resolved.getTime() - detected.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m`
    return `${Math.floor(diffHours / 24)}d ${diffHours % 24}h`
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-[rgba(255,175,105,0.1)] text-[#FFAF69]"
      case "in_progress":
        return "bg-[#FFAF69]/20 text-[#FFAF69]"
      case "open":
        return "bg-[#DF3E0D]/10 text-[#DF3E0D]"
      default:
        return "bg-[#120902]/10 text-[#120902]"
    }
  }

  return (
    <div className="space-y-[12px]">
      {incidents.map((incident, index) => (
        <div
          key={incident.id}
          className={`p-[20px] rounded-[16px] border-2 transition-all hover:border-[#FFAF69]/30 ${
            incident.status === "resolved"
              ? "bg-white/80 border-[#120902]/10"
              : "bg-gradient-to-br from-[#DF3E0D]/5 to-transparent border-[#DF3E0D]/20"
          }`}
        >
          <div className="flex items-start gap-[16px]">
            {/* Status Icon */}
            <div className="mt-[2px]">
              {incident.status === "resolved" ? (
                <CheckCircle2 className="h-[20px] w-[20px] text-[#FFAF69]" />
              ) : incident.status === "in_progress" ? (
                <Clock className="h-[20px] w-[20px] text-[#FFAF69]" />
              ) : (
                <AlertCircle className="h-[20px] w-[20px] text-[#DF3E0D]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-[16px] mb-[8px]">
                <div className="flex-1">
                  <div className="flex items-center gap-[12px] flex-wrap mb-[8px]">
                    <h4 className="font-semibold text-[16px] text-[#120902]">
                      {incident.title}
                    </h4>
                    <Badge className={`text-[11px] ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </Badge>
                    <Badge className={`text-[11px] ${getStatusColor(incident.status)}`}>
                      {incident.status.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="text-[11px]">
                      {incident.category}
                    </Badge>
                  </div>

                  {/* Resolution Info */}
                  {incident.resolution && (
                    <div className="mb-[12px]">
                      <div className="flex items-center gap-[8px] mb-[6px]">
                        {incident.resolvedBy === "ai" ? (
                          <>
                            <Bot className="h-[14px] w-[14px] text-[#FFAF69]" />
                            <span className="text-[13px] font-semibold text-[#FFAF69]">
                              AI Auto-Resolved
                            </span>
                            <span className="text-[11px] text-[#120902]/50">
                              {incident.resolution.aiConfidence}% confidence
                            </span>
                          </>
                        ) : (
                          <>
                            <User className="h-[14px] w-[14px] text-[#120902]/60" />
                            <span className="text-[13px] font-medium text-[#120902]/70">
                              Manually Resolved
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-[13px] text-[#120902]/70 leading-[1.6] mb-[8px]">
                        {incident.resolution.solution}
                      </p>
                      {incident.resolution.steps.length > 0 && (
                        <div className="text-[12px] text-[#120902]/60">
                          <div className="font-medium mb-[4px]">Resolution steps:</div>
                          <ol className="list-decimal list-inside space-y-[2px] ml-[4px]">
                            {incident.resolution.steps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="flex items-center gap-[16px] flex-wrap text-[12px] text-[#120902]/50">
                    <div className="flex items-center gap-[6px]">
                      <Clock className="h-[12px] w-[12px]" />
                      <span>Detected {getTimeAgo(incident.detectedAt)}</span>
                    </div>
                    {incident.resolvedAt && (
                      <div className="flex items-center gap-[6px]">
                        <CheckCircle2 className="h-[12px] w-[12px]" />
                        <span>
                          Resolved in {getResolutionTime(incident.detectedAt, incident.resolvedAt)}
                        </span>
                      </div>
                    )}
                    {incident.affectedUsers > 0 && (
                      <div className="flex items-center gap-[6px]">
                        <TrendingUp className="h-[12px] w-[12px]" />
                        <span>~{incident.affectedUsers} users affected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
