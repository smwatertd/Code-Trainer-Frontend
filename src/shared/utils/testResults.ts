import { humanizeCompilerMessage, sanitizeExecutionPaths } from "@/shared/utils/executionErrors"
import type { ResultTone } from "@/shared/utils/resultPresentation"
import { toneForTestStatus } from "@/shared/utils/resultPresentation"

type TestResultLike = Record<string, unknown>

export type FormattedTestResult = {
  case: number
  status: string
  tone: ResultTone
  summary: string
  detail?: string
}

function normalizeStatus(test: TestResultLike): string {
  const status = String(test.status ?? "").trim().toUpperCase()
  if (status) return status
  return test.passed ? "PASSED" : "FAILED"
}

function buildWrongOutputDetail(test: TestResultLike): string | undefined {
  const expected = String(test.expected ?? "").trim()
  const actual = String(test.actual ?? test.output ?? "").trim()
  const lines: string[] = []
  if (expected) lines.push(`Ожидалось:\n${expected}`)
  if (actual) lines.push(`Получено:\n${actual}`)
  return lines.length ? lines.join("\n\n") : undefined
}

function buildRuntimeDetail(test: TestResultLike): string | undefined {
  const message = sanitizeExecutionPaths(String(test.message ?? test.actual ?? "").trim())
  const inputs = String(test.inputs ?? test.input ?? "").trim()
  const lines: string[] = []
  if (inputs) lines.push(`Входные данные:\n${inputs}`)
  if (message) lines.push(message)
  return lines.length ? lines.join("\n\n") : undefined
}

export function formatTestResult(test: TestResultLike, index = 0): FormattedTestResult {
  const caseNumber = Number(test.case ?? index + 1)
  const status = normalizeStatus(test)
  const tone = toneForTestStatus(status)
  const message = String(test.message ?? "").trim()

  if (status === "PASSED") {
    const durationMs = Number(test.duration_ms ?? 0)
    const timing = durationMs > 0 ? ` (${durationMs} мс)` : ""
    return {
      case: caseNumber,
      status,
      tone,
      summary: `Тест ${caseNumber}: пройден${timing}`,
    }
  }

  if (/time limit exceeded/i.test(message)) {
    return {
      case: caseNumber,
      status: "ERROR",
      tone: "error",
      summary: `Тест ${caseNumber}: превышен лимит времени`,
      detail: buildRuntimeDetail(test),
    }
  }

  if (status === "ERROR") {
    const humanized = humanizeCompilerMessage(message)
    return {
      case: caseNumber,
      status,
      tone,
      summary:
        humanized !== message
          ? `Тест ${caseNumber}: ${humanized}`
          : `Тест ${caseNumber}: ошибка при выполнении`,
      detail: buildRuntimeDetail(test),
    }
  }

  const wrongOutputDetail = buildWrongOutputDetail(test)
  return {
    case: caseNumber,
    status,
    tone,
    summary: `Тест ${caseNumber}: неверный ответ`,
    detail: wrongOutputDetail ?? (message ? sanitizeExecutionPaths(message) : undefined),
  }
}

export function formatTestResults(tests: TestResultLike[] = []): FormattedTestResult[] {
  return tests.map((test, index) => formatTestResult(test, index))
}
