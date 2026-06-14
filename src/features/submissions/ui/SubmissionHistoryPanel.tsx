import { useMemo, useState } from "react"
import { useSubmissionHistory } from "@/features/submissions/hooks/useSubmissionHistory"
import type { SubmissionHistoryItem } from "@/shared/api/submissionsClient"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { labelSubmissionOutcome, labelLanguage } from "@/shared/utils/labels"
import { RESULT_TONE_STYLES } from "@/shared/utils/resultPresentation"

type SubmissionHistoryPanelProps = {
  taskId: number
  enabled: boolean
  selectedSubmissionId?: number | null
  onSelect?: (item: SubmissionHistoryItem) => void
  className?: string
}

type HistoryFilter = "all" | "success" | "failure"

const FILTERS: Array<{ id: HistoryFilter; label: string }> = [
  { id: "all", label: "Все" },
  { id: "success", label: "Успех" },
  { id: "failure", label: "Неудача" },
]

function formatDuration(durationMs: number | null | undefined): string {
  if (!durationMs || durationMs <= 0) return "—"
  if (durationMs < 1000) return `${durationMs} мс`
  return `${(durationMs / 1000).toFixed(2)} с`
}

function formatWhen(value: string | null | undefined): string {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function matchesFilter(item: SubmissionHistoryItem, filter: HistoryFilter): boolean {
  if (filter === "success") return item.success === true
  if (filter === "failure") return item.success === false
  return true
}

export default function SubmissionHistoryPanel({
  taskId,
  enabled,
  selectedSubmissionId = null,
  onSelect,
  className,
}: SubmissionHistoryPanelProps) {
  const { data = [], isLoading, error } = useSubmissionHistory(taskId, enabled)
  const [filter, setFilter] = useState<HistoryFilter>("all")

  const filteredItems = useMemo(
    () => data.filter((item) => matchesFilter(item, filter)),
    [data, filter],
  )

  if (!enabled) return null

  return (
    <div
      className={cn("flex min-h-0 flex-col overflow-hidden", className)}
      data-testid="submission-history"
    >
      <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground">История попыток</h4>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Фильтр истории">
          {FILTERS.map((option) => (
            <Button
              key={option.id}
              type="button"
              size="sm"
              variant={filter === option.id ? "secondary" : "outline"}
              className="h-7 px-2.5 text-xs"
              data-testid={`history-filter-${option.id}`}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? <p className="shrink-0 text-sm text-muted-foreground">Загрузка…</p> : null}
      {error ? <p className="shrink-0 text-sm text-destructive">Не удалось загрузить историю</p> : null}
      {!isLoading && !error && data.length === 0 ? (
        <p className="shrink-0 text-sm text-muted-foreground">Пока нет завершённых попыток.</p>
      ) : null}
      {!isLoading && data.length > 0 && filteredItems.length === 0 ? (
        <p className="shrink-0 text-sm text-muted-foreground">Нет попыток по выбранному фильтру.</p>
      ) : null}

      {!isLoading && filteredItems.length > 0 ? (
        <div
          className="min-h-0 flex-1 overflow-hidden rounded-md border border-border bg-muted/20"
          data-testid="submission-history-viewport"
        >
          <ul className="app-scrollbar h-full space-y-1.5 overflow-y-auto p-1.5 text-sm">
            {filteredItems.map((item) => {
              const isSelected = selectedSubmissionId === item.id
              const isSuccess = item.success === true
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect?.(item)}
                    className={cn(
                      "flex w-full items-center gap-2 overflow-hidden rounded border px-3 py-2 text-left whitespace-nowrap transition",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
                    )}
                  >
                    <span className="shrink-0 text-muted-foreground">#{item.id}</span>
                    <Badge
                      className={cn(
                        "shrink-0",
                        isSuccess
                          ? RESULT_TONE_STYLES.success.badge
                          : RESULT_TONE_STYLES.error.badge,
                      )}
                    >
                      {labelSubmissionOutcome(item.success)}
                    </Badge>
                    <span className="min-w-0 truncate text-muted-foreground">
                      {labelLanguage(item.language)}
                    </span>
                    <span className="ml-auto shrink-0 text-muted-foreground">
                      {formatWhen(item.created_at)}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {formatDuration(item.duration_ms)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
