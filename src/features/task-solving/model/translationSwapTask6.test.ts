import { describe, expect, it } from "vitest"
import type { TaskDetail } from "@/shared/types/api"
import {
  getLearningStarterCode,
  resolveLearningCodeAfterSwap,
} from "@/features/task-solving/model/solverState"
import { isDebugTranslationTask } from "@/shared/utils/taskTypes"
import { labelTaskDetailType } from "@/shared/utils/labels"

/** Task 6 «Поменять две переменные местами» — pure translation, no template. */
function task6Swap(): TaskDetail {
  return {
    id: 6,
    title: "Поменять две переменные местами",
    description: "",
    difficulty: "hard",
    task_type: "translation",
    payload: {
      source_language: "python",
      target_language: "pascal",
      source_code: "a = int(input())\nb = int(input())\nt = a\na = b\nb = t\nprint(a, b)",
      code_examples: {
        python: "a = int(input())\nb = int(input())\nt = a\na = b\nb = t\nprint(a, b)",
        pascal:
          "var a,b,t: integer;\nbegin\n  readln(a,b);\n  t:=a; a:=b; b:=t;\n  writeln(a,' ',b);\nend.",
      },
    },
  } as TaskDetail
}

function simulateTranslationSwap(known: string, learning: string, task: TaskDetail) {
  const nextKnown = learning
  const nextLearning = known
  return {
    known: nextKnown,
    learning: nextLearning,
    code: resolveLearningCodeAfterSwap(task, nextLearning),
  }
}

describe("translationSwapTask6 /tasks/6 pure translation", () => {
  const task = task6Swap()

  it("is not a debug/fix task", () => {
    expect(isDebugTranslationTask(task)).toBe(false)
    expect(labelTaskDetailType(task)).toBe("Перевод программы")
  })

  it("starts with empty learning editor for pascal target", () => {
    expect(getLearningStarterCode(task, "pascal")).toBe("")
  })

  it("swap python↔pascal keeps learning editor empty (user writes translation)", () => {
    const afterSwap = simulateTranslationSwap("python", "pascal", task)

    expect(afterSwap.known).toBe("pascal")
    expect(afterSwap.learning).toBe("python")
    expect(afterSwap.code).toBe("")
    expect(getLearningStarterCode(task, "python")).toBe("")
  })

  it("double swap keeps empty editor for pascal learning", () => {
    const once = simulateTranslationSwap("python", "pascal", task)
    const twice = simulateTranslationSwap(once.known, once.learning, task)

    expect(twice.learning).toBe("pascal")
    expect(twice.code).toBe("")
  })
})
