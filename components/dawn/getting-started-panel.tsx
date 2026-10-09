"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Settings, Clock, X, ChevronLeft } from "lucide-react"

export function GettingStartedPanel() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed right-4 top-20 z-50"
        onClick={() => setIsOpen(true)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 border-l bg-background shadow-lg z-40">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Getting started</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">Database connected</p>
                <p className="text-xs text-muted-foreground">
                  Your Supabase database is set up and ready
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-muted mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="font-medium text-sm">Configure preferences</p>
                <p className="text-xs text-muted-foreground">
                  Set your sending window and outreach preferences
                </p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Open Settings
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-muted mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">Wait for research run</p>
                <p className="text-xs text-muted-foreground">
                  Dawn runs at midnight. Your first prospects will appear tomorrow morning.
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                  <Clock className="h-3 w-3" />
                  Next run: 12:00 AM
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
