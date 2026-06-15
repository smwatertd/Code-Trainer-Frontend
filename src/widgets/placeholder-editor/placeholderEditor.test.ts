import { describe, expect, it } from "vitest"
import { parsePlaceholderLines } from "@/widgets/placeholder-editor/PlaceholderEditor"

describe("parsePlaceholderLines", () => {
  it("preserves multiline template structure", () => {
    const lines = parsePlaceholderLines("name = ___()\nif total ___ 0:\n    print(___)")
    expect(lines).toHaveLength(3)
    expect(lines[0].segments).toEqual([
      { kind: "text", value: "name = " },
      { kind: "slot", index: 0 },
      { kind: "text", value: "()" },
    ])
    expect(lines[1].segments).toEqual([
      { kind: "text", value: "if total " },
      { kind: "slot", index: 1 },
      { kind: "text", value: " 0:" },
    ])
    expect(lines[2].indentStr).toBe("    ")
    expect(lines[2].segments).toEqual([
      { kind: "text", value: "print(" },
      { kind: "slot", index: 2 },
      { kind: "text", value: ")" },
    ])
  })
})
