import { describe, expect, it } from "vitest"
import { getLangTokenSpec, tokenizeCodeLine } from "@/widgets/block-assembly-editor/lib/codeTokenizer"

describe("codeTokenizer", () => {
  it("tokenizes python keywords, identifiers, and operators", () => {
    const tokens = tokenizeCodeLine("if total >= 0:", "python")

    expect(tokens.map((token) => [token.c, token.t])).toEqual([
      ["kw", "if"],
      ["ws", " "],
      ["id", "total"],
      ["ws", " "],
      ["op", ">="],
      ["ws", " "],
      ["num", "0"],
      ["op", ":"],
    ])
  })

  it("tokenizes string literals and comments", () => {
    const tokens = tokenizeCodeLine('print("hi")  # note', "python")

    expect(tokens.some((token) => token.c === "str" && token.t === '"hi"')).toBe(true)
    expect(tokens.at(-1)).toMatchObject({ c: "cmt", t: "# note" })
  })

  it("falls back to python spec for unknown languages", () => {
    expect(getLangTokenSpec("brainfuck").cmt).toBe("#")
  })
})
