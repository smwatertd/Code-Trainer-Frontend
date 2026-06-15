import { describe, expect, it } from "vitest"
import {
  buildCode,
  deriveSubmitPayload,
  getInitialBaseCode,
} from "@/domain/blockAssembly/buildCode"
import type { BlockPlacement } from "@/domain/blockAssembly/types"

describe("buildCode", () => {
  it("returns baseCode unchanged when there are no placements", () => {
    const baseCode = "x        1\ny        2"
    expect(buildCode(baseCode, [], ["=", "print"])).toBe(baseCode)
  })

  it("inserts a block at the given column on a line", () => {
    const baseCode = "total=135\nh=       \nm=       "
    const blocks = ["total//60", "total%60"]
    const placements: BlockPlacement[] = [
      { id: "a", blockIndex: 0, line: 2, column: 3, slot: 0 },
      { id: "b", blockIndex: 1, line: 3, column: 3, slot: 0 },
    ]

    expect(buildCode(baseCode, placements, blocks)).toBe(
      "total=135\nh=total//60\nm=total%60",
    )
  })

  it("appends trailing lines from multiline blocks", () => {
    const baseCode = "if x:\n    "
    const blocks = ["print(x)\nprint(y)"]
    const placements: BlockPlacement[] = [
      { id: "a", blockIndex: 0, line: 2, column: 5, slot: 0 },
    ]

    expect(buildCode(baseCode, placements, blocks)).toBe("if x:\n    print(x)\nprint(y)")
  })

  it("orders deriveSubmitPayload by templateSlot when present", () => {
    const baseCode = getInitialBaseCode("x {0} 1\ny {1} 2\n{2}(x)", ["=", "print"])
    const placements: BlockPlacement[] = [
      { id: "c", blockIndex: 1, line: 3, column: 1, slot: 0, templateSlot: 2 },
      { id: "a", blockIndex: 0, line: 1, column: 3, slot: 0, templateSlot: 0 },
      { id: "b", blockIndex: 0, line: 2, column: 3, slot: 0, templateSlot: 1 },
    ]

    expect(deriveSubmitPayload(placements, baseCode)).toEqual({
      order: [0, 0, 1],
      indents: [2, 2, 0],
    })
  })
})

describe("getInitialBaseCode", () => {
  it("replaces {N} markers with spaced gaps sized to block width", () => {
    const template = "x {0} 1\ny {1} 2\n{2}(x)"
    const blocks = ["=", "print", "input"]

    const baseCode = getInitialBaseCode(template, blocks)

    expect(baseCode).not.toContain("{0}")
    expect(baseCode.split("\n")).toHaveLength(3)
    expect(baseCode.split("\n")[0]).toMatch(/^x\s+1$/)
    expect(baseCode.split("\n")[2]).toMatch(/^\s+\(x\)$/)
  })

  it("decodes escaped newlines in stored templates", () => {
    expect(getInitialBaseCode("a {0}\\nb {1}", ["x", "y"]).split("\n")).toHaveLength(2)
  })

  it("returns empty string for templates without slot markers", () => {
    expect(getInitialBaseCode("print('hi')", ["print"])).toBe("")
  })
})
