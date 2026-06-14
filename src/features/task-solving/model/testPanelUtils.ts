import type { CheckResult, TestResult } from "@/shared/types/api"
import { formatExecutionIssue } from "@/shared/utils/executionErrors"

export type ExecutionStatus = "PENDING" | "PASSED" | "FAILED" | "ERROR" | string

export interface TestPanelRow {
  case: number
  input: string
  expected: string
  actual: string
  status: ExecutionStatus
  message: string
  durationMs: number | null
}

export interface TestStats {
  total: number
  passed: number
  failed: number
  pending: number
}

export interface PanelError {
  type?: string
  text?: string
  line?: number
  column?: number
  source?: string
  tone?: string
  sourceLabel?: string
}

function formatTestValue(value: unknown): string {
  if (value == null) return ""
  if (typeof value === "string") return value
  return String(value)
}

export function formatTestDuration(durationMs: unknown): string {
  const ms = Number(durationMs)
  if (!Number.isFinite(ms) || ms < 0) return "—"
  if (ms === 0) return "0 мс"
  if (ms < 1000) return `${Math.round(ms)} мс`
  return `${(ms / 1000).toFixed(2)} с`
}

function isEmptyOutput(value: unknown): boolean {
  const text = String(value ?? "").trim()
  return !text || text === "—" || text === "-"
}

function sanitizeTestActual(
  actual: unknown,
  message: unknown,
  status: ExecutionStatus,
  expected = "",
): string {
  let text = String(actual ?? "").trim()
  const msg = String(message ?? "").trim()
  if (!text && msg) text = msg
  if (isEmptyOutput(text) && (status === "FAILED" || status === "ERROR")) {
    const expectedText = String(expected ?? "").trim()
    text = msg || (expectedText ? `Нет вывода (ожидалось: ${expectedText})` : "(пустой вывод)")
  }
  return text
}

export function buildTestRows(
  testCases: Array<{ inputs?: string; input?: string; output?: string; expected?: string }> = [],
  results: TestResult[] = [],
): TestPanelRow[] {
  const resultByCase = new Map(
    results.map((row, index) => [Number(row.case ?? index + 1), row]),
  )

  return testCases.map((testCase, index) => {
    const caseNum = index + 1
    const result = resultByCase.get(caseNum)
    const status = String(result?.status ?? "PENDING").toUpperCase()
    const expected = formatTestValue(testCase.output ?? testCase.expected)
    const actual = sanitizeTestActual(
      result?.actual ?? result?.output,
      result?.message,
      status,
      expected,
    )
    return {
      case: caseNum,
      input: formatTestValue(testCase.inputs ?? testCase.input),
      expected,
      actual,
      status,
      message: String(result?.message ?? ""),
      durationMs: Number(result?.duration_ms ?? result?.time_ms ?? NaN) || null,
    }
  })
}

export function countTestStats(rows: TestPanelRow[] = []): TestStats {
  const total = rows.length
  const passed = rows.filter((row) => row.status === "PASSED").length
  const failed = rows.filter((row) => row.status === "FAILED" || row.status === "ERROR").length
  const pending = total - passed - failed
  return { total, passed, failed, pending }
}

function panelTextFromIssue(item: Record<string, unknown>): string {
  const formatted = formatExecutionIssue(item)
  if (formatted) {
    return formatted.detail ? `${formatted.summary}\n${formatted.detail}` : formatted.summary
  }
  return String(item.message ?? item.text ?? "")
}

export function extractPanelErrors(result: CheckResult | null): PanelError[] {
  if (!result) return []
  const rows: PanelError[] = []

  for (const item of result.compiler_errors ?? []) {
    rows.push({
      type: String(item.type ?? "COMPILER"),
      text: panelTextFromIssue(item as Record<string, unknown>),
      line: typeof item.line === "number" ? item.line : undefined,
      column: typeof item.column === "number" ? item.column : undefined,
      source: "Компилятор",
      tone: "danger",
    })
  }
  for (const item of result.linter_errors ?? []) {
    rows.push({
      type: String(item.type ?? "LINT"),
      text: panelTextFromIssue(item as Record<string, unknown>),
      line: typeof item.line === "number" ? item.line : undefined,
      source: "Линтер",
      tone: "warning",
    })
  }
  for (const item of result.pattern_errors ?? []) {
    rows.push({
      type: String(item.type ?? "PATTERN"),
      text: panelTextFromIssue(item as Record<string, unknown>),
      source: "Структуры",
      tone: "purple",
    })
  }

  return rows.filter((row) => String(row.text ?? "").trim())
}
