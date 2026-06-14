import { describe, expect, it } from "vitest"

import {
  defaultLanguage,
  isCodeToFlowchartTask,
  isCodingTask,
  isFlowchartTask,
  isWriteFromDescriptionTask,
  resolveSolverLanguage,
  selectableLanguages,
  sourceCode,
  sourceLanguage,
  starterCode,
} from "./taskTypes"
import type { TaskDetail } from "@/shared/types/api"

const FLOWCHART: TaskDetail = {
  id: 3,
  title: "Flowchart",
  description: "desc",
  difficulty: "easy",
  task_type: "task_flowchart_to_code",
  payload: {
    flowchart_mode: "code_to_flowchart",
    source_code: "print('x')",
    source_language: "python",
  },
}

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

const WRITE_FROM_DESCRIPTION: TaskDetail = {
  id: 4,
  title: "For loop",
  description: "Напишите программу с циклом for.",
  difficulty: "easy",
  task_type: "task_write_from_description",
  payload: {
    target_language: "python",
    template: "# ваш код\n",
  },
}

describe("taskTypes flowchart helpers", () => {
  it("detects flowchart tasks", () => {
    expect(isFlowchartTask(FLOWCHART)).toBe(true)
    expect(isFlowchartTask(TRANSLATION)).toBe(false)
  })

  it("detects code_to_flowchart mode", () => {
    expect(isCodeToFlowchartTask(FLOWCHART)).toBe(true)
    expect(
      isCodeToFlowchartTask({
        ...FLOWCHART,
        payload: { ...FLOWCHART.payload, flowchart_mode: "flowchart_to_code" },
      }),
    ).toBe(false)
  })

  it("resolves default language from payload", () => {
    expect(defaultLanguage(FLOWCHART)).toBe("python")
    expect(defaultLanguage(TRANSLATION, ["python", "cpp", "pascal"])).toBe("cpp")
    expect(defaultLanguage(null)).toBe("python")
  })

  it("excludes source language from translation language picker", () => {
    const all = [
      { id: "python", label: "Python" },
      { id: "cpp", label: "C++" },
      { id: "pascal", label: "Pascal" },
    ]
    expect(selectableLanguages(TRANSLATION, all).map((item) => item.id)).toEqual(["cpp", "pascal"])
    expect(resolveSolverLanguage(TRANSLATION, "python", ["cpp", "pascal"])).toBe("cpp")
  })

  it("reads source code", () => {
    expect(sourceCode(FLOWCHART)).toBe("print('x')")
    expect(sourceCode(null)).toBe("")
  })

  it("detects write-from-description tasks", () => {
    expect(isWriteFromDescriptionTask(WRITE_FROM_DESCRIPTION)).toBe(true)
    expect(isWriteFromDescriptionTask(TRANSLATION)).toBe(false)
    expect(isCodingTask(WRITE_FROM_DESCRIPTION)).toBe(true)
    expect(isCodingTask(FLOWCHART)).toBe(false)
  })

  it("uses template as starter code", () => {
    expect(starterCode(TRANSLATION)).toBe("")
    expect(sourceLanguage(TRANSLATION)).toBe("python")
    expect(starterCode(WRITE_FROM_DESCRIPTION)).toBe("# ваш код\n")
    expect(starterCode({ ...WRITE_FROM_DESCRIPTION, payload: { target_language: "python" } })).toBe("")
  })
})
