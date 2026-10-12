import { NextResponse } from "next/server"
import { type IncidentHistory, generateMonthlyTimeline } from "@/lib/ai/incident-handler"

// Mock incident history data (in production, this would come from a database)
function generateMockIncidents(): IncidentHistory[] {
  const incidents: IncidentHistory[] = []
  const categories = ["Database", "Authentication", "API", "Cache", "Email"]
  const titles = [
    "Connection timeout",
    "Rate limit exceeded",
    "Invalid token",
    "Query performance degradation",
    "Cache miss rate high",
    "Email delivery failed",
    "SSL certificate expiring",
    "Memory usage spike",
  ]

  // Generate incidents for the last 30 days
  const now = new Date()
  for (let i = 0; i < 45; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const detectedAt = new Date(now)
    detectedAt.setDate(detectedAt.getDate() - daysAgo)

    const severity = ["low", "low", "medium", "medium", "high", "critical"][
      Math.floor(Math.random() * 6)
    ] as "low" | "medium" | "high" | "critical"

    const isResolved = Math.random() > 0.3 // 70% resolved
    const resolvedBy = Math.random() > 0.4 ? "ai" : "human" as "ai" | "human"

    const resolvedAt = isResolved
      ? new Date(detectedAt.getTime() + Math.random() * 2 * 60 * 60 * 1000)
      : undefined

    incidents.push({
      id: `inc_${Date.now()}_${i}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      severity,
      detectedAt: detectedAt.toISOString(),
      resolvedAt: resolvedAt?.toISOString(),
      resolvedBy: isResolved ? resolvedBy : undefined,
      category: categories[Math.floor(Math.random() * categories.length)],
      affectedUsers: Math.floor(Math.random() * 100),
      status: isResolved ? "resolved" : Math.random() > 0.5 ? "in_progress" : "open",
      resolution: isResolved
        ? {
            incidentId: `inc_${Date.now()}_${i}`,
            status: "resolved",
            analysis: "Root cause identified and fixed",
            solution:
              resolvedBy === "ai"
                ? "Automatically applied configuration update"
                : "Manual intervention applied",
            steps: [
              "Identified root cause",
              "Applied fix",
              "Verified resolution",
              "Monitoring for recurrence",
            ],
            timestamp: resolvedAt.toISOString(),
            aiConfidence: resolvedBy === "ai" ? 85 + Math.random() * 15 : 0,
            requiresHumanReview: resolvedBy === "human",
          }
        : undefined,
    })
  }

  return incidents.sort(
    (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
  )
}

export async function GET() {
  try {
    const incidents = generateMockIncidents()
    const timeline = generateMonthlyTimeline(incidents)

    const stats = {
      total: incidents.length,
      resolved: incidents.filter((i) => i.status === "resolved").length,
      aiResolved: incidents.filter((i) => i.resolvedBy === "ai").length,
      inProgress: incidents.filter((i) => i.status === "in_progress").length,
      open: incidents.filter((i) => i.status === "open").length,
      avgResolutionTime: "2.3 hours",
      aiSuccessRate: Math.round(
        (incidents.filter((i) => i.resolvedBy === "ai").length /
          incidents.filter((i) => i.status === "resolved").length) *
          100
      ),
    }

    return NextResponse.json({
      incidents,
      timeline,
      stats,
    })
  } catch (error) {
    console.error("Failed to fetch incident history:", error)
    return NextResponse.json(
      { error: "Failed to fetch incident history" },
      { status: 500 }
    )
  }
}
