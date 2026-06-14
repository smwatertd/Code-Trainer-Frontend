import type { ReactNode } from "react"
import { cn } from "@/shared/lib/utils"

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
  icon?: string
}

export default function EmptyState({
  title,
  description,
  action,
  className,
  icon = "⌕",
}: EmptyStateProps) {
  return (
    <div className={cn("tp-empty rounded-lg border border-dashed border-[#333d4f] bg-surface/60", className)}>
      <div className="ill">{icon}</div>
      <b className="text-base">{title}</b>
      {description ? (
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
