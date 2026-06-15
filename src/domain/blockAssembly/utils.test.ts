import { describe, expect, it } from "vitest"
import {
  blockFirstLineWidth,
  decodeTemplateText,
  getLineIndentLen,
  snapColumnToTab,
} from "@/domain/blockAssembly/utils"

describe("blockAssembly utils", () => {
  it("decodeTemplateText normalizes escaped and backtick newlines", () => {
    expect(decodeTemplateText("a\\nb")).toBe("a\nb")
    expect(decodeTemplateText("a`nb")).toBe("a\nb")
    expect(decodeTemplateText("a\r\nb")).toBe("a\nb")
  })

  it("measures leading indent length", () => {
    expect(getLineIndentLen("    print(x)")).toBe(4)
    expect(getLineIndentLen("print(x)")).toBe(0)
  })

  it("snaps columns to tab stops", () => {
    expect(snapColumnToTab(1)).toBe(1)
    expect(snapColumnToTab(4)).toBe(5)
    expect(snapColumnToTab(6)).toBe(5)
  })

  it("uses first line width for multiline blocks", () => {
    expect(blockFirstLineWidth("print(x)\nprint(y)")).toBe(8)
    expect(blockFirstLineWidth("")).toBe(1)
  })
})
