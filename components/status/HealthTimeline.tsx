"use client"

import { useMemo } from "react"

interface TimelineDay {
  date: string
  incidents: number
  resolved: number
  health: number
}

interface HealthTimelineProps {
  data: TimelineDay[]
}

export function HealthTimeline({ data }: HealthTimelineProps) {
  const weeks = useMemo(() => {
    // Ensure timeline always goes to today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get the last 30 days ending today
    const days: TimelineDay[] = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      // Find matching data or default to healthy
      const dayData = data.find(d => d.date === dateStr) || {
        date: dateStr,
        incidents: 0,
        resolved: 0,
        health: 100,
      }

      days.push(dayData)
    }

    // Group into weeks
    const weekGroups: TimelineDay[][] = []
    let currentWeek: TimelineDay[] = []

    days.forEach((day, index) => {
      currentWeek.push(day)
      const dayOfWeek = new Date(day.date).getDay()

      // End of week (Saturday) or last day
      if (dayOfWeek === 6 || index === days.length - 1) {
        weekGroups.push([...currentWeek])
        currentWeek = []
      }
    })

    return weekGroups
  }, [data])

  const getHealthColor = (health: number) => {
    if (health >= 95) return "bg-[#FFAF69]"
    if (health >= 85) return "bg-[#FFAF69]/80"
    if (health >= 75) return "bg-[#FFAF69]/60"
    if (health >= 60) return "bg-[#DF3E0D]/40"
    return "bg-[#DF3E0D]"
  }

  const getStatusText = (health: number) => {
    if (health >= 95) return "Excellent"
    if (health >= 85) return "Good"
    if (health >= 75) return "Fair"
    if (health >= 60) return "Poor"
    return "Critical"
  }

  return (
    <div className="space-y-[16px]">
      <div className="flex items-center justify-between flex-wrap gap-[12px]">
        <p className="text-[12px] text-[#120902]/60 font-medium">
          Last 30 days • Ending today
        </p>
        <div className="flex items-center gap-[8px] text-[11px]">
          <span className="text-[#120902]/50">Less</span>
          <div className="flex items-center gap-[3px]">
            <div className="h-[12px] w-[12px] rounded-[3px] bg-[#120902]/5 border border-[#120902]/10"></div>
            <div className="h-[12px] w-[12px] rounded-[3px] bg-[#FFAF69]/60"></div>
            <div className="h-[12px] w-[12px] rounded-[3px] bg-[#FFAF69]/80"></div>
            <div className="h-[12px] w-[12px] rounded-[3px] bg-[#FFAF69]"></div>
          </div>
          <span className="text-[#120902]/50">More healthy</span>
        </div>
      </div>

      <div className="flex gap-[3px] overflow-x-auto pb-[8px]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {week.map((day, dayIndex) => {
              const date = new Date(day.date)
              const isToday =
                date.toISOString().split("T")[0] ===
                new Date().toISOString().split("T")[0]

              return (
                <div
                  key={day.date}
                  className="group relative"
                  title={`${date.toLocaleDateString()}: ${getStatusText(day.health)} (${day.health}% health)`}
                >
                  <div
                    className={`h-[12px] w-[12px] rounded-[3px] border transition-all cursor-pointer hover:ring-2 hover:ring-[#FFAF69]/40 ${
                      day.incidents === 0
                        ? "bg-[#120902]/5 border-[#120902]/10"
                        : getHealthColor(day.health) + " border-[#120902]/10"
                    } ${isToday ? "ring-2 ring-[#120902]/30" : ""}`}
                  ></div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[8px] px-[12px] py-[8px] bg-[#120902] text-white text-[11px] rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    <div className="font-semibold mb-[4px]">
                      {isToday ? "Today" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div className="text-[#FFAF69]">
                      Health: {day.health}% ({getStatusText(day.health)})
                    </div>
                    {day.incidents > 0 && (
                      <>
                        <div className="text-[#DF3E0D]/80 mt-[2px]">
                          {day.incidents} incident{day.incidents !== 1 ? "s" : ""}
                        </div>
                        {day.resolved > 0 && (
                          <div className="text-[#FFAF69]/80">
                            {day.resolved} resolved
                          </div>
                        )}
                      </>
                    )}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#120902]"></div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
