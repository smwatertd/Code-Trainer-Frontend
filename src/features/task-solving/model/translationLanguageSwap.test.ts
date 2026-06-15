import { describe, expect, it } from "vitest"
import type { TaskDetail } from "@/shared/types/api"
import { getLearningStarterCode, resolveLearningCodeAfterSwap } from "@/features/task-solving/model/solverState"

/** Task 2 «Сохранить возраст» — debug translation with Pascal template. */
function task2Age(): TaskDetail {
  return {
    id: 2,
    title: "Сохранить возраст",
    description: "",
    difficulty: "medium",
    task_type: "translation",
    payload: {
      kind: "debug",
      target_language: "pascal",
      source_language: "python",
      source_code: "age = int(input())\nprint(age)",
      template: "var age: integer;\nbegin\n  age = 18;\n  writeln(age);\nend.",
      code_examples: {
        python: "age = int(input())\nprint(age)",
        cpp: "int age;\nstd::cin >> age;\nstd::cout << age << \"\\n\";",
        pascal: "var age: integer;\nbegin\n  readln(age);\n  writeln(age);\nend.",
      },
    },
  } as TaskDetail
}

describe("translationLanguageSwap", () => {
  const task = task2Age()

  it("prefills pascal debug template only for target language", () => {
    expect(getLearningStarterCode(task, "pascal")).toContain("writeln(age)")
    expect(getLearningStarterCode(task, "cpp")).toBe("")
    expect(getLearningStarterCode(task, "python")).toBe("")
  })

  it("simulates swap: debug task uses reference fallback when starter is empty", () => {
    let known = "cpp"
    let learning = "pascal"
    let code = getLearningStarterCode(task, learning)

    expect(code).toContain("begin")

    ;[known, learning] = [learning, known]
    code = resolveLearningCodeAfterSwap(task, learning)

    expect(known).toBe("pascal")
    expect(learning).toBe("cpp")
    expect(code).toContain("std::cin")
    expect(code).not.toBe("")
  })

  it("simulates swap back: pascal template returns after switching to pascal", () => {
    let learning = "cpp"
    let code = getLearningStarterCode(task, learning)
    expect(code).toBe("")

    learning = "pascal"
    code = getLearningStarterCode(task, learning)
    expect(code).toContain("age = 18")
  })

  it("uses per-language template from language_variants when present", () => {
    const variantTask: TaskDetail = {
      ...task,
      payload: {
        ...task.payload,
        target_language: "pascal",
        template: "legacy pascal template",
        language_variants: {
          cpp: { template: "int age;\n// fix me" },
          pascal: { template: "var age: integer;" },
        },
      },
    }

    expect(getLearningStarterCode(variantTask, "cpp")).toBe("int age;\n// fix me")
    expect(getLearningStarterCode(variantTask, "pascal")).toBe("var age: integer;")
    expect(getLearningStarterCode(variantTask, "python")).toBe("")
  })
})
