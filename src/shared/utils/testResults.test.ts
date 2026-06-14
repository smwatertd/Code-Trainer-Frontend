import { describe, expect, it } from "vitest"

import { formatTestResult, formatTestResults } from "./testResults"

describe("formatTestResult", () => {
  it("formats passed test as green success message", () => {
    expect(
      formatTestResult({
        case: 1,
        status: "PASSED",
        expected: "42",
        actual: "42",
      }),
    ).toEqual({
      case: 1,
      status: "PASSED",
      tone: "success",
      summary: "Тест 1: пройден",
    })
  })

  it("formats failed test with expected and actual output", () => {
    const result = formatTestResult({
      case: 2,
      status: "FAILED",
      expected: "10",
      actual: "9",
      message: "Incorrect output",
    })

    expect(result.summary).toBe("Тест 2: неверный ответ")
    expect(result.tone).toBe("warning")
    expect(result.detail).toContain("Ожидалось:")
    expect(result.detail).toContain("10")
    expect(result.detail).toContain("Получено:")
    expect(result.detail).toContain("9")
  })

  it("formats runtime error test with generic summary and details", () => {
    const result = formatTestResult({
      case: 1,
      status: "ERROR",
      message: "Time limit exceeded (5s)",
      inputs: "1\n2",
    })

    expect(result.summary).toBe("Тест 1: превышен лимит времени")
    expect(result.tone).toBe("error")
    expect(result.detail).toContain("Входные данные:")
  })

  it("formats all tests preserving order", () => {
    const results = formatTestResults([
      { case: 1, status: "PASSED" },
      { case: 2, status: "FAILED", expected: "a", actual: "b" },
    ])

    expect(results).toHaveLength(2)
    expect(results[0]?.tone).toBe("success")
    expect(results[1]?.tone).toBe("warning")
  })

  it("humanizes compile errors in test runtime messages", () => {
    const result = formatTestResult({
      case: 1,
      status: "ERROR",
      message: "Компилятор 'fpc' не установлен на сервере",
    })

    expect(result.summary).toBe("Тест 1: компилятор fpc не установлен на сервере")
    expect(result.tone).toBe("error")
  })

  it("humanizes missing compile configuration in test runtime messages", () => {
    const result = formatTestResult({
      case: 1,
      status: "ERROR",
      message: "Local compile is not configured for language 'csharp'",
    })

    expect(result.summary).toBe("Тест 1: компилятор для этого языка не настроен на сервере")
    expect(result.tone).toBe("error")
  })

  it("normalizes legacy passed flag to PASSED", () => {
    const result = formatTestResult({ passed: true })

    expect(result.status).toBe("PASSED")
    expect(result.summary).toBe("Тест 1: пройден")
  })
})
