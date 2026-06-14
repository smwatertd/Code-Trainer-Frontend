import { describe, expect, it } from "vitest"

import { createInitialSolverState } from "./solverState"
import type { TaskDetail } from "@/shared/types/api"

const TRANSLATION: TaskDetail = {
  id: 1,
  title: "Translation",
  description: "desc",
  difficulty: "easy",
  task_type: "translation",
  payload: {
    source_code: "print('Hello')",
    source_language: "python",
    target_language: "cpp",
  },
}

describe("createInitialSolverState translation", () => {
  it("starts with empty code when no template", () => {
    const initial = createInitialSolverState(TRANSLATION, ["python", "cpp", "pascal"])

    expect(initial.code).toBe("")
    expect(initial.language).toBe("cpp")
  })

  it("prefills buggy template for debug translation tasks", () => {
    const debugTask: TaskDetail = {
      ...TRANSLATION,
      payload: {
        ...TRANSLATION.payload,
        target_language: "pascal",
        template: "var age: integer;\nbegin\n  age = 18;\nend.",
      },
    }
    const initial = createInitialSolverState(debugTask, ["python", "pascal"])

    expect(initial.code).toContain("age = 18")
    expect(initial.language).toBe("pascal")
  })
})
