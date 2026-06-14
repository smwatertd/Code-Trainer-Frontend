import { Link } from "react-router-dom"
import { useLearningConceptProgress } from "@/features/progress/hooks/useLearningConceptProgress"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import {
  findNextIncompleteTaskId,
  findNextIncompleteTechnicalConcept,
  labelTechnicalConcept,
} from "@/shared/utils/labels"

const TRACKS = [
  { language: "python", conceptId: "loops", label: "Python · Циклы" },
  { language: "python", conceptId: "conditions", label: "Python · Условия" },
  { language: "python", conceptId: "functions", label: "Python · Функции" },
] as const

export default function ProgressSummary() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <h2 className="mb-3 text-lg font-semibold">Прогресс по учебному плану</h2>
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
  const { data, isLoading, error } = useLearningConceptProgress(language, conceptId)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">Загрузка…</CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">Нет данных</CardContent>
      </Card>
    )
  }

  const nextTaskId = findNextIncompleteTaskId(data.by_task_id)
  const nextConceptId = findNextIncompleteTechnicalConcept(data.by_technical_concept)
  const nextConceptLabel = nextConceptId ? labelTechnicalConcept(nextConceptId) : null

  return (
    <Card data-testid={`progress-track-${conceptId}`}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <div
          className="flex items-center justify-between text-sm"
          data-testid={`progress-${conceptId}-stats`}
        >
          <span className="text-muted-foreground">Пройдено</span>
          <span>
            {data.passed_tasks} / {data.total_tasks}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${Math.min(data.progress_percent, 100)}%` }}
          />
        </div>
        <Badge variant="outline" data-testid={`progress-${conceptId}-percent`}>
          {Math.round(data.progress_percent)}%
        </Badge>
        {nextTaskId ? (
          <Link
            to={`/tasks/${nextTaskId}`}
            className="block text-xs text-primary hover:underline"
          >
            Открыть задачу {nextTaskId}
            {nextConceptLabel ? ` · ${nextConceptLabel}` : ""}
          </Link>
        ) : (
          <p className="text-xs text-muted-foreground">Все задачи по теме пройдены</p>
        )}
      </CardContent>
    </Card>
  )
}
