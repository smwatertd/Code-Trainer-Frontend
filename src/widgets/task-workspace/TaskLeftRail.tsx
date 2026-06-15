import type { TaskDetail } from "@/shared/types/api"
import {
  getTaskConstructionHints,
  getTaskConstructions,
} from "@/features/task-solving/model/studentUiUtils"
import { resolveKnownLanguage } from "@/features/task-solving/model/studentUiUtils"
import ConstructionChip from "@/features/task-solving/ui/ConstructionChip"
import { labelDifficulty, labelTaskDetailType } from "@/shared/utils/labels"
import { Badge } from "@/shared/ui/badge"

type TaskLeftRailProps = {
  task: TaskDetail
  detectedConstructions?: Set<string>
  highlightLanguage?: string
}

export default function TaskLeftRail({
  task,
  detectedConstructions = new Set(),
  highlightLanguage,
}: TaskLeftRailProps) {
  const constructions = getTaskConstructions(task)
  const hints = getTaskConstructionHints(task)
  const knownLang = highlightLanguage ?? resolveKnownLanguage(task)

  return (
    <aside className="task-left flex h-full min-h-0 flex-col overflow-hidden bg-bg">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{labelTaskDetailType(task)}</Badge>
          <Badge variant="muted">{labelDifficulty(task.difficulty)}</Badge>
        </div>
        <h1 className="mb-3 text-xl font-extrabold leading-tight tracking-tight">{task.title}</h1>
        <p className="whitespace-pre-line text-sm leading-relaxed text-ink-muted">
          {task.description || "Описание не задано."}
        </p>
        {constructions.length > 0 ? (
          <div className="mt-5">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-faint">
              Ожидаемые конструкции
            </div>
            <div className="flex flex-wrap gap-1.5">
              {constructions.map((pattern) => (
                <ConstructionChip
                  key={pattern}
                  pattern={pattern}
                  hints={hints}
                  language={knownLang}
                  detected={detectedConstructions.has(pattern)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
