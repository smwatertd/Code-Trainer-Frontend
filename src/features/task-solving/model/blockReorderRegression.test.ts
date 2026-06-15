import { describe, expect, it } from "vitest"
import type { TaskDetail } from "@/shared/types/api"
import {
  buildCodeFromBlockTask,
  createBlockTaskStateForLanguage,
} from "@/features/task-solving/model/blockAssemblyHelpers"
import {
  assembleBlockReorderCode,
  normalizeProgramCode,
} from "@/features/task-solving/model/blockReorderLanguage"
import { buildCodeFromBlocks, getTaskBlocks } from "@/features/task-solving/model/solverState"

const PASCAL_HELLO_BLOCKS = [
  "program Main;",
  "begin",
  "writeln('Hello');",
  "end.",
]

const PASCAL_AREA_BLOCKS = [
  "program Main;",
  "var w,h,area: integer;",
  "begin",
  "readln(w,h);",
  "area:=w*h;",
  "writeln(area);",
  "end.",
]

function helloTask(): TaskDetail {
  return {
    id: 1,
    title: "Hello",
    description: "",
    difficulty: "easy",
    task_type: "task_build_from_blocks",
    payload: {
      language: "pascal",
      correct_order: [0, 1, 2, 3],
      blocks_by_language: {
        pascal: PASCAL_HELLO_BLOCKS.map((content, id) => ({ id, content })),
      },
      code_examples: {
        python: "print('Hello')",
        pascal: "program Main;\nbegin\n  writeln('Hello');\nend.",
      },
    },
  } as TaskDetail
}

function areaTask(): TaskDetail {
  return {
    id: 4,
    title: "Area",
    description: "",
    difficulty: "easy",
    task_type: "task_build_from_blocks",
    payload: {
      language: "pascal",
      correct_order: [0, 1, 2, 3, 4, 5, 6],
      blocks_by_language: {
        pascal: PASCAL_AREA_BLOCKS.map((content, id) => ({ id, content })),
      },
      code_examples: {
        python: "w=int(input())\nh=int(input())\nprint(w*h)",
        pascal:
          "program Main;\nvar w,h,area: integer;\nbegin\n  readln(w,h);\n  area:=w*h;\n  writeln(area);\nend.",
      },
    },
  } as TaskDetail
}

describe("blockReorderRegression", () => {
  it("builds pascal hello code without begin-body indentation", () => {
    const task = helloTask()
    const blocks = getTaskBlocks(task, "pascal")
    const order = [0, 1, 2, 3]
    const code = buildCodeFromBlockTask(task, blocks, order, [], "pascal")

    expect(code).toBe(
      normalizeProgramCode("program Main;\nbegin\nwriteln('Hello');\nend."),
    )
    expect(code).not.toContain("  writeln")
  })

  it("matches assembleBlockReorderCode for structural pascal tasks", () => {
    for (const [blocks, order] of [
      [PASCAL_HELLO_BLOCKS, [0, 1, 2, 3]],
      [PASCAL_AREA_BLOCKS, [0, 1, 2, 3, 4, 5, 6]],
    ] as const) {
      const taskBlocks = blocks.map((content, id) => ({ id, content }))
      const fromHelpers = buildCodeFromBlocks(taskBlocks, order, "pascal")
      const fromAssembler = assembleBlockReorderCode(blocks, order, "pascal")

      expect(fromHelpers).toBe(fromAssembler)
    }
  })

  it("uses code_examples when switching hello task to python", () => {
    const task = helloTask()
    const state = createBlockTaskStateForLanguage(task, "python")

    expect(state.blockOrder).toEqual([0])
    expect(state.code).toBe("print('Hello')")
    expect(buildCodeFromBlockTask(task, getTaskBlocks(task, "python"), state.blockOrder, [], "python")).toBe(
      "print('Hello')",
    )
  })

  it("uses code_examples when switching area task to python", () => {
    const task = areaTask()
    const blocks = getTaskBlocks(task, "python")
    const order = blocks.map((block) => block.id)
    const code = buildCodeFromBlockTask(task, blocks, order, [], "python")

    expect(blocks).toHaveLength(3)
    expect(code).toBe("w=int(input())\nh=int(input())\nprint(w*h)")
  })

  it("rejects legacy indented pascal example as assembled output", () => {
    const task = helloTask()
    const blocks = getTaskBlocks(task, "pascal")
    const code = buildCodeFromBlockTask(task, blocks, [0, 1, 2, 3], [], "pascal")
    const legacyExample = String(task.payload.code_examples?.pascal ?? "")

    expect(code).not.toBe(normalizeProgramCode(legacyExample))
    expect(legacyExample).toContain("  writeln")
  })

  it("builds different code when block order changes", () => {
    const blocks = PASCAL_HELLO_BLOCKS.map((content, id) => ({ id, content }))
    const correct = buildCodeFromBlocks(blocks, [0, 1, 2, 3], "pascal")
    const swapped = buildCodeFromBlocks(blocks, [0, 2, 1, 3], "pascal")

    expect(swapped).not.toBe(correct)
    expect(swapped.indexOf("writeln")).toBeLessThan(swapped.indexOf("begin"))
  })
})
