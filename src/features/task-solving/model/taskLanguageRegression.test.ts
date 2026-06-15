import { describe, expect, it } from "vitest"
import type { TaskDetail } from "@/shared/types/api"
import { getLearningStarterCode } from "@/features/task-solving/model/solverState"
import {
  getCodeExamples,
  getKnownLanguages,
  getLearningLanguages,
  getReferenceCode,
  hasReferencePane,
  resolveKnownLanguage,
  resolveLearningLanguage,
  resolveLearningLanguageBarOptions,
  resolveSubmissionLanguage,
  shouldShowParallelLanguageBar,
  taskWorkingLanguage,
} from "@/features/task-solving/model/studentUiUtils"
import { detectConstructions } from "@/features/task-solving/model/constructionDetector"

const SERVER_LANGS = ["python", "pascal", "cpp", "csharp", "java"]

const TC42_PLACEHOLDER_TASK2: TaskDetail = {
  id: 2,
  title: "Линейный поиск элемента",
  description: "desc",
  difficulty: "easy",
  task_type: "task_fill_placeholders",
  payload: {
    language: "python",
    target_language: "python",
    source_language: "python",
    placeholder_template:
      "n, target = map(int, input().split())\nposition = 0\nfor i in range(1, n + 1):\ncode = int(input())\nif code == ___ and position == 0:\nposition = ___\nprint(position)",
    placeholder_bank: ["target", "code", "position", "i"],
    code_examples: {
      python:
        "n, target = map(int, input().split())\nposition = 0\nfor i in range(1, n + 1):\ncode = int(input())\nif code == target and position == 0:\nposition = i\nprint(position)",
    },
    constructions: ["program_entry", "assignment", "stdin_read", "stdout_write", "counted_loop"],
  },
}

const TC42_DEBUG_TASK4: TaskDetail = {
  id: 4,
  title: "Подсчёт положительных чисел",
  description: "desc",
  difficulty: "easy",
  task_type: "translation",
  payload: {
    kind: "debug",
    source_language: "python",
    source_code:
      "n = int(input())\ncount = 0\nfor _ in range(n):\n    amount = int(input())\n    if amount > 0:\n        count += 1\nprint(count)",
    target_language: "python",
    template:
      "n = int(input())\ncount = 1\nfor _ in range(n):\n    amount = int(input())\n    if amount > 0:\n        count += 1\nprint(count)",
    code_examples: {
      python:
        "n = int(input())\ncount = 0\nfor _ in range(n):\n    amount = int(input())\n    if amount > 0:\n        count += 1\nprint(count)",
      pascal:
        "var n, i, amount, count: integer;\nbegin\nreadln(n);\ncount := 0;\nfor i := 1 to n do\nbegin\nreadln(amount);\nif amount > 0 then count := count + 1;\nend;\nwriteln(count);\nend.",
    },
    constructions: ["program_entry", "assignment", "stdin_read", "stdout_write", "counted_loop"],
  },
}

describe("TC42 language regression", () => {
  it("locks placeholder task to python for learning and submission", () => {
    expect(taskWorkingLanguage(TC42_PLACEHOLDER_TASK2)).toBe("python")
    expect(getLearningLanguages(TC42_PLACEHOLDER_TASK2, SERVER_LANGS)).toEqual(["python"])
    expect(resolveLearningLanguage(TC42_PLACEHOLDER_TASK2, "python", "cpp", SERVER_LANGS)).toBe(
      "python",
    )
    expect(resolveSubmissionLanguage(TC42_PLACEHOLDER_TASK2, "cpp")).toBe("python")
  })

  it("shows language bar for placeholder when multiple reference languages exist", () => {
    const multiRefPlaceholder: TaskDetail = {
      ...TC42_PLACEHOLDER_TASK2,
      payload: {
        ...TC42_PLACEHOLDER_TASK2.payload,
        code_examples: {
          python: TC42_PLACEHOLDER_TASK2.payload.code_examples?.python ?? "",
          pascal: "var n, i, code, target, position: integer;\nbegin\nreadln(n, target);\nend.",
        },
      },
    }
    expect(
      shouldShowParallelLanguageBar(
        multiRefPlaceholder,
        getKnownLanguages(multiRefPlaceholder),
        getLearningLanguages(multiRefPlaceholder, SERVER_LANGS),
      ),
    ).toBe(true)
  })

  it("shows language bar for debug task with multi-language references", () => {
    expect(
      shouldShowParallelLanguageBar(
        TC42_DEBUG_TASK4,
        getKnownLanguages(TC42_DEBUG_TASK4),
        getLearningLanguages(TC42_DEBUG_TASK4, SERVER_LANGS),
      ),
    ).toBe(true)
  })

  it("shows python reference for placeholder task 2", () => {
    expect(getCodeExamples(TC42_PLACEHOLDER_TASK2).python).toContain("if code == target")
    expect(getReferenceCode(TC42_PLACEHOLDER_TASK2, "python")).toContain("position = i")
    expect(hasReferencePane(TC42_PLACEHOLDER_TASK2)).toBe(true)
  })

  it("submits placeholder code as python even if UI language was cpp", () => {
    expect(resolveSubmissionLanguage(TC42_PLACEHOLDER_TASK2, "cpp")).toBe("python")
  })

  it("keeps debug translation in python for editor and checker", () => {
    expect(taskWorkingLanguage(TC42_DEBUG_TASK4)).toBe("python")
    expect(resolveKnownLanguage(TC42_DEBUG_TASK4)).toBe("python")
    expect(resolveLearningLanguage(TC42_DEBUG_TASK4, "python", "pascal", SERVER_LANGS)).toBe(
      "python",
    )
    expect(getLearningStarterCode(TC42_DEBUG_TASK4, "python")).toContain("count = 1")
    expect(getLearningStarterCode(TC42_DEBUG_TASK4, "pascal")).toBe("")
    expect(getReferenceCode(TC42_DEBUG_TASK4, "python")).toContain("count = 0")
    expect(resolveSubmissionLanguage(TC42_DEBUG_TASK4, "pascal")).toBe("python")
  })

  it("keeps debug editor in python when reference language changes", () => {
    expect(
      shouldShowParallelLanguageBar(
        TC42_DEBUG_TASK4,
        getKnownLanguages(TC42_DEBUG_TASK4),
        getLearningLanguages(TC42_DEBUG_TASK4, SERVER_LANGS),
      ),
    ).toBe(true)
  })

  it("detects counted_loop in assembled placeholder solution", () => {
    const code = getReferenceCode(TC42_PLACEHOLDER_TASK2, "python") ?? ""
    const { detected } = detectConstructions(code, "python", [
      "program_entry",
      "assignment",
      "stdin_read",
      "stdout_write",
      "counted_loop",
    ])

    expect(detected.has("counted_loop")).toBe(true)
    expect(detected.has("program_entry")).toBe(true)
    expect(detected.has("stdin_read")).toBe(true)
  })
})
