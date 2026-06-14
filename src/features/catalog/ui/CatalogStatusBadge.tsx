import type { CatalogStudentStatus } from "@/features/catalog/lib/taskCatalogView"
import { catalogStatusLabel } from "@/features/catalog/lib/taskCatalogView"
import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/ui/cn"

type CatalogStatusBadgeProps = {
  status: CatalogStudentStatus
}

function StatusDot({ status }: { status: CatalogStudentStatus }) {
  return (
    <span
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        status === "solved" && "bg-lime",
        status === "attempted" && "bg-purple",
        status === "todo" && "bg-ink-faint",
      )}
    />
  )
}

export default function CatalogStatusBadge({ status }: CatalogStatusBadgeProps) {
  const label =
    status === "solved"
      ? "Решено"
      : status === "attempted"
        ? "В процессе"
        : catalogStatusLabel("not_started")

  return (
    <Badge
      variant={status === "solved" ? "default" : status === "attempted" ? "secondary" : "muted"}
      className={cn(
        "shrink-0 gap-1.5 whitespace-nowrap",
        status === "solved" && "border-lime/30 bg-lime-soft text-lime",
        status === "attempted" && "border-purple/30 bg-purple-soft text-[#cbb6ff]",
      )}
    >
      <StatusDot status={status} />
      {label}
    </Badge>
  )
}
