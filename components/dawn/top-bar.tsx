import { ReactNode } from "react"

interface TopBarProps {
  children?: ReactNode
}

export function TopBar({ children }: TopBarProps) {
  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-6 gap-4">
        {children}
      </div>
    </div>
  )
}
