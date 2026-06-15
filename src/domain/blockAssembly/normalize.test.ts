import { describe, expect, it } from "vitest"
import { isAssemblyComplete, normalizePlacements } from "@/domain/blockAssembly/normalize"
import type { BlockPlacement } from "@/domain/blockAssembly/types"

describe("normalizePlacements", () => {
  it("filters invalid block indices and assigns ids", () => {
    const raw = [
      { blockIndex: -1, line: 1, column: 1, slot: 0 },
      { blockIndex: 0, line: 0, column: 0, slot: -1 },
    ] as BlockPlacement[]

    const normalized = normalizePlacements(raw)

    expect(normalized).toHaveLength(1)
    expect(normalized[0]?.blockIndex).toBe(0)
    expect(normalized[0]?.line).toBe(1)
    expect(normalized[0]?.column).toBe(1)
    expect(normalized[0]?.slot).toBe(0)
    expect(normalized[0]?.id).toMatch(/^blk-/)
  })

  it("sorts placements by line, slot, then column", () => {
    const placements: BlockPlacement[] = [
      { id: "b", blockIndex: 1, line: 2, column: 5, slot: 0 },
      { id: "a", blockIndex: 0, line: 1, column: 1, slot: 0 },
      { id: "c", blockIndex: 2, line: 2, column: 1, slot: 1 },
    ]

    expect(normalizePlacements(placements).map((placement) => placement.id)).toEqual([
      "a",
      "b",
      "c",
    ])
  })
})

describe("isAssemblyComplete", () => {
  it("returns true when every block index is placed exactly once", () => {
    const placements: BlockPlacement[] = [
      { id: "a", blockIndex: 0, line: 1, column: 1, slot: 0 },
      { id: "b", blockIndex: 1, line: 2, column: 1, slot: 0 },
    ]

    expect(isAssemblyComplete(placements, 2)).toBe(true)
  })

  it("returns false when blocks are missing or blockCount is zero", () => {
    const placements: BlockPlacement[] = [
      { id: "a", blockIndex: 0, line: 1, column: 1, slot: 0 },
    ]

    expect(isAssemblyComplete(placements, 2)).toBe(false)
    expect(isAssemblyComplete(placements, 0)).toBe(false)
  })
})
