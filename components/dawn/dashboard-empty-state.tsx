import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Settings, Clock, CheckCircle2 } from "lucide-react"

export function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Welcome to Dawn</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Your automated prospect research and outreach assistant is ready to find your next design clients.
          </p>
        </div>

        {/* How it works */}
        <Card className="text-left">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">How Dawn works</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Research overnight</p>
                  <p className="text-sm text-muted-foreground">
                    Dawn scans for recently funded pre-seed/seed startups that need design help
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Get your morning report</p>
                  <p className="text-sm text-muted-foreground">
                    Each prospect comes with research, fit score, and a personalized email draft
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Review and approve</p>
                  <p className="text-sm text-muted-foreground">
                    Approve, edit, or pass on each prospect. Nothing sends without your OK.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">4</span>
                </div>
                <div>
                  <p className="font-medium">Track and win</p>
                  <p className="text-sm text-muted-foreground">
                    Monitor replies, schedule meetings, and convert prospects into clients
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-left">Getting started</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-left">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Database connected</p>
                    <p className="text-xs text-muted-foreground">Your Supabase database is set up and ready</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-left">
                  <div className="h-5 w-5 rounded-full border-2 border-muted mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Configure your preferences</p>
                    <p className="text-xs text-muted-foreground">Set your sending window and outreach preferences</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                </div>

                <div className="flex items-start gap-3 text-left">
                  <div className="h-5 w-5 rounded-full border-2 border-muted mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Wait for tonight&apos;s research run</p>
                    <p className="text-xs text-muted-foreground">
                      Dawn runs at midnight. Your first prospects will appear tomorrow morning.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-4 w-4" />
                    12:00 AM
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optional: Add a task for tonight */}
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Or give Dawn specific instructions for tonight&apos;s research
          </p>
          <div className="flex gap-2 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="e.g., Focus on fintech companies in NYC"
              className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-sm"
            />
            <Button>Add task</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
