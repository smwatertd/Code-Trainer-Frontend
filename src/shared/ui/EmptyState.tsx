import type { ReactNode } from "react"
import { Card, CardContent } from "@/shared/ui/card"
import { cn } from "@/shared/lib/utils"

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed bg-card/60", className)}>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? (
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        ) : null}
        {action}
      </CardContent>
    </Card>
  )
}
