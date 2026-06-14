import type { CheckResult } from "@/shared/types/api"
import type { SubmissionHistoryItem } from "@/shared/api/submissionsClient"
import SubmissionHistoryPanel from "@/features/submissions/ui/SubmissionHistoryPanel"
import { cn } from "@/shared/lib/utils"
import { Link } from "react-router-dom"
import { formatExecutionIssues, resolveCheckErrorsSectionTitle } from "@/shared/utils/executionErrors"
import {
  ISSUE_SECTION_TONES,
  RESULT_TONE_STYLES,
  type ResultTone,
} from "@/shared/utils/resultPresentation"
import { formatTestResults } from "@/shared/utils/testResults"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent } from "@/shared/ui/card"
import { labelJobStatus, labelSubmissionOutcome } from "@/shared/utils/labels"

type ResultsPanelProps = {
  result: CheckResult | null
  submitError?: string | null
  pollError?: string | null
  isGuest?: boolean
  taskId?: number | null
  showHistory?: boolean
  selectedSubmissionId?: number | null
  onSelectHistoryItem?: (item: SubmissionHistoryItem) => void
}

function IssueList({
  title,
  items,
  tone,
}: {
  title: string
  items: Array<Record<string, unknown>>
  tone: ResultTone
}) {
  const messages = formatExecutionIssues(items)
  if (!messages.length) return null

  const styles = RESULT_TONE_STYLES[tone]

  return (
    <div>
      <h4 className={cn("mb-2 text-sm font-semibold", styles.title)}>{title}</h4>
      <ul className="space-y-2 text-sm">
        {messages.map((message, index) => (
          <li key={index} className={cn("rounded border px-3 py-2", styles.card)}>
            <p className="text-foreground">{message.summary}</p>
            {message.detail ? (
              <pre className={cn("mt-2 whitespace-pre-wrap text-xs", styles.detail)}>
                {message.detail}
              </pre>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

function TestResultsList({ tests }: { tests: Array<Record<string, unknown>> }) {
  const formatted = formatTestResults(tests)
  if (!formatted.length) return null

  const failedCount = formatted.filter((test) => test.status !== "PASSED").length
  const tone: ResultTone = failedCount === 0 ? "success" : failedCount === formatted.length ? "error" : "warning"
  const styles = RESULT_TONE_STYLES[tone]

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <h4 className={cn("text-sm font-semibold", styles.title)}>Тесты</h4>
        <Badge className={styles.badge}>
          {formatted.length - failedCount}/{formatted.length} пройдено
        </Badge>
      </div>
      <ul className="space-y-2 text-sm">
        {formatted.map((test) => {
          const testStyles = RESULT_TONE_STYLES[test.tone]
          return (
            <li
              key={test.case}
              className={cn("rounded border px-3 py-2", testStyles.card)}
              data-testid={`test-result-${test.case}`}
            >
              <div className="flex items-center gap-2">
                <Badge className={testStyles.badge}>
                  {test.status === "PASSED" ? "Пройден" : test.status === "ERROR" ? "Ошибка" : "Неверно"}
                </Badge>
                <p className="text-foreground">{test.summary}</p>
              </div>
              {test.detail ? (
                <pre className={cn("mt-2 whitespace-pre-wrap text-xs", testStyles.detail)}>
                  {test.detail}
                </pre>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function ResultsPanel({
  result,
  submitError,
  pollError,
  isGuest = false,
  taskId = null,
  showHistory = false,
  selectedSubmissionId = null,
  onSelectHistoryItem,
}: ResultsPanelProps) {
  const showHistoryBlock = showHistory && taskId != null

  return (
    <Card className="flex h-full min-h-0 w-full flex-1 flex-col" data-testid="results-panel">
      <CardContent
        className={cn(
          "grid min-h-0 flex-1 gap-4 overflow-hidden p-4",
          showHistoryBlock ? "grid-rows-[minmax(0,1fr)_minmax(0,1fr)]" : "grid-rows-1",
        )}
      >
        <div className="min-h-0 space-y-4 overflow-y-auto pr-1 app-scrollbar">
          {!result && !submitError && !pollError ? (
            <p className="text-sm text-muted-foreground">
              {showHistoryBlock
                ? "Отправьте решение или выберите попытку в истории ниже."
                : "Результаты проверки появятся после отправки решения."}
            </p>
          ) : null}

          {submitError ? (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          ) : null}
          {pollError ? (
            <Alert variant="destructive">
              <AlertDescription>{pollError}</AlertDescription>
            </Alert>
          ) : null}
          {result ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">Статус:</span>
                <Badge variant="outline">{labelJobStatus(result.status)}</Badge>
                {result.success != null ? (
                  <Badge
                    className={
                      result.success
                        ? RESULT_TONE_STYLES.success.badge
                        : RESULT_TONE_STYLES.error.badge
                    }
                    data-testid="result-success-badge"
                  >
                    {labelSubmissionOutcome(result.success)}
                  </Badge>
                ) : null}
              </div>
              {result.errors ? (
                <Alert variant="destructive">
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>{result.errors}</AlertDescription>
                </Alert>
              ) : null}
              <IssueList
                title={resolveCheckErrorsSectionTitle(result.compiler_errors ?? [])}
                items={result.compiler_errors ?? []}
                tone={ISSUE_SECTION_TONES.compiler}
              />
              <IssueList
                title="Ошибки линтера"
                items={result.linter_errors ?? []}
                tone={ISSUE_SECTION_TONES.linter}
              />
              <IssueList
                title="Ошибки паттернов"
                items={result.pattern_errors ?? []}
                tone={ISSUE_SECTION_TONES.pattern}
              />
              <TestResultsList tests={result.test_results ?? []} />
              {isGuest && result.success ? (
                <p className="text-sm text-muted-foreground">
                  Прогресс не сохранён.{" "}
                  <Link to="/register" className="font-medium text-primary hover:underline">
                    Зарегистрируйтесь
                  </Link>
                  , чтобы отслеживать решения.
                </p>
              ) : null}
            </>
          ) : null}
        </div>

        {showHistoryBlock ? (
          <SubmissionHistoryPanel
            className="min-h-0 overflow-hidden border-t border-border pt-4"
            taskId={taskId}
            enabled
            selectedSubmissionId={selectedSubmissionId}
            onSelect={onSelectHistoryItem}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}
