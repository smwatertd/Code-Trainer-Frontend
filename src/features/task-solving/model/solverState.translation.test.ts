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
  it("starts with empty code and non-source language", () => {
    const initial = createInitialSolverState(TRANSLATION, ["python", "cpp", "pascal"])

    expect(initial.code).toBe("")
    expect(initial.language).toBe("cpp")
  })
})
