import { describe, expect, it } from "vitest"
import { getConstructionCatalogSize, getConstructionDetail } from "@/features/task-solving/model/constructionCatalog"
import { pickConstructionExamples } from "@/features/task-solving/model/constructionChipExamples"

describe("constructionChipExamples", () => {
  it("loads full TC reference catalog with 42 concepts", () => {
    expect(getConstructionCatalogSize()).toBe(42)
    expect(getConstructionDetail("inheritance_hierarchy")?.examples.java?.length).toBeGreaterThan(0)
  })

  it("returns catalog examples for known pattern and language", () => {
    const examples = pickConstructionExamples("program_entry", undefined, "pascal")
    expect(examples.length).toBe(3)
    expect(examples[0]?.code).toContain("program Hello")
  })

  it("prefers task hint variants over catalog", () => {
    const examples = pickConstructionExamples("program_entry", {
      variants: {
        pascal: [{ name: "Из задачи", code: "program Demo;" }],
      },
    }, "pascal")

    expect(examples).toEqual([{ title: "Из задачи", code: "program Demo;" }])
  })

  it("uses hint.examples string when variants are absent", () => {
    const examples = pickConstructionExamples("stdout_write", {
      examples: { python: "print('ok')" },
    }, "python")

    expect(examples).toEqual([{ title: "Пример", code: "print('ok')" }])
  })

  it("returns language-specific examples for java instead of only python fallback", () => {
    const examples = pickConstructionExamples("counted_loop", undefined, "java")
    expect(examples.length).toBeGreaterThan(0)
    expect(examples.some((item) => /System\.out|for\s*\(/.test(item.code))).toBe(true)
  })
})
