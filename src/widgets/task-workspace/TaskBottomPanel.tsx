import { useEffect, useMemo, useRef, useState } from "react"
import { Check, Play, X } from "lucide-react"
import type { CheckResult, TaskDetail } from "@/shared/types/api"
import {
  buildTestRows,
  countTestStats,
  extractPanelErrors,
  formatTestDuration,
} from "@/features/task-solving/model/testPanelUtils"
import { getTaskTestCases } from "@/features/task-solving/model/studentUiUtils"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/lib/utils"

type TaskBottomPanelProps = {
  task: TaskDetail
  result: CheckResult | null
  onRun: () => void
  isSubmitting: boolean
}

function ResultBadge({ status }: { status: string }) {
  if (status === "PASSED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-lime/30 bg-lime-soft px-2 py-0.5 text-[11px] font-semibold text-lime">
        <Check className="h-3 w-3" />
        Пройден
      </span>
    )
  }
  if (status === "FAILED" || status === "ERROR") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-danger/35 bg-danger-soft px-2 py-0.5 text-[11px] font-semibold text-[#ff8198]">
        <X className="h-3 w-3" />
        Провал
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#333d4f] bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
      ○ Ожидает
    </span>
  )
}

export default function TaskBottomPanel({ task, result, onRun, isSubmitting }: TaskBottomPanelProps) {
  const [activeTab, setActiveTab] = useState<"tests" | "errors">("tests")
  const lastResultTokenRef = useRef<string | null>(null)
  const testCases = getTaskTestCases(task)
  const testRows = useMemo(
    () => buildTestRows(testCases, result?.test_results ?? []),
    [testCases, result?.test_results],
  )
  const stats = useMemo(() => countTestStats(testRows), [testRows])
  const errors = useMemo(() => extractPanelErrors(result), [result])

  useEffect(() => {
    if (!result) return
    const token = `${result.job_id ?? result.id ?? "result"}:${result.status}:${errors.length}`
    if (token === lastResultTokenRef.current) return
    lastResultTokenRef.current = token
    if (errors.length > 0) {
      setActiveTab("errors")
    }
  }, [errors.length, result])

  const testsBadge = stats.total > 0 ? `${stats.passed}/${stats.total}` : "0"
  const allTestsPassed = stats.total > 0 && stats.passed === stats.total
  const overallSuccess = result?.success === true
  const checkFailed = result?.success === false

  return (
    <div className="flex h-full min-h-0 flex-col border-t border-border bg-surface">
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-[#0c111a] px-4">
        <div className="tp-tabbar mb-0 flex-1 border-b-0">
          <button
            type="button"
            className={cn(activeTab === "tests" && "on")}
            onClick={() => setActiveTab("tests")}
          >
            Тесты
          </button>
          <button
            type="button"
            className={cn(activeTab === "errors" && "on")}
            onClick={() => setActiveTab("errors")}
            data-testid="task-errors-tab"
          >
            Ошибки
            {errors.length > 0 ? (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger-soft px-1.5 text-[10px] font-bold text-[#ff8198]">
                {errors.length}
              </span>
            ) : null}
          </button>
        </div>
        <Button
          type="button"
          onClick={onRun}
          disabled={isSubmitting}
          className="my-2 h-9 gap-1.5"
          data-testid="task-check-btn"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          {isSubmitting ? "Проверка…" : "▸ Прогнать"}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {activeTab === "tests" ? (
          testRows.length === 0 ? (
            <div className="space-y-3">
              {errors.length > 0 ? (
                <div className="rounded-lg border border-danger/30 bg-danger-soft/40 px-3 py-2 text-sm text-[#ff8198]">
                  <p className="font-medium">Ошибка компиляции</p>
                  <p className="mt-1 whitespace-pre-wrap font-mono text-xs">{errors[0]?.text}</p>
                  {errors.length > 1 ? (
                    <button
                      type="button"
                      className="mt-2 text-xs font-semibold underline"
                      onClick={() => setActiveTab("errors")}
                    >
                      Показать все ошибки ({errors.length})
                    </button>
                  ) : null}
                </div>
              ) : checkFailed ? (
                <p className="text-sm text-ink-muted">
                  Проверка завершилась неудачно. Откройте вкладку «Ошибки».
                </p>
              ) : (
                <p className="text-sm text-ink-muted">Тесты не заданы.</p>
              )}
            </div>
          ) : (
            <>
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <b className="text-[13.5px]">Тесты</b>
                <Badge
                  variant={overallSuccess ? "default" : "outline"}
                  data-testid={overallSuccess ? "result-success-badge" : undefined}
                  className={cn(
                    overallSuccess && "border-lime/30 bg-lime-soft text-lime",
                    !overallSuccess && stats.failed > 0 && "border-warning/35 text-warning",
                    !overallSuccess && stats.failed === 0 && allTestsPassed && "border-warning/35 text-warning",
                  )}
                >
                  {overallSuccess ? "Успех" : allTestsPassed ? "Проверьте структуры" : `${testsBadge} пройдено`}
                </Badge>
              </div>

              <div className="mb-3 flex flex-wrap gap-1.5">
                {testRows.map((row) => {
                  const passed = row.status === "PASSED"
                  const failed = row.status === "FAILED" || row.status === "ERROR"
                  return (
                    <span
                      key={row.case}
                      className={cn(
                        "inline-flex h-[26px] w-[26px] items-center justify-center rounded-lg border text-xs font-semibold",
                        passed && "border-lime/30 bg-lime-soft text-lime",
                        failed && "border-danger/35 bg-danger-soft text-[#ff8198]",
                        !passed && !failed && "border-[#333d4f] bg-surface-2 text-ink-muted",
                      )}
                    >
                      {row.case}
                    </span>
                  )
                })}
              </div>

              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wide text-ink-faint">
                    <th className="w-12 border-b border-border py-2 px-2 text-left font-semibold">#</th>
                    <th className="border-b border-border py-2 px-2 text-left font-semibold">Вход</th>
                    <th className="w-32 border-b border-border py-2 px-2 text-left font-semibold">Ожидаемый</th>
                    <th className="w-32 border-b border-border py-2 px-2 text-left font-semibold">Получили</th>
                    <th className="w-20 border-b border-border py-2 px-2 text-right font-semibold">Время</th>
                    <th className="w-28 border-b border-border py-2 px-2 text-right font-semibold">Результат</th>
                  </tr>
                </thead>
                <tbody>
                  {testRows.map((row) => {
                    const isFailed = row.status === "FAILED" || row.status === "ERROR"
                    const isPassed = row.status === "PASSED"
                    return (
                      <tr
                        key={row.case}
                        className={cn(
                          "border-b border-border last:border-b-0",
                          isFailed && "bg-danger-soft/30",
                          isPassed && "bg-lime-soft/20",
                        )}
                      >
                        <td className="py-1.5 px-2 font-mono text-ink-faint">#{row.case}</td>
                        <td className="py-1.5 px-2 font-mono truncate" title={row.input}>
                          {row.input || "—"}
                        </td>
                        <td className="py-1.5 px-2 font-mono text-lime">{row.expected || "—"}</td>
                        <td
                          className={cn(
                            "py-1.5 px-2 font-mono",
                            isFailed && "text-[#ff8198]",
                            isPassed && "text-lime",
                            !isFailed && !isPassed && "text-ink-muted",
                          )}
                        >
                          {row.actual || (row.status === "PENDING" ? "—" : "")}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono text-xs text-ink-faint">
                          {formatTestDuration(row.durationMs)}
                        </td>
                        <td className="py-1.5 px-2 text-right">
                          <ResultBadge status={row.status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="mt-3 text-xs text-ink-muted">
                Пройдено {stats.passed} из {stats.total}
                {stats.failed === 0 && stats.pending === stats.total
                  ? " · нажмите «Прогнать», чтобы проверить решение"
                  : null}
              </div>
            </>
          )
        ) : errors.length === 0 ? (
          <p className="text-sm text-ink-muted">Ошибок нет.</p>
        ) : (
          <ul className="space-y-2">
            {errors.map((error, index) => {
              const isConstruction = error.tone === "purple" || error.source === "Структуры"
              return (
              <li
                key={`${error.source}-${error.type}-${index}`}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm",
                  isConstruction
                    ? "border-purple/35 bg-purple-soft/40"
                    : "border-danger/30 bg-danger-soft/40",
                )}
              >
                <div className="mb-1 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
                  <span>{error.source}</span>
                  {isConstruction ? (
                    <span className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[9px] text-ink-muted">
                      CONSTRUCTION
                    </span>
                  ) : null}
                </div>
                <pre
                  className={cn(
                    "whitespace-pre-wrap font-mono text-xs",
                    isConstruction ? "text-[#cbb6ff]" : "text-[#ff8198]",
                  )}
                >
                  {error.text}
                </pre>
              </li>
            )})}
          </ul>
        )}
      </div>
    </div>
  )
}
