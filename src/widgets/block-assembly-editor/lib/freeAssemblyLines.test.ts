import { describe, expect, it } from "vitest"
import type { BlockPlacement } from "@/domain/blockAssembly/types"
import {
  linesFromPlacements,
  placementsFromLines,
} from "@/widgets/block-assembly-editor/lib/freeAssemblyLines"

describe("freeAssemblyLines", () => {
  const blocks = ["total=135", "h=total//60", "m=total%60", "print(h, m)"]

  it("roundtrips line-based placements", () => {
    const source: BlockPlacement[] = [
      { id: "a", blockIndex: 0, line: 1, column: 1, slot: 0 },
      { id: "b", blockIndex: 1, line: 2, column: 1, slot: 0 },
      { id: "c", blockIndex: 2, line: 3, column: 1, slot: 0 },
      { id: "d", blockIndex: 3, line: 4, column: 1, slot: 0 },
    ]

    const lines = linesFromPlacements(source, "")
    const roundtrip = placementsFromLines(lines, blocks)

    expect(roundtrip.map((placement) => placement.blockIndex)).toEqual([0, 1, 2, 3])
    expect(roundtrip.map((placement) => placement.line)).toEqual([1, 2, 3, 4])
  })

  it("derives indent levels from column positions", () => {
    const source: BlockPlacement[] = [
      { id: "a", blockIndex: 0, line: 1, column: 5, slot: 0 },
    ]

    expect(linesFromPlacements(source, "")[0]?.indent).toBe(1)
  })

  it("starts with one empty line when there are no placements", () => {
    const lines = linesFromPlacements([], "")

    expect(lines).toHaveLength(1)
    expect(lines[0]?.blockIndices).toEqual([])
  })
})
