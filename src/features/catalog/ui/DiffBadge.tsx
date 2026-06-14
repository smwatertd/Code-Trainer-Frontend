import { Badge } from "@/shared/ui/badge"
import { labelDifficulty } from "@/shared/utils/labels"
import { cn } from "@/shared/ui/cn"

type DiffBadgeProps = {
  difficulty: string
}

const VARIANT: Record<string, "muted" | "secondary" | "destructive"> = {
  easy: "muted",
  medium: "secondary",
  hard: "destructive",
}

export default function DiffBadge({ difficulty }: DiffBadgeProps) {
  const key = difficulty.trim().toLowerCase()
  return (
    <Badge variant={VARIANT[key] ?? "muted"} className={cn(key === "easy" && "text-ink-muted")}>
      {labelDifficulty(difficulty)}
    </Badge>
  )
}
