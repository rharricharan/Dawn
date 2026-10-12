import { NextRequest, NextResponse } from "next/server"
import { analyzeIncident, attemptAutoFix, type IncidentHistory } from "@/lib/ai/incident-handler"

export async function POST(request: NextRequest) {
  try {
    const incident = await request.json()

    // Analyze the incident with AI
    const resolution = await analyzeIncident({
      title: incident.title,
      description: incident.description || "",
      stackTrace: incident.stackTrace,
      errorCount: incident.count || 1,
      category: incident.category || "unknown",
    })

    // Create incident history record
    const incidentHistory: IncidentHistory = {
      id: resolution.incidentId,
      title: incident.title,
      severity: incident.count > 10 ? "critical" : incident.count > 5 ? "high" : "medium",
      detectedAt: new Date().toISOString(),
      resolvedBy: "ai",
      resolution,
      category: incident.category || "unknown",
      affectedUsers: incident.affectedUsers || 0,
      status: resolution.requiresHumanReview ? "open" : "in_progress",
    }

    // Attempt auto-fix if possible
    const wasAutoFixed = await attemptAutoFix(incidentHistory, resolution)

    if (wasAutoFixed) {
      incidentHistory.status = "resolved"
      incidentHistory.resolvedAt = new Date().toISOString()
    }

    // In a real implementation, save to database here
    // await saveIncidentToDatabase(incidentHistory)

    return NextResponse.json({
      success: true,
      incident: incidentHistory,
      autoFixed: wasAutoFixed,
      resolution,
    })
  } catch (error) {
    console.error("Failed to analyze incident:", error)
    return NextResponse.json(
      { error: "Failed to analyze incident" },
      { status: 500 }
    )
  }
}
