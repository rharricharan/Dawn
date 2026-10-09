// Mock data for Dashboard

export const dashboardStats = {
  found: 12,
  approved: 8,
  sent: 23,
  replies: 15,
  replyRate: 65, // percentage
  meetings: 4,
  pending: 8, // for the review badge
}

export const needsAttention = [
  {
    id: '1',
    type: 'reply',
    title: 'Acme replied to your email',
    description: 'Maya Chen from Acme Corporation',
    time: '2 hours ago',
    urgent: true,
  },
  {
    id: '2',
    type: 'follow_up',
    title: '3 follow-ups ready to review',
    description: 'Prospects waiting 4+ days',
    time: 'Ready now',
    urgent: false,
  },
]

export const comingUp = [
  {
    id: '1',
    type: 'scheduled_send',
    title: '6 emails scheduled to send today',
    description: 'Between 9:00 AM - 11:00 AM',
    time: 'Today',
  },
  {
    id: '2',
    type: 'follow_up_due',
    title: '2 follow-ups due tomorrow',
    description: 'No reply in 4 days',
    time: 'Tomorrow',
  },
  {
    id: '3',
    type: 'tasks',
    title: '5 tasks queued for tonight',
    description: 'Research run at 12:00 AM',
    time: 'Tonight',
  },
]

export const pipelineSnapshot = [
  { stage: 'approved', count: 8, color: 'bg-blue-500' },
  { stage: 'sent', count: 23, color: 'bg-purple-500' },
  { stage: 'replied', count: 15, color: 'bg-green-500' },
  { stage: 'meeting', count: 4, color: 'bg-orange-500' },
  { stage: 'won', count: 2, color: 'bg-emerald-500' },
]

export const recentActivity = [
  {
    id: '1',
    type: 'reply',
    company: 'Acme Corporation',
    action: 'replied',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'sent',
    company: 'Vertex AI',
    action: 'email sent',
    time: '3 hours ago',
  },
  {
    id: '3',
    type: 'approved',
    company: 'Luminary Labs',
    action: 'approved',
    time: '5 hours ago',
  },
  {
    id: '4',
    type: 'meeting',
    company: 'Stellar Dynamics',
    action: 'meeting scheduled',
    time: '1 day ago',
  },
  {
    id: '5',
    type: 'sent',
    company: 'Quantum Systems',
    action: 'email sent',
    time: '1 day ago',
  },
  {
    id: '6',
    type: 'found',
    company: 'Nova Technologies',
    action: 'discovered',
    time: '2 days ago',
  },
]

export const morningReport = {
  newFinds: 8,
  greeting: 'Good morning',
}
