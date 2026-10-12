import { NextResponse } from "next/server"
import { type IncidentHistory, generateMonthlyTimeline } from "@/lib/ai/incident-handler"

// In production, this would fetch from your database
// For now, returns empty until real incidents are stored
function getStoredIncidents(): IncidentHistory[] {
  // TODO: Replace with actual database query
  // Example: return await db.incidents.findMany({ orderBy: { detectedAt: 'desc' } })
  return []
}

export async function GET() {
  try {
    // Get real incidents from storage (currently empty, will populate as AI analyzes real errors)
    const incidents = getStoredIncidents()
    const timeline = generateMonthlyTimeline(incidents)

    const resolved = incidents.filter((i) => i.status === "resolved")
    const aiResolved = incidents.filter((i) => i.resolvedBy === "ai")

    const stats = {
      total: incidents.length,
      resolved: resolved.length,
      aiResolved: aiResolved.length,
      inProgress: incidents.filter((i) => i.status === "in_progress").length,
      open: incidents.filter((i) => i.status === "open").length,
      avgResolutionTime: incidents.length > 0 ? calculateAvgResolutionTime(incidents) : "0m",
      aiSuccessRate: resolved.length > 0
        ? Math.round((aiResolved.length / resolved.length) * 100)
        : 0,
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

function calculateAvgResolutionTime(incidents: IncidentHistory[]): string {
  const resolved = incidents.filter(i => i.resolvedAt && i.detectedAt)

  if (resolved.length === 0) return "0m"

  const totalMinutes = resolved.reduce((sum, inc) => {
    const detected = new Date(inc.detectedAt).getTime()
    const resolvedTime = new Date(inc.resolvedAt!).getTime()
    return sum + Math.floor((resolvedTime - detected) / 60000)
  }, 0)

  const avgMinutes = Math.floor(totalMinutes / resolved.length)

  if (avgMinutes < 60) return `${avgMinutes}m`
  const hours = Math.floor(avgMinutes / 60)
  const mins = avgMinutes % 60
  return `${hours}h ${mins}m`
}
