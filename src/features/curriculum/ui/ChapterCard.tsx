import type { CollectionSummary } from "@/features/curriculum/types"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/ui/cn"
import { Link } from "react-router-dom"

type ChapterCardProps = {
  chapter: CollectionSummary
  isCurrent?: boolean
  isLast?: boolean
}

export default function ChapterCard({ chapter, isCurrent = false, isLast = false }: ChapterCardProps) {
  const { progress, completed } = chapter
  const percent = progress.total_tasks
    ? Math.round((progress.passed_tasks / progress.total_tasks) * 100)
    : 0

  const nodeClass = completed
    ? "border-lime/45 bg-lime/15 text-lime"
    : isCurrent
      ? "border-purple/50 bg-purple/15 text-[#b89bff]"
      : "border-border-strong bg-surface-2 text-ink-muted"

  return (
    <div
      className={cn(
        "chapter-card relative grid grid-cols-1 gap-2.5 rounded-2xl border bg-surface p-5 transition sm:grid-cols-[52px_1fr] sm:gap-4",
        "hover:border-lime/35 hover:shadow-[0_18px_44px_-28px_rgba(142,255,1,0.45)]",
        completed ? "border-lime/25" : "border-border",
      )}
    >
      <div className="relative flex flex-row items-center gap-2.5 sm:flex-col">
        <div
          className={cn(
            "z-[1] grid h-10 w-10 flex-none place-items-center rounded-xl border text-base font-extrabold",
            nodeClass,
          )}
        >
          {completed ? "✓" : chapter.order}
        </div>
        {!isLast ? (
          <span className="absolute left-1/2 top-10 bottom-[-32px] hidden w-0.5 -translate-x-1/2 bg-gradient-to-b from-border-strong to-transparent sm:block" />
        ) : null}
      </div>

      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <b className="text-base text-ink">{chapter.title_ru}</b>
          {completed ? <Badge variant="default">✓ Все пройдены</Badge> : null}
          {!completed && isCurrent ? <Badge variant="secondary">Текущий</Badge> : null}
        </div>
        <p className="text-[13.5px] text-ink-muted">{chapter.description_ru}</p>

        <div className="mt-3 grid grid-cols-1 items-center gap-3.5 sm:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-1.5 font-mono text-xs text-ink-faint">
              {progress.passed_tasks}/{progress.total_tasks} · {percent}%
            </div>
            <div className={cn("tp-progress", isCurrent && !completed && "pp")}>
              <i style={{ width: `${percent}%` }} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to={chapter.route_path}>Открыть сборник</Link>
            </Button>
            <Button size="sm" disabled={!chapter.next_task} asChild={Boolean(chapter.next_task)}>
              {chapter.next_task ? (
                <Link to={`/tasks/${chapter.next_task.task_id}`} state={{ returnTo: chapter.route_path }}>
                  {chapter.button_label}
                </Link>
              ) : (
                <span>{chapter.button_label}</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
