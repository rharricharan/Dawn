import { Card, CardContent } from "@/components/ui/card"

interface KpiTileProps {
  label: string
  value: number | string
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function KpiTile({ label, value, subtitle, trend }: KpiTileProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {trend && (
            <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
