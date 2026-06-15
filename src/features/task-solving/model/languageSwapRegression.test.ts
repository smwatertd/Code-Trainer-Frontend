import { describe, expect, it } from "vitest"
import type { TaskDetail } from "@/shared/types/api"
import {
  createBlockTaskStateForLanguage,
  moveBlockOrder,
  normalizeBlockOrder,
} from "@/features/task-solving/model/blockAssemblyHelpers"
import {
  getLearningStarterCode,
  getTaskBlocks,
  resolveLearningCodeAfterSwap,
} from "@/features/task-solving/model/solverState"
import {
  getBlockAssemblyTemplate,
  resolveBlockAssemblyKind,
} from "@/features/task-solving/model/blockAssemblyMode"
import { getReferenceCode } from "@/features/task-solving/model/studentUiUtils"

function task4AreaProductionLike(): TaskDetail {
  const pascalBlocks = [
    "program Main;",
    "var w,h,area: integer;",
    "begin",
    "readln(w,h);",
    "area:=w*h;",
    "writeln(area);",
    "end.",
  ].map((content, id) => ({ id, content }))

  return {
    id: 4,
    title: "Посчитать площадь прямоугольника",
    description: "",
    difficulty: "easy",
    task_type: "task_build_from_blocks",
    payload: {
      language: "pascal",
      blocks: pascalBlocks,
      blocks_by_language: {
        pascal: pascalBlocks,
        python: pascalBlocks,
      },
      correct_order: [0, 1, 2, 3, 4, 5, 6],
      source_language: "python",
      code_examples: {
        python: "w = int(input())\nh = int(input())\nprint(w * h)",
        pascal:
          "var w,h,area: integer;\nbegin\n  readln(w,h);\n  area:=w*h;\n  writeln(area);\nend.",
      },
    },
  } as TaskDetail
}

function blockEditorKind(task: TaskDetail, language: string) {
  const blocks = getTaskBlocks(task, language)
  return resolveBlockAssemblyKind(blocks, getBlockAssemblyTemplate(task, language))
}

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

function task1HelloBlocks(): TaskDetail {
  return {
    id: 1,
    title: "Вывести приветствие",
    description: "",
    difficulty: "easy",
    task_type: "task_build_from_blocks",
    payload: {
      language: "pascal",
      correct_order: [0, 1, 2, 3],
      blocks_by_language: {
        pascal: [
          { id: 0, content: "program Main;" },
          { id: 1, content: "begin" },
          { id: 2, content: "writeln('Hello');" },
          { id: 3, content: "end." },
        ],
      },
      code_examples: {
        python: "print('Hello')",
        pascal: "program Main;\nbegin\n  writeln('Hello');\nend.",
      },
    },
  } as TaskDetail
}

function simulateTranslationSwap(
  task: TaskDetail,
  known: string,
  learning: string,
): { known: string; learning: string; learningCode: string; referenceCode: string | null } {
  const nextKnown = learning
  const nextLearning = known
  return {
    known: nextKnown,
    learning: nextLearning,
    learningCode: resolveLearningCodeAfterSwap(task, nextLearning),
    referenceCode: getReferenceCode(task, nextKnown),
  }
}

function simulateBlockSwap(task: TaskDetail, known: string, learning: string) {
  const nextKnown = learning
  const nextLearning = known
  const state = createBlockTaskStateForLanguage(task, nextLearning)
  const blocks = getTaskBlocks(task, nextLearning)
  return {
    known: nextKnown,
    learning: nextLearning,
    blockOrder: state.blockOrder,
    blockCount: blocks.length,
    code: state.code,
  }
}

describe("languageSwapRegression /tasks/2 translation", () => {
  const task = task2Age()

  it("initial state: python этalon + pascal debug template in learning", () => {
    expect(getReferenceCode(task, "python")).toContain("input()")
    expect(getLearningStarterCode(task, "pascal")).toContain("age = 18")
  })

  it("swap python↔pascal keeps python code in learning editor (not blank)", () => {
    const afterSwap = simulateTranslationSwap(task, "python", "pascal")

    expect(afterSwap.known).toBe("pascal")
    expect(afterSwap.learning).toBe("python")
    expect(afterSwap.referenceCode).toContain("readln")
    expect(afterSwap.learningCode).toContain("input()")
    expect(afterSwap.learningCode).not.toBe("")
  })

  it("double swap restores pascal debug template in learning editor", () => {
    const once = simulateTranslationSwap(task, "python", "pascal")
    const twice = simulateTranslationSwap(task, once.known, once.learning)

    expect(twice.learning).toBe("pascal")
    expect(twice.learningCode).toContain("writeln(age)")
    expect(twice.learningCode).toContain("age = 18")
  })

  it("getLearningStarterCode alone is empty for non-target python (debug swap adds fallback)", () => {
    expect(getLearningStarterCode(task, "python")).toBe("")
    expect(resolveLearningCodeAfterSwap(task, "python")).toContain("print(age)")
  })
})

describe("languageSwapRegression /tasks/1 blocks", () => {
  const task = task1HelloBlocks()

  it("swap pascal↔python keeps visible blocks for target learning language", () => {
    const pascalState = createBlockTaskStateForLanguage(task, "pascal")
    expect(pascalState.blockOrder).toHaveLength(4)

    const swapped = simulateBlockSwap(task, "python", "pascal")
    expect(swapped.learning).toBe("python")
    expect(swapped.blockCount).toBe(1)
    expect(swapped.code).toContain("print")

    const back = simulateBlockSwap(task, swapped.known, swapped.learning)
    expect(back.learning).toBe("pascal")
    expect(back.blockOrder).toHaveLength(4)
    expect(normalizeBlockOrder(back.blockOrder, getTaskBlocks(task, "pascal"))).toHaveLength(4)
  })

  it("block reorder after swap back still has 4 pascal rows", () => {
    const back = simulateBlockSwap(task, "python", "pascal")
    const blocks = getTaskBlocks(task, "pascal")
    const moved = moveBlockOrder(back.blockOrder, 0, 1, blocks)

    expect(moved).toHaveLength(4)
    expect(new Set(moved).size).toBe(4)
  })
})

describe("languageSwapRegression /tasks/4 area (production-like API)", () => {
  const task = task4AreaProductionLike()

  it("getTaskBlocks ignores synthesized python skeleton and uses code_examples", () => {
    const blocks = getTaskBlocks(task, "python")
    expect(blocks).toHaveLength(3)
    expect(blocks.map((block) => block.content).join("\n")).toContain("input()")
    expect(blocks.map((block) => block.content).join("\n")).not.toContain("program Main")
  })

  it("swap to python uses reorder editor with visible statement blocks", () => {
    const swapped = simulateBlockSwap(task, "python", "pascal")
    expect(swapped.learning).toBe("python")
    expect(swapped.blockCount).toBe(3)
    expect(swapped.blockOrder).toEqual([0, 1, 2])
    expect(blockEditorKind(task, "python")).toBe("program_reorder")
    expect(swapped.code).toContain("print")
  })

  it("double swap restores 7 pascal structural blocks", () => {
    const once = simulateBlockSwap(task, "python", "pascal")
    const twice = simulateBlockSwap(task, once.known, once.learning)
    expect(twice.learning).toBe("pascal")
    expect(twice.blockCount).toBe(7)
    expect(blockEditorKind(task, "pascal")).toBe("program_reorder")
    expect(normalizeBlockOrder(twice.blockOrder, getTaskBlocks(task, "pascal"))).toHaveLength(7)
  })
})
