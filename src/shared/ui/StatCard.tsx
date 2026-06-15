import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/ui/cn"

type StatCardProps = {
  label: string
  value: string | number
  badge?: string
  badgeKind?: "lime" | "purple" | "muted" | "danger" | "warn"
}

const BADGE_VARIANT: Record<
  NonNullable<StatCardProps["badgeKind"]>,
  "default" | "secondary" | "muted" | "destructive" | "outline"
> = {
  lime: "default",
  purple: "secondary",
  muted: "muted",
  danger: "destructive",
  warn: "outline",
}

export default function StatCard({ label, value, badge, badgeKind = "muted" }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-[22px] shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{label}</div>
      <div className="tp-stat-value mt-1.5">{value}</div>
      {badge ? (
        <Badge variant={BADGE_VARIANT[badgeKind]} className={cn("mt-2 inline-flex")}>
          {badge}
        </Badge>
      ) : null}
    </div>
  )
}
