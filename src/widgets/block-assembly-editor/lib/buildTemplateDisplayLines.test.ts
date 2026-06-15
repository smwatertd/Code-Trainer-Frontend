import { describe, expect, it } from "vitest"
import { getInitialBaseCode } from "@/domain/blockAssembly/buildCode"
import { applyDrop } from "@/domain/blockAssembly/drop"
import {
  buildTemplateDisplayLines,
  getSlotDropTarget,
  slotCountFromDisplayLines,
} from "@/widgets/block-assembly-editor/lib/buildTemplateDisplayLines"

describe("buildTemplateDisplayLines", () => {
  const template = "x {0} 1\ny {1} 2\n{2}(x)"
  const blocks = ["=", "print"]
  const baseCode = getInitialBaseCode(template, blocks)

  it("creates one slot token per {N} marker", () => {
    const lines = buildTemplateDisplayLines(baseCode, template, [], blocks)

    expect(lines).toHaveLength(3)
    expect(slotCountFromDisplayLines(lines)).toBe(3)
    expect(lines[0]?.tokens.filter((token) => token.kind === "slot")).toHaveLength(1)
    expect(lines[0]?.tokens[1]).toMatchObject({ kind: "slot", templateSlot: 0 })
  })

  it("binds placements to slot tokens by templateSlot", () => {
    const placements = applyDrop([], blocks, baseCode, 0, 1, 3, 0)
    const lines = buildTemplateDisplayLines(baseCode, template, placements, blocks)
    const slot = lines[0]?.tokens.find((token) => token.kind === "slot")

    expect(slot?.placement?.blockIndex).toBe(0)
  })

  it("returns drop targets for slot indices on a line", () => {
    const lines = buildTemplateDisplayLines(baseCode, template, [], blocks)
    const target = getSlotDropTarget(lines, 1, 0)

    expect(target).toEqual({ line: 1, column: expect.any(Number) })
  })
})
