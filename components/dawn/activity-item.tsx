import { CheckCircle2, Mail, Send, Calendar, Sparkles } from "lucide-react"

interface ActivityItemProps {
  type: 'reply' | 'sent' | 'approved' | 'meeting' | 'found'
  company: string
  action: string
  time: string
}

const activityIcons = {
  reply: CheckCircle2,
  sent: Send,
  approved: Sparkles,
  meeting: Calendar,
  found: Mail,
}

const activityColors = {
  reply: 'text-green-600',
  sent: 'text-purple-600',
  approved: 'text-blue-600',
  meeting: 'text-orange-600',
  found: 'text-gray-600',
}

export function ActivityItem({ type, company, action, time }: ActivityItemProps) {
  const Icon = activityIcons[type]
  const color = activityColors[type]

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`mt-0.5 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm">
          <span className="font-medium">{company}</span>{' '}
          <span className="text-muted-foreground">{action}</span>
        </p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}
