import { describe, expect, it } from "vitest"

import { formatExecutionIssue, formatExecutionIssues, resolveCheckErrorsSectionTitle } from "./executionErrors"

describe("formatExecutionIssue", () => {
  it("formats ruff linter output without raw json", () => {
    const issue = formatExecutionIssue({
      type: "LINTER",
      text: "/tmp/ct-local-k03286s6/solution.py:1:7: Q000 [*] Single quotes found but double quotes preferred",
    })

    expect(issue?.summary).toBe("Строка 1, колонка 7: используйте двойные кавычки вместо одинарных")
    expect(issue?.detail).toBeUndefined()
  })

  it("drops ignorable linter summaries", () => {
    expect(
      formatExecutionIssues([
        { type: "LINTER", text: "Found 2 errors." },
        {
          type: "LINTER",
          text: "/tmp/ct-local-k03286s6/solution.py:1:15: W292 [*] No newline at end of file",
        },
        { type: "LINTER", text: "[*] 2 fixable with the `--fix` option." },
      ]),
    ).toEqual([
      {
        summary: "Строка 1, колонка 15: добавьте пустую строку в конец файла",
      },
    ])
  })

  it("maps flowchart validation codes to student-friendly text", () => {
    expect(
      formatExecutionIssue({
        type: "FLOW_SEQUENCE_MISMATCH",
        text: "FLOW_SEQUENCE_MISMATCH",
      })?.summary,
    ).toContain("Проверьте общий порядок схемы")
  })

  it("uses server-provided flow source mismatch text", () => {
    const issue = formatExecutionIssue({
      type: "FLOW_SOURCE_MISMATCH",
      text: "В блоке «Цикл» укажите условие range(3), как в программе.",
    })

    expect(issue?.summary).toContain("range(3)")
  })

  it("falls back for bare flow source mismatch code", () => {
    const issue = formatExecutionIssue({
      type: "FLOW_SOURCE_MISMATCH",
      text: "FLOW_SOURCE_MISMATCH",
    })

    expect(issue?.summary).toContain("не совпадает с программой")
  })

  it("shows flow error detail hints when provided", () => {
    const issue = formatExecutionIssue({
      type: "FLOW_LOOP_BACK_EDGE",
      text: "Нужна обратная связь.",
      detail: "Проведите стрелку из тела цикла обратно в блок «Цикл».",
    })

    expect(issue?.summary).toBe("Нужна обратная связь.")
    expect(issue?.detail).toContain("обратно")
  })

  it("groups gcc compiler diagnostics into one readable issue", () => {
    const issues = formatExecutionIssues([
      { type: "COMPILER", text: "/solution.cpp: In function 'int main()':" },
      {
        type: "COMPILER",
        text: "/solution.cpp:4:10: error: 'cout' is not a member of 'std'",
      },
      { type: "COMPILER", text: "4 | std::cout << \"Hello, World!\" << std::endl;" },
      { type: "COMPILER", text: "  |          ^~~~" },
      {
        type: "COMPILER",
        text:
          "/solution.cpp:1:1: note: 'std::cout' is defined in header '<iostream>'; this is probably fixable by adding '#include <iostream>'",
      },
      { type: "COMPILER", text: "+++ |+#include <iostream>" },
      { type: "COMPILER", text: "1 |" },
      {
        type: "COMPILER",
        text: "/solution.cpp:4:42: error: 'endl' is not a member of 'std'",
      },
    ])

    expect(issues).toHaveLength(2)
    expect(issues[0]?.summary).toBe(
      "Строка 4, колонка 10: «cout» не является членом std. Подсказка: добавьте строку #include <iostream>",
    )
    expect(issues[0]?.detail).toContain("std::cout")
    expect(issues[1]?.summary).toBe("Строка 4, колонка 42: «endl» не является членом std")
  })

  it("formats pascal compiler diagnostics with line and column", () => {
    const issues = formatExecutionIssues([
      { type: "COMPILER", text: "Free Pascal Compiler version 3.2.2 for aarch64" },
      { type: "COMPILER", text: 'source.pas(1,26) Error: Identifier not found "x"' },
      { type: "COMPILER", text: "Fatal: Compilation aborted" },
    ])

    expect(issues).toHaveLength(1)
    expect(issues[0]?.summary).toBe("Строка 1, колонка 26: не найден идентификатор «x»")
    expect(issues[0]?.detail).toBeUndefined()
  })

  it("shows generic summary with raw detail for unknown compiler output", () => {
    const issue = formatExecutionIssue({
      type: "COMPILER",
      text: "weird compiler explosion at 0xdeadbeef",
    })

    expect(issue?.summary).toBe("Не удалось скомпилировать программу.")
    expect(issue?.detail).toBe("weird compiler explosion at 0xdeadbeef")
  })

  it("keeps already localized backend messages as summary", () => {
    const issue = formatExecutionIssue({
      type: "CONSTRUCTION",
      text: "Отсутствует конструкция: цикл for",
    })

    expect(issue).toEqual({
      summary: "Отсутствует конструкция: цикл for",
    })
  })

  it("uses generic semantic fallback with runtime details", () => {
    const issue = formatExecutionIssue({
      type: "SEMANTIC",
      text: "Traceback (most recent call last):\n  File \"solution.py\", line 2, in <module>\n    raise ValueError('boom')",
    })

    expect(issue?.summary).toBe("Программа не прошла проверку на тестах.")
    expect(issue?.detail).toContain("Traceback")
  })

  it("formats java compiler diagnostics with line number", () => {
    const issues = formatExecutionIssues([
      { type: "COMPILER", text: "/tmp/home/abc/solution.java:3: error: cannot find symbol" },
    ])

    expect(issues).toHaveLength(1)
    expect(issues[0]?.summary).toBe("Строка 3: не найден символ")
  })

  it("humanizes missing local compiler configuration", () => {
    const issue = formatExecutionIssue({
      type: "COMPILER",
      text: "Local compile is not configured for language 'csharp'",
    })

    expect(issue?.summary).toBe("компилятор для этого языка не настроен на сервере")
  })

  it("humanizes missing toolchain message from backend", () => {
    const issue = formatExecutionIssue({
      type: "COMPILER",
      text: "Компилятор 'fpc' не установлен на сервере",
    })

    expect(issue?.summary).toBe("Компилятор 'fpc' не установлен на сервере")
  })

  it("humanizes time limit messages in execution issues", () => {
    const issue = formatExecutionIssue({
      type: "EXECUTION",
      text: "Time limit exceeded (5s)",
    })

    expect(issue?.summary).toBe("Превышен лимит времени выполнения (5 с).")
  })

  it("hides infrastructure errors from students", () => {
    const issues = formatExecutionIssues([
      { type: "COMPILER", text: "Docker command failed with exit code 1" },
    ])

    expect(issues).toEqual([
      {
        summary: "Не удалось скомпилировать программу.",
      },
    ])
  })

  it("localizes validation errors from legacy english backend messages", () => {
    const issue = formatExecutionIssue({
      type: "VALIDATION",
      text: "Blocks are in the wrong order",
    })

    expect(issue).toEqual({
      summary: "Блоки расставлены в неверном порядке.",
    })
  })

  it("uses validation section title for validation-only errors", () => {
    expect(
      resolveCheckErrorsSectionTitle([{ type: "VALIDATION", text: "Блоки расставлены в неверном порядке." }]),
    ).toBe("Ошибки проверки")
  })

  it("keeps localized backend compile summary without infrastructure detail", () => {
    const issue = formatExecutionIssue({
      type: "COMPILER",
      text: "Не удалось скомпилировать программу.",
    })

    expect(issue).toEqual({
      summary: "Не удалось скомпилировать программу.",
    })
  })
})
