import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sentryToken = process.env.SENTRY_AUTH_TOKEN
    const sentryOrg = process.env.SENTRY_ORG
    const sentryProject = process.env.SENTRY_PROJECT

    if (!sentryToken || !sentryOrg || !sentryProject) {
      return NextResponse.json({
        errorCount: 0,
        issues: [],
        message: "Sentry not configured"
      })
    }

    // Fetch issues from Sentry API
    const response = await fetch(
      `https://sentry.io/api/0/projects/${sentryOrg}/${sentryProject}/issues/?query=is:unresolved`,
      {
        headers: {
          'Authorization': `Bearer ${sentryToken}`,
        },
        next: { revalidate: 30 } // Cache for 30 seconds
      }
    )

    if (!response.ok) {
      console.error('Sentry API error:', response.statusText)
      return NextResponse.json({
        errorCount: 0,
        issues: [],
        message: "Failed to fetch from Sentry"
      })
    }

    const issues = await response.json()

    // Transform Sentry issues to our format
    const transformedIssues = issues.map((issue: any) => ({
      id: issue.id,
      title: issue.title || issue.metadata?.type || "Unknown Error",
      count: issue.count || 0,
      firstSeen: issue.firstSeen,
      lastSeen: issue.lastSeen,
      status: issue.status === "resolved" ? "resolved" : "unresolved",
      level: issue.level || "error"
    }))

    return NextResponse.json({
      errorCount: transformedIssues.length,
      issues: transformedIssues
    })
  } catch (error) {
    console.error('Error fetching Sentry issues:', error)
    return NextResponse.json({
      errorCount: 0,
      issues: [],
      message: "Error fetching issues"
    })
  }
}
