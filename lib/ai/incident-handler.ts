import Anthropic from "@anthropic-ai/sdk"

export interface IncidentResolution {
  incidentId: string
  status: "analyzing" | "fixing" | "resolved" | "escalated"
  analysis: string
  solution?: string
  steps: string[]
  timestamp: string
  aiConfidence: number
  requiresHumanReview: boolean
}

export interface IncidentHistory {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  detectedAt: string
  resolvedAt?: string
  resolvedBy: "ai" | "human" | "auto"
  resolution?: IncidentResolution
  category: string
  affectedUsers: number
  status: "open" | "in_progress" | "resolved" | "ignored"
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function analyzeIncident(incident: {
  title: string
  description: string
  stackTrace?: string
  errorCount: number
  category: string
}): Promise<IncidentResolution> {
  const prompt = `You are an AI DevOps engineer analyzing a production incident. Analyze this issue and provide a resolution plan.

Incident Details:
Title: ${incident.title}
Description: ${incident.description}
Category: ${incident.category}
Occurrence Count: ${incident.errorCount}
${incident.stackTrace ? `Stack Trace:\n${incident.stackTrace}` : ''}

Provide:
1. Root cause analysis
2. Recommended solution
3. Step-by-step fix implementation
4. Confidence level (0-100)
5. Whether this requires human review

Format your response as JSON with these fields:
{
  "analysis": "detailed root cause analysis",
  "solution": "recommended solution",
  "steps": ["step 1", "step 2", ...],
  "confidence": 85,
  "requiresHumanReview": false
}`

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type === "text") {
      const response = JSON.parse(content.text)

      return {
        incidentId: `inc_${Date.now()}`,
        status: response.requiresHumanReview ? "escalated" : "fixing",
        analysis: response.analysis,
        solution: response.solution,
        steps: response.steps,
        timestamp: new Date().toISOString(),
        aiConfidence: response.confidence,
        requiresHumanReview: response.requiresHumanReview,
      }
    }

    throw new Error("Unexpected response format")
  } catch (error) {
    console.error("AI analysis failed:", error)
    return {
      incidentId: `inc_${Date.now()}`,
      status: "escalated",
      analysis: "Failed to analyze incident with AI",
      steps: ["Manual investigation required"],
      timestamp: new Date().toISOString(),
      aiConfidence: 0,
      requiresHumanReview: true,
    }
  }
}

export async function attemptAutoFix(
  incident: IncidentHistory,
  resolution: IncidentResolution
): Promise<boolean> {
  // This would contain logic to automatically apply fixes
  // For now, it's a placeholder that simulates auto-fixing common issues

  const autoFixableCategories = ["rate_limit", "cache", "timeout"]
  const category = incident.category.toLowerCase()

  // Only auto-fix if confidence is high and doesn't require review
  if (
    resolution.aiConfidence > 80 &&
    !resolution.requiresHumanReview &&
    autoFixableCategories.some((cat) => category.includes(cat))
  ) {
    // Simulate applying the fix
    console.log(`Auto-fixing incident ${incident.id}: ${incident.title}`)
    console.log(`Steps taken:`, resolution.steps)
    return true
  }

  return false
}

export function calculateDailyHealthScore(incidents: IncidentHistory[]): number {
  if (incidents.length === 0) return 100

  const weights = {
    critical: 20,
    high: 10,
    medium: 5,
    low: 2,
  }

  const totalImpact = incidents.reduce((sum, inc) => {
    const weight = weights[inc.severity] || 1
    const isOpen = inc.status !== "resolved" ? 2 : 1
    return sum + weight * isOpen
  }, 0)

  const maxPossibleImpact = incidents.length * weights.critical * 2
  const healthScore = Math.max(0, 100 - (totalImpact / maxPossibleImpact) * 100)

  return Math.round(healthScore)
}

export function generateMonthlyTimeline(
  incidents: IncidentHistory[]
): Array<{ date: string; incidents: number; resolved: number; health: number }> {
  const timeline: Map<
    string,
    { incidents: number; resolved: number; all: IncidentHistory[] }
  > = new Map()

  // Get last 30 days
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    timeline.set(dateStr, { incidents: 0, resolved: 0, all: [] })
  }

  // Populate with incident data
  incidents.forEach((incident) => {
    const detectedDate = new Date(incident.detectedAt).toISOString().split("T")[0]
    const entry = timeline.get(detectedDate)

    if (entry) {
      entry.incidents++
      entry.all.push(incident)
      if (incident.status === "resolved") {
        entry.resolved++
      }
    }
  })

  // Convert to array with health scores
  return Array.from(timeline.entries()).map(([date, data]) => ({
    date,
    incidents: data.incidents,
    resolved: data.resolved,
    health: calculateDailyHealthScore(data.all),
  }))
}
