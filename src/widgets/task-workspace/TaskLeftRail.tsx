import { useState } from "react"
import { Link } from "react-router-dom"
import type { TaskDetail } from "@/shared/types/api"
import {
  getConstructionLabel,
  getReferenceCode,
  getTaskConstructionHints,
  getTaskConstructions,
  getTaskTestCases,
  getWriteTaskReferenceText,
  resolveKnownLanguage,
} from "@/features/task-solving/model/studentUiUtils"
import { labelDifficulty, labelLanguage, labelTaskType } from "@/shared/utils/labels"
import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/ui/cn"

type TaskLeftRailProps = {
  task: TaskDetail
}

type LeftTab = "task" | "examples" | "hints" | "reference"

export default function TaskLeftRail({ task }: TaskLeftRailProps) {
  const [tab, setTab] = useState<LeftTab>("task")
  const constructions = getTaskConstructions(task)
  const hints = getTaskConstructionHints(task)
  const testCases = getTaskTestCases(task)
  const knownLang = resolveKnownLanguage(task)
  const referenceCode = getReferenceCode(task, knownLang) ?? getWriteTaskReferenceText(task)
  const hasHints = constructions.length > 0 || Object.keys(hints).length > 0
  const hasReference = Boolean(referenceCode?.trim())

  const tabs: { id: LeftTab; label: string; hidden?: boolean }[] = [
    { id: "task", label: "Условие" },
    { id: "examples", label: "Примеры", hidden: testCases.length === 0 },
    { id: "hints", label: "Подсказки", hidden: !hasHints },
    { id: "reference", label: "Эталон", hidden: !hasReference },
  ]

  return (
    <aside className="task-left flex h-full min-h-0 flex-col overflow-hidden bg-bg">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="tp-tabbar mb-3.5">
          {tabs
            .filter((item) => !item.hidden)
            .map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(tab === item.id && "on")}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
        </div>

        {tab === "task" ? (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{labelTaskType(task.task_type)}</Badge>
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
                    <span
                      key={pattern}
                      className="tp-chip sm cursor-default hover:border-[#333d4f] hover:text-ink-muted"
                    >
                      {getConstructionLabel(pattern, hints)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        {tab === "examples" ? (
          <div className="space-y-4">
            {testCases.map((testCase, index) => (
              <div key={index}>
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                  Пример {index + 1}
                </div>
                <div className="overflow-hidden rounded-md border border-border bg-[#0b0f17] font-mono text-[13px]">
                  <div className="border-b border-border px-3.5 py-2 text-ink-faint">Вход / выход</div>
                  <div className="space-y-1 px-3.5 py-3 leading-relaxed">
                    <div>
                      <span className="text-ink-faint">› Вход: </span>
                      <span className="text-[#79d0ff]">{testCase.inputs || "—"}</span>
                    </div>
                    <div>
                      <span className="text-ink-faint">› Выход: </span>
                      <span className="text-lime">{testCase.output || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "hints" ? (
          <div className="space-y-3">
            {constructions.map((pattern) => {
              const hint = hints[pattern]
              if (!hint?.title) return null
              return (
                <div key={pattern} className="tp-note">
                  <b className="text-ink">{getConstructionLabel(pattern, hints)}:</b>{" "}
                  {hint.title}
                </div>
              )
            })}
            {constructions.length === 0 ? (
              <p className="text-sm text-ink-muted">Подсказок для этой задачи пока нет.</p>
            ) : null}
          </div>
        ) : null}

        {tab === "reference" && hasReference ? (
          <div>
            <p className="mb-3 text-[13px] text-ink-muted">
              Эталонное решение для ориентира. Сначала попробуйте решить задачу самостоятельно.
            </p>
            <div className="ref-snippet">
              <div className="ref-snippet-h">
                <span>
                  solution · {labelLanguage(knownLang)}
                </span>
                <span>read-only</span>
              </div>
              <pre>{referenceCode}</pre>
            </div>
            <div className="tp-note mt-3 border-warning/30 bg-warning/10 text-sm text-warning">
              <b className="text-ink">Совет:</b> закройте вкладку и попробуйте сначала — эталон
              лучше смотреть в последнюю очередь.
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
