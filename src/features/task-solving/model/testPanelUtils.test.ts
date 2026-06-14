import { describe, expect, it } from "vitest"
import type { CheckResult } from "@/shared/types/api"
import {
  buildTestRows,
  countTestStats,
  extractPanelErrors,
  formatTestDuration,
} from "@/features/task-solving/model/testPanelUtils"

describe("formatTestDuration", () => {
  it("formats milliseconds and seconds", () => {
    expect(formatTestDuration(undefined)).toBe("—")
    expect(formatTestDuration(-1)).toBe("—")
    expect(formatTestDuration(0)).toBe("0 мс")
    expect(formatTestDuration(42)).toBe("42 мс")
    expect(formatTestDuration(1500)).toBe("1.50 с")
  })
})

describe("buildTestRows", () => {
  it("accepts legacy input field names", () => {
    const rows = buildTestRows([{ input: "5", expected: "pos" }], [])
    expect(rows[0].input).toBe("5")
    expect(rows[0].expected).toBe("pos")
  })

  it("fills missing actual on failed run", () => {
    const rows = buildTestRows(
      [{ inputs: "", output: "Hello" }],
      [{ case: 1, status: "FAILED", actual: "", message: "" }],
    )
    expect(rows[0].actual).toBe("Нет вывода (ожидалось: Hello)")
    expect(rows[0].status).toBe("FAILED")
  })

  it("uses message when actual is empty on error", () => {
    const rows = buildTestRows(
      [{ inputs: "", output: "1" }],
      [{ case: 1, status: "ERROR", actual: "", message: "division by zero" }],
    )
    expect(rows[0].actual).toBe("division by zero")
  })

  it("reads duration from alternate fields", () => {
    const rows = buildTestRows(
      [{ inputs: "", output: "1" }],
      [{ case: 1, status: "PASSED", actual: "1", time_ms: 77 }],
    )
    expect(rows[0].durationMs).toBe(77)
  })
})

describe("countTestStats", () => {
  it("counts mixed statuses", () => {
    const stats = countTestStats([
      { case: 1, input: "", expected: "", actual: "", status: "PASSED", message: "", durationMs: null },
      { case: 2, input: "", expected: "", actual: "", status: "FAILED", message: "", durationMs: null },
      { case: 3, input: "", expected: "", actual: "", status: "ERROR", message: "", durationMs: null },
      { case: 4, input: "", expected: "", actual: "", status: "PENDING", message: "", durationMs: null },
    ])
    expect(stats).toEqual({ total: 4, passed: 1, failed: 2, pending: 1 })
  })
})

describe("extractPanelErrors", () => {
  it("returns empty list for null result", () => {
    expect(extractPanelErrors(null)).toEqual([])
  })

  it("maps compiler, linter and pattern errors", () => {
    const result: CheckResult = {
      status: "FAILED",
      compiler_errors: [{ type: "SYNTAX", message: "Line 1: bad indent", line: 1 }],
      linter_errors: [{ type: "LINT", text: "unused variable" }],
      pattern_errors: [{ type: "FLOW_TEXT_MISMATCH", message: "wrong block text" }],
    }

    const errors = extractPanelErrors(result)
    expect(errors).toHaveLength(3)
    expect(errors[0]).toMatchObject({ source: "Компилятор", line: 1 })
    expect(errors[0]?.text).toContain("Line 1: bad indent")
    expect(errors[1]).toMatchObject({ source: "Линтер" })
    expect(errors[1]?.text).toContain("unused variable")
    expect(errors[2]).toMatchObject({ source: "Структуры", text: "wrong block text" })
  })

  it("skips blank error messages", () => {
    const result: CheckResult = {
      status: "FAILED",
      compiler_errors: [{ message: "   " }, { message: "real error" }],
    }
    expect(extractPanelErrors(result)).toHaveLength(1)
  })
})
