import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { KpiTile } from "@/components/dawn/kpi-tile"
import { ActivityItem } from "@/components/dawn/activity-item"
import { DashboardEmptyState } from "@/components/dawn/dashboard-empty-state"
import {
  dashboardStats,
  needsAttention,
  comingUp,
  pipelineSnapshot,
  recentActivity,
  morningReport
} from "@/lib/mocks/dashboard-data"
import { ArrowRight, AlertCircle, Clock, Plus } from "lucide-react"

export default function Dashboard() {
  // Toggle this to see empty state vs full dashboard
  const isEmpty = true // Set to false to see the full dashboard with data

  if (isEmpty) {
    return <DashboardEmptyState />
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{morningReport.greeting}</h1>
            <p className="text-muted-foreground mt-1">
              {morningReport.newFinds} new finds overnight
            </p>
          </div>
          {dashboardStats.pending > 0 && (
            <Button size="lg" asChild>
              <Link href="/review">
                Start review
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-5">
        <KpiTile label="Found" value={dashboardStats.found} />
        <KpiTile label="Approved" value={dashboardStats.approved} />
        <KpiTile label="Sent" value={dashboardStats.sent} />
        <KpiTile
          label="Replies"
          value={dashboardStats.replies}
          subtitle={`${dashboardStats.replyRate}% rate`}
        />
        <KpiTile label="Meetings" value={dashboardStats.meetings} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Needs Attention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Needs attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {needsAttention.length === 0 ? (
              <p className="text-sm text-muted-foreground">All caught up!</p>
            ) : (
              <div className="space-y-4">
                {needsAttention.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      {item.urgent && (
                        <Badge variant="destructive" className="shrink-0">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coming Up */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Coming up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comingUp.map((item) => (
                <div key={item.id} className="space-y-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Snapshot */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pipeline snapshot</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/pipeline">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 h-8">
              {pipelineSnapshot.map((stage) => {
                const total = pipelineSnapshot.reduce((sum, s) => sum + s.count, 0)
                const width = (stage.count / total) * 100
                return (
                  <div
                    key={stage.stage}
                    className={`${stage.color} rounded flex items-center justify-center text-xs font-medium text-white`}
                    style={{ width: `${width}%` }}
                  >
                    {stage.count}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between text-sm">
              {pipelineSnapshot.map((stage) => (
                <div key={stage.stage} className="text-center">
                  <p className="font-medium capitalize">{stage.stage}</p>
                  <p className="text-muted-foreground">{stage.count}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest updates from your prospects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {recentActivity.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                type={activity.type}
                company={activity.company}
                action={activity.action}
                time={activity.time}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tonight's Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Tonight&apos;s tasks</CardTitle>
          <CardDescription>
            Add instructions for the overnight research run
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-2">
            <Input
              placeholder="e.g., Focus on fintech companies in NYC"
              className="flex-1"
            />
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            5 tasks queued for tonight&apos;s run at 12:00 AM
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
