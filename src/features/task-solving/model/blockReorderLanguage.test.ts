import { describe, expect, it } from "vitest"
import {
  assembleBlockReorderCode,
  assembleBlockReorderCodeFromLines,
  blocksMatchLanguageParadigm,
  isStructuralProgramBlocks,
  normalizeProgramCode,
} from "@/features/task-solving/model/blockReorderLanguage"

const PASCAL_HELLO_BLOCKS = [
  "program Main;",
  "begin",
  "writeln('Hello');",
  "end.",
]

describe("blockReorderLanguage", () => {
  it("detects structural pascal program blocks", () => {
    expect(isStructuralProgramBlocks(PASCAL_HELLO_BLOCKS)).toBe(true)
    expect(isStructuralProgramBlocks(["print('Hello')"])).toBe(false)
    expect(
      isStructuralProgramBlocks([
        "var n, i, sale, total: integer;",
        "begin",
        "readln(n);",
        "end.",
      ]),
    ).toBe(true)
  })

  it("matches blocks to language paradigm", () => {
    expect(blocksMatchLanguageParadigm(PASCAL_HELLO_BLOCKS, "pascal")).toBe(true)
    expect(blocksMatchLanguageParadigm(PASCAL_HELLO_BLOCKS, "python")).toBe(false)
    expect(
      blocksMatchLanguageParadigm(
        ["var n, i, sale, total: integer;", "begin", "readln(n);", "end."],
        "python",
      ),
    ).toBe(false)
    expect(blocksMatchLanguageParadigm(["print('Hello')"], "python")).toBe(true)
  })

  it("assembles structural pascal without solution wrapper", () => {
    const code = assembleBlockReorderCode(PASCAL_HELLO_BLOCKS, [0, 1, 2, 3], "pascal")

    expect(code).toContain("program Main;")
    expect(code).not.toContain("program Solution")
    expect(code).toBe(
      normalizeProgramCode(
        "program Main;\nbegin\nwriteln('Hello');\nend.",
      ),
    )
  })

  it("wraps simple python statements with language template", () => {
    const code = assembleBlockReorderCode(['cout << "Hello" << endl;'], [0], "cpp")

    expect(code).toContain("#include <iostream>")
    expect(code).toContain('cout << "Hello"')
  })

  it("assembles ordered lines directly", () => {
    const code = assembleBlockReorderCodeFromLines(PASCAL_HELLO_BLOCKS, "pascal")
    expect(code.startsWith("program Main;")).toBe(true)
  })

  it("assembles area task without indent inside begin block", () => {
    const blocks = [
      "program Main;",
      "var w,h,area: integer;",
      "begin",
      "readln(w,h);",
      "area:=w*h;",
      "writeln(area);",
      "end.",
    ]
    const code = assembleBlockReorderCode(blocks, [0, 1, 2, 3, 4, 5, 6], "pascal")

    expect(code).not.toContain("  readln")
    expect(code).toContain("readln(w,h);")
  })

  it("wraps python print statements without structural wrapper", () => {
    const code = assembleBlockReorderCode(["print('Hello')"], [0], "python")
    expect(code).toBe("print('Hello')")
  })
})
