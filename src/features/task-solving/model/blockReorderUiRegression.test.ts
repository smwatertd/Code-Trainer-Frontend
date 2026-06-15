import { describe, expect, it } from "vitest"
import type { TaskBlock, TaskDetail } from "@/shared/types/api"
import {
  applyBlockOrderUpdate,
  createBlockTaskStateForLanguage,
  moveBlockOrder,
  normalizeBlockOrder,
  shouldSyncBlockOrder,
} from "@/features/task-solving/model/blockAssemblyHelpers"
import { getTaskBlocks } from "@/features/task-solving/model/solverState"

/** Task 1 on production: Pascal block reorder «Вывести приветствие». */
function task1Hello(): TaskDetail {
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

function blockContents(blocks: TaskBlock[], order: number[]): string[] {
  const byId = new Map(blocks.map((block) => [block.id, block]))
  return order.map((id) => byId.get(id)?.content ?? "—")
}

describe("blockReorderUiRegression", () => {
  const task = task1Hello()

  describe("task 1 /tasks/1 — blocks must not disappear", () => {
    it("shows all 4 pascal blocks in initial order", () => {
      const blocks = getTaskBlocks(task, "pascal")
      const { blockOrder } = createBlockTaskStateForLanguage(task, "pascal")

      expect(blocks).toHaveLength(4)
      expect(blockOrder).toEqual([0, 1, 2, 3])
      expect(blockContents(blocks, blockOrder)).toEqual([
        "program Main;",
        "begin",
        "writeln('Hello');",
        "end.",
      ])
    })

    it("keeps 4 visible blocks after moving first block down", () => {
      const blocks = getTaskBlocks(task, "pascal")
      const moved = moveBlockOrder([0, 1, 2, 3], 0, 1, blocks)
      const { blockOrder, code } = applyBlockOrderUpdate(task, "pascal", moved)

      expect(blockOrder).toEqual([1, 0, 2, 3])
      expect(blockOrder).toHaveLength(4)
      expect(blockContents(blocks, blockOrder).every((line) => line !== "—")).toBe(true)
      expect(code).toContain("program Main;")
      expect(code).toContain("writeln('Hello');")
    })

    it("keeps 4 visible blocks after several swaps", () => {
      const blocks = getTaskBlocks(task, "pascal")
      let order = [0, 1, 2, 3]

      order = moveBlockOrder(order, 2, -1, blocks)
      order = moveBlockOrder(order, 1, 1, blocks)
      order = moveBlockOrder(order, 0, 1, blocks)

      const { blockOrder } = applyBlockOrderUpdate(task, "pascal", order)

      expect(blockOrder).toHaveLength(4)
      expect(new Set(blockOrder).size).toBe(4)
      expect(blockContents(blocks, blockOrder).every((line) => line !== "—")).toBe(true)
    })

    it("does not move past list bounds", () => {
      const blocks = getTaskBlocks(task, "pascal")
      const order = [0, 1, 2, 3]

      expect(moveBlockOrder(order, 0, -1, blocks)).toEqual(order)
      expect(moveBlockOrder(order, 3, 1, blocks)).toEqual(order)
    })
  })

  describe("language switch — stale block order must not leave ghost rows", () => {
    it("detects stale pascal order when python blocks are active", () => {
      const pythonBlocks = getTaskBlocks(task, "python")
      const stalePascalOrder = [0, 1, 2, 3]

      expect(shouldSyncBlockOrder(stalePascalOrder, pythonBlocks)).toBe(true)
      expect(normalizeBlockOrder(stalePascalOrder, pythonBlocks)).toEqual([0])
    })

    it("rebuilds order via createBlockTaskStateForLanguage on language change", () => {
      const pascal = createBlockTaskStateForLanguage(task, "pascal")
      const python = createBlockTaskStateForLanguage(task, "python")

      expect(pascal.blockOrder).toEqual([0, 1, 2, 3])
      expect(python.blockOrder).toEqual([0])

      const pythonBlocks = getTaskBlocks(task, "python")
      expect(blockContents(pythonBlocks, python.blockOrder)).toEqual(["print('Hello')"])
      expect(blockContents(pythonBlocks, python.blockOrder).every((line) => line !== "—")).toBe(
        true,
      )
    })

    it("applyBlockOrderUpdate normalizes stale order instead of rendering dashes", () => {
      const pythonBlocks = getTaskBlocks(task, "python")
      const staleOrder = [0, 1, 2, 3]

      const { blockOrder } = applyBlockOrderUpdate(task, "python", staleOrder)

      expect(blockOrder).toEqual([0])
      expect(blockContents(pythonBlocks, blockOrder)).toEqual(["print('Hello')"])
    })

    it("does not require sync when order already matches blocks", () => {
      const blocks = getTaskBlocks(task, "pascal")
      expect(shouldSyncBlockOrder([0, 1, 2, 3], blocks)).toBe(false)
    })
  })

  describe("empty / invalid order edge cases", () => {
    it("rebuilds full order from blocks when order is empty", () => {
      const blocks = getTaskBlocks(task, "pascal")
      expect(normalizeBlockOrder([], blocks)).toEqual([0, 1, 2, 3])
    })

    it("returns empty order when block list is empty", () => {
      expect(normalizeBlockOrder([0, 1, 2, 3], [])).toEqual([])
    })
  })
})
