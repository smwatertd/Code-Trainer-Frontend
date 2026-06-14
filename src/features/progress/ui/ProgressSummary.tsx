import { Link } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { useLearningConceptProgress } from "@/features/progress/hooks/useLearningConceptProgress"
import { Badge } from "@/shared/ui/badge"
import {
  findNextIncompleteTaskId,
  findNextIncompleteTechnicalConcept,
  labelTechnicalConcept,
} from "@/shared/utils/labels"
import { cn } from "@/shared/ui/cn"

const TRACKS = [
  { language: "python", conceptId: "loops", label: "Python · Циклы" },
  { language: "python", conceptId: "conditions", label: "Python · Условия" },
  { language: "python", conceptId: "functions", label: "Python · Функции" },
] as const

export default function ProgressSummary() {
  return (
    <div className="mb-6 pt-2">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight">Прогресс по учебному плану</h2>
        <Link to="/learn/python" className="text-sm font-semibold text-lime hover:underline">
          Все треки →
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {TRACKS.map((track) => (
          <ProgressTrackCard key={`${track.language}-${track.conceptId}`} {...track} />
        ))}
      </div>
    </div>
  )
}

function ProgressTrackCard({
  language,
  conceptId,
  label,
}: {
  language: string
  conceptId: string
  label: string
}) {
  const { isAuthenticated } = useAuth()
  const { data, isLoading, error } = useLearningConceptProgress(
    language,
    conceptId,
    isAuthenticated,
  )

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-surface p-4 text-sm text-ink-muted shadow-card">
        Загрузка…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-border bg-surface p-4 text-sm text-ink-muted shadow-card">
        Нет данных
      </div>
    )
  }

  const nextTaskId = findNextIncompleteTaskId(data.by_task_id)
  const nextConceptId = findNextIncompleteTechnicalConcept(data.by_technical_concept)
  const nextConceptLabel = nextConceptId ? labelTechnicalConcept(nextConceptId) : null
  const percent = Math.min(data.progress_percent, 100)

  return (
    <div
      className="rounded-lg border border-border bg-surface p-4 shadow-card"
      data-testid={`progress-track-${conceptId}`}
    >
      <b className="text-base">{label}</b>
      <div
        className="mt-3 flex items-center justify-between text-sm"
        data-testid={`progress-${conceptId}-stats`}
      >
        <span className="text-ink-muted">Пройдено</span>
        <span>
          {data.passed_tasks} / {data.total_tasks}
        </span>
      </div>
      <div className="tp-progress mt-2">
        <i style={{ width: `${percent}%` }} />
      </div>
      <Badge variant="outline" className="mt-2" data-testid={`progress-${conceptId}-percent`}>
        {Math.round(data.progress_percent)}%
      </Badge>
      {nextTaskId ? (
        <Link
          to={`/tasks/${nextTaskId}`}
          className={cn("mt-2 block text-xs font-semibold text-lime hover:underline")}
        >
          Открыть задачу {nextTaskId}
          {nextConceptLabel ? ` · ${nextConceptLabel}` : ""}
        </Link>
      ) : (
        <p className="mt-2 text-xs text-ink-muted">Все задачи по теме пройдены</p>
      )}
    </div>
  )
}
