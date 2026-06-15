import { describe, expect, it } from "vitest"
import { buildCode, getInitialBaseCode } from "@/domain/blockAssembly/buildCode"
import { applyDrop, removePlacement } from "@/domain/blockAssembly/drop"
import { normalizePlacements } from "@/domain/blockAssembly/normalize"
import { buildBlockCodeFromOrder } from "@/features/task-solving/model/blockReorderAssembly"
import { buildTemplateDisplayLines } from "@/widgets/block-assembly-editor/lib/buildTemplateDisplayLines"

function collapseSpaces(code: string) {
  return code
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .join("\n")
}

function assembleViaDrops(template: string, blocks: string[], blockIndexBySlot: number[]) {
  const baseCode = getInitialBaseCode(template, blocks)
  const displayLines = buildTemplateDisplayLines(baseCode, template, [], blocks)
  let placements = []

  for (const line of displayLines) {
    for (const token of line.tokens) {
      if (token.kind !== "slot") continue
      const blockIndex = blockIndexBySlot[token.templateSlot ?? -1]
      if (blockIndex == null) continue
      placements = applyDrop(
        placements,
        blocks,
        baseCode,
        blockIndex,
        line.lineNum,
        token.dropColumn ?? 1,
        token.templateSlot,
      )
    }
  }

  return { baseCode, placements, assembled: buildCode(baseCode, placements, blocks) }
}

describe("applyDrop", () => {
  const template = "x {0} 1\n{1}(y)"
  const blocks = ["=", "print"]

  it("places a block into an empty template slot", () => {
    const { baseCode } = assembleViaDrops(template, blocks, [])
    const next = applyDrop([], blocks, baseCode, 0, 1, 3, 0)

    expect(normalizePlacements(next, baseCode)).toHaveLength(1)
    expect(next[0]?.blockIndex).toBe(0)
    expect(next[0]?.templateSlot).toBe(0)
  })

  it("moves a block when dropped on another slot", () => {
    const { baseCode } = assembleViaDrops(template, blocks, [])
    const first = applyDrop([], blocks, baseCode, 0, 1, 3, 0)
    const moved = applyDrop(first, blocks, baseCode, 0, 2, 1, 1)

    expect(moved).toHaveLength(1)
    expect(moved[0]?.line).toBe(2)
    expect(moved[0]?.templateSlot).toBe(1)
  })

  it("replaces an already placed block index", () => {
    const { baseCode } = assembleViaDrops(template, blocks, [])
    const withFirst = applyDrop([], blocks, baseCode, 0, 1, 3, 0)
    const withSecond = applyDrop(withFirst, blocks, baseCode, 1, 2, 1, 1)

    expect(withSecond).toHaveLength(2)
    expect(withSecond.map((placement) => placement.blockIndex).sort()).toEqual([0, 1])
  })

  it("builds semantically equivalent code to legacy order-based assembly", () => {
    const { assembled } = assembleViaDrops(template, blocks, [0, 1])
    const legacy = buildBlockCodeFromOrder(blocks, [0, 1], template)

    expect(collapseSpaces(assembled)).toBe(collapseSpaces(legacy))
    expect(collapseSpaces(legacy)).toBe("x = 1\nprint(y)")
  })
})

describe("removePlacement", () => {
  it("removes all placements for the given block index", () => {
    const placements = [
      { id: "a", blockIndex: 0, line: 1, column: 1, slot: 0 },
      { id: "b", blockIndex: 1, line: 2, column: 1, slot: 0 },
    ]

    expect(removePlacement(placements, 0)).toEqual([placements[1]])
  })
})
