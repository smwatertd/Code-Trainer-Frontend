import { describe, expect, it } from "vitest"
import type { BlockPlacement } from "@/domain/blockAssembly"
import { getInitialBaseCode } from "@/domain/blockAssembly/buildCode"
import { applyDrop } from "@/domain/blockAssembly/drop"
import {
  buildTemplateDisplayLines,
} from "@/widgets/block-assembly-editor/lib/buildTemplateDisplayLines"
import {
  blockOrderFromPlacements,
  buildCodeFromBlockTask,
  buildCodeFromPlacements,
  createBlockTaskStateForLanguage,
  getFragmentBaseCode,
  normalizeBlockOrder,
} from "@/features/task-solving/model/blockAssemblyHelpers"
import type { TaskDetail } from "@/shared/types/api"

describe("blockAssemblyHelpers", () => {
  const blocks = [
    { id: 0, content: "m=total%60" },
    { id: 1, content: "print(h, m)" },
    { id: 2, content: "h=total//60" },
    { id: 3, content: "total=135" },
  ]

  const placements: BlockPlacement[] = [
    { id: "a", blockIndex: 3, line: 1, column: 1, slot: 0 },
    { id: "b", blockIndex: 2, line: 2, column: 1, slot: 0 },
    { id: "c", blockIndex: 0, line: 3, column: 1, slot: 0 },
    { id: "d", blockIndex: 1, line: 4, column: 1, slot: 0 },
  ]

  it("derives block order from line placements", () => {
    expect(blockOrderFromPlacements(placements)).toEqual([3, 2, 0, 1])
  })

  it("drops stale block ids and keeps valid order when language changes", () => {
    const pascalBlocks = [
      { id: 0, content: "program Main;" },
      { id: 1, content: "begin" },
      { id: 2, content: "writeln('Hello');" },
      { id: 3, content: "end." },
    ]
    const pythonBlocks = [{ id: 0, content: "print('Hello')" }]

    expect(normalizeBlockOrder([0, 1, 2, 3], pascalBlocks)).toEqual([0, 1, 2, 3])
    expect(normalizeBlockOrder([0, 1, 2, 3], pythonBlocks)).toEqual([0])
    expect(normalizeBlockOrder([2, 0, 1, 3], pythonBlocks)).toEqual([0])
  })

  it("builds python code from placements", () => {
    expect(buildCodeFromPlacements(blocks, placements, "python")).toBe(
      "total=135\nh=total//60\nm=total%60\nprint(h, m)",
    )
  })

  describe("fragment assembly", () => {
    const fragmentTask = {
      id: 99,
      title: "Fragment",
      description: "",
      difficulty: "easy",
      task_type: "task_build_from_blocks",
      payload: {
        template: "x {0} 1\n{1}(y)",
        blocks: ["=", "print"],
        correct_order: [0, 1],
        language: "python",
      },
    } as TaskDetail

    const fragmentBlocks = [
      { id: 0, content: "=" },
      { id: 1, content: "print" },
    ]

    it("builds initial scaffold from template", () => {
      const baseCode = getFragmentBaseCode(fragmentTask, fragmentBlocks, "python")

      expect(baseCode).not.toContain("{0}")
      expect(baseCode.split("\n")).toHaveLength(2)
    })

    it("assembles fragment code from placements via buildCode", () => {
      const template = "x {0} 1\n{1}(y)"
      const texts = fragmentBlocks.map((block) => block.content)
      const baseCode = getInitialBaseCode(template, texts)
      const displayLines = buildTemplateDisplayLines(baseCode, template, [], texts)

      let next: BlockPlacement[] = []
      for (const line of displayLines) {
        for (const token of line.tokens) {
          if (token.kind !== "slot") continue
          const blockIndex = token.templateSlot === 1 ? 1 : 0
          next = applyDrop(
            next,
            texts,
            baseCode,
            blockIndex,
            line.lineNum,
            token.dropColumn ?? 1,
            token.templateSlot,
          )
        }
      }

      const assembled = buildCodeFromBlockTask(fragmentTask, fragmentBlocks, [0, 1], next, "python")

      expect(assembled.replace(/\s+/g, " ").trim()).toBe("x = 1 print(y)".replace(/\s+/g, " ").trim())
      expect(assembled.split("\n").map((line) => line.replace(/\s+/g, " ").trim())).toEqual([
        "x = 1",
        "print(y)",
      ])
      expect(blockOrderFromPlacements(next, baseCode)).toEqual([0, 1])
    })

    it("returns scaffold when fragment placements are empty", () => {
      const baseCode = getFragmentBaseCode(fragmentTask, fragmentBlocks, "python")

      expect(buildCodeFromBlockTask(fragmentTask, fragmentBlocks, [-1, -1], [], "python")).toBe(
        baseCode,
      )
    })
  })
})

describe("createBlockTaskStateForLanguage", () => {
  it("rebuilds block order when switching from pascal to python", () => {
    const task = {
      id: 1,
      title: "Hello",
      description: "",
      difficulty: "easy",
      task_type: "task_build_from_blocks",
      payload: {
        language: "pascal",
        blocks_by_language: {
          pascal: [
            { id: 0, content: "program Main;" },
            { id: 1, content: "begin" },
            { id: 2, content: "writeln('Hello');" },
            { id: 3, content: "end." },
          ],
          python: [
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

    const pascal = createBlockTaskStateForLanguage(task, "pascal")
    const python = createBlockTaskStateForLanguage(task, "python")

    expect(pascal.blockOrder).toEqual([0, 1, 2, 3])
    expect(python.blockOrder).toEqual([0])
    expect(python.code).toBe("print('Hello')")
  })

  it("builds pascal structural code via buildCodeFromBlockTask", () => {
    const task = {
      id: 1,
      title: "Hello",
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
      },
    } as TaskDetail

    const blocks = [
      { id: 0, content: "program Main;" },
      { id: 1, content: "begin" },
      { id: 2, content: "writeln('Hello');" },
      { id: 3, content: "end." },
    ]

    expect(buildCodeFromBlockTask(task, blocks, [0, 1, 2, 3], [], "pascal")).toBe(
      "program Main;\nbegin\nwriteln('Hello');\nend.",
    )
  })
})
