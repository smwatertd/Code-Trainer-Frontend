import { describe, expect, it } from "vitest"
import type { TaskDetail } from "@/shared/types/api"
import {
  canSwapParallelLanguages,
  getCodeExamples,
  getConstructionLabel,
  getKnownLanguages,
  getLearningLanguages,
  getReferenceCode,
  getTaskConstructions,
  getTaskTestCases,
  getWriteTaskReferenceText,
  hasReferencePane,
  resolveKnownLanguage,
  resolveLearningLanguage,
} from "@/features/task-solving/model/studentUiUtils"
import { buildTestRows, countTestStats } from "@/features/task-solving/model/testPanelUtils"

const TRANSLATION: TaskDetail = {
  id: 1,
  title: "Hello",
  description: "desc",
  difficulty: "easy",
  task_type: "translation",
  payload: {
    source_language: "python",
    source_code: "print('Hello')",
    target_language: "cpp",
    test_cases: [{ inputs: "", output: "Hello" }],
    constructions: ["io"],
    code_examples: { python: "print('Hello')" },
  },
}

const BLOCK_REORDER: TaskDetail = {
  id: 2,
  title: "Blocks",
  description: "desc",
  difficulty: "easy",
  task_type: "task_build_from_blocks",
  payload: {
    language: "python",
    blocks: [{ id: 0, content: "print('a')" }],
    blocks_by_language: {
      python: [{ id: 0, content: "print('a')" }],
      cpp: [{ id: 0, content: 'cout << "a";' }],
    },
    code_examples: { python: "print('a')", cpp: 'cout << "a";' },
    test_cases: [{ inputs: "", output: "a" }],
    constructions: ["io"],
  },
}

const FLOWCHART: TaskDetail = {
  id: 3,
  title: "Flow",
  description: "desc",
  difficulty: "easy",
  task_type: "task_flowchart_to_code",
  payload: {
    flowchart_mode: "code_to_flowchart",
    source_language: "python",
    source_code: "print('hi')",
    source_code_by_language: {
      python: "print('hi')",
      cpp: 'cout << "hi";',
    },
    test_cases: [{ inputs: "", output: "hi" }],
    constructions: ["if_statement"],
  },
}

const WRITE_TASK: TaskDetail = {
  id: 4,
  title: "Write loop",
  description: "Выведите числа",
  difficulty: "easy",
  task_type: "task_write_from_description",
  payload: {
    target_language: "python",
    problem_statement: "Используйте цикл for",
    test_cases: [{ input: "", expected_output: "0\n1\n2" }],
    constructions: ["for_loop"],
    construction_hints: { for_loop: { title: "Цикл for в задаче" } },
  },
}

describe("studentUiUtils", () => {
  it("extracts known languages and reference code", () => {
    expect(getKnownLanguages(TRANSLATION)).toContain("python")
    expect(getReferenceCode(TRANSLATION, "python")).toBe("print('Hello')")
  })

  it("resolves parallel language pair", () => {
    const known = resolveKnownLanguage(TRANSLATION)
    const learning = resolveLearningLanguage(TRANSLATION, known, "cpp", ["python", "cpp", "pascal"])
    expect(known).toBe("python")
    expect(learning).toBe("cpp")
  })

  it("reads test cases and constructions from payload", () => {
    expect(getTaskTestCases(BLOCK_REORDER)).toEqual([{ inputs: "", output: "a" }])
    expect(getTaskConstructions(BLOCK_REORDER)).toEqual(["io"])
  })

  it("normalizes legacy test case field names", () => {
    expect(getTaskTestCases(WRITE_TASK)).toEqual([{ inputs: "", output: "0\n1\n2" }])
  })

  it("returns learning languages for block reorder variants", () => {
    expect(getLearningLanguages(BLOCK_REORDER, [])).toEqual(expect.arrayContaining(["python", "cpp"]))
  })

  it("reads flowchart reference code by language", () => {
    expect(getCodeExamples(FLOWCHART).cpp).toBe('cout << "hi";')
    expect(getReferenceCode(FLOWCHART, "cpp")).toBe('cout << "hi";')
  })

  it("builds write-task reference text from problem statement", () => {
    expect(getWriteTaskReferenceText(WRITE_TASK)).toBe(
      "# Выведите числа\n#\n# Используйте цикл for",
    )
  })

  it("labels constructions with hints fallback", () => {
    expect(getConstructionLabel("for_loop")).toBe("Цикл for")
    expect(getConstructionLabel("if_statement")).toBe("Условие")
    expect(getConstructionLabel("custom_tag", { custom_tag: { title: "Своя конструкция" } })).toBe(
      "Своя конструкция",
    )
  })

  it("detects when language swap is allowed", () => {
    expect(
      canSwapParallelLanguages("python", "cpp", ["python", "cpp"], ["python", "cpp"]),
    ).toBe(true)
    expect(canSwapParallelLanguages("python", "python", ["python"], ["python"])).toBe(false)
    expect(canSwapParallelLanguages("python", "cpp", ["python"], ["cpp"])).toBe(false)
  })

  it("detects reference pane visibility by task type", () => {
    expect(hasReferencePane(TRANSLATION)).toBe(true)
    expect(hasReferencePane(WRITE_TASK)).toBe(true)
    expect(hasReferencePane(FLOWCHART)).toBe(true)
    expect(hasReferencePane(null)).toBe(false)
  })

  it("handles null task safely", () => {
    expect(getTaskTestCases(null)).toEqual([])
    expect(getKnownLanguages(null)).toEqual([])
    expect(getReferenceCode(null, "python")).toBeNull()
  })
})

describe("testPanelUtils", () => {
  it("builds pending rows before run", () => {
    const rows = buildTestRows([{ inputs: "1", output: "1" }], [])
    expect(rows).toHaveLength(1)
    expect(rows[0].status).toBe("PENDING")
    expect(rows[0].expected).toBe("1")
    expect(countTestStats(rows).pending).toBe(1)
  })

  it("maps run results", () => {
    const rows = buildTestRows(
      [{ inputs: "", output: "Hello" }],
      [{ case: 1, status: "PASSED", actual: "Hello", duration_ms: 12 }],
    )
    expect(rows[0].status).toBe("PASSED")
    expect(rows[0].actual).toBe("Hello")
    expect(countTestStats(rows).passed).toBe(1)
  })
})
