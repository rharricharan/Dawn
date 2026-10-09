"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { TopBar } from "./top-bar"
import { GettingStartedPanel } from "./getting-started-panel"
import { Search, Sparkles } from "lucide-react"

export function DashboardEmptyState() {
  return (
    <>
      {/* Top Bar */}
      <TopBar>
        {/* Empty for now - future back buttons and navigation will go here */}
      </TopBar>

      {/* Main Content */}
      <div className="flex">
        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-8">
          <div className="max-w-2xl w-full space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-primary/10 p-6">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-bold">Welcome to Dawn</h1>
              <p className="text-lg text-muted-foreground">
                Find recently funded startups that need design help
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search prospects, companies, or founders..."
                className="h-14 pl-12 text-base"
              />
            </div>

            {/* How Dawn Works - Dropdown */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="how-it-works" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-semibold">How Dawn works</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2 pb-4">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Optional Task Input */}
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Give Dawn specific instructions for tonight&apos;s research
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Focus on fintech companies in NYC"
                  className="flex-1"
                />
                <Button>Add task</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Panel - Right Side */}
        <GettingStartedPanel />
      </div>
    </>
  )
}
