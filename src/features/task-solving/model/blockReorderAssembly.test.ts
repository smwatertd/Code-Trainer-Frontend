import { describe, expect, it } from "vitest"
import {
  buildBlockCodeFromOrder,
  countTemplateSlots,
  parseTemplateDisplayLines,
} from "@/features/task-solving/model/blockReorderAssembly"

describe("blockReorderAssembly", () => {
  it("counts template slots left-to-right", () => {
    expect(countTemplateSlots("x {0} 1\ny {1} 2\n{2}(x)")).toBe(3)
  })

  it("builds code from template and block order", () => {
    const blocks = ["=", "print"]
    const template = "x {0} 1\ny {1} 2\n{2}(x)"
    expect(buildBlockCodeFromOrder(blocks, [0, 0, 1], template)).toBe("x = 1\ny = 2\nprint(x)")
  })

  it("applies line indent from template to multiline blocks", () => {
    const template = "if x:\n    {0}"
    const blocks = ["print(x)\nprint(y)"]
    expect(buildBlockCodeFromOrder(blocks, [0], template)).toBe("if x:\n    print(x)\n    print(y)")
  })

  it("parses template into display lines", () => {
    const lines = parseTemplateDisplayLines("x {0} 1\n{1}(y)")
    expect(lines[0].segments).toEqual([
      { kind: "text", value: "x " },
      { kind: "slot", slotIndex: 0 },
      { kind: "text", value: " 1" },
    ])
    expect(lines[1].segments[0]).toEqual({ kind: "slot", slotIndex: 1 })
  })
})
