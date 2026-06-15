import { describe, expect, it } from "vitest"
import {
  assemblePlaceholderCode,
  countPlaceholderSlots,
  getPlaceholderBank,
  getPlaceholderTemplate,
  PLACEHOLDER_TOKEN,
} from "@/features/task-solving/model/placeholderTask"

describe("placeholderTask", () => {
  const task = {
    payload: {
      placeholder_template: "name = ___()\nprice = ___(input())",
      placeholder_bank: ["input", "int", "float"],
    },
  }

  it("counts placeholder slots", () => {
    expect(countPlaceholderSlots("")).toBe(0)
    expect(countPlaceholderSlots("no gaps")).toBe(0)
    expect(countPlaceholderSlots("a ___ b ___ c")).toBe(2)
  })

  it("assembles code from fills", () => {
    const template = "if total ___ 0:\n    print(___)"
    expect(assemblePlaceholderCode(template, [">=", "name"])).toBe(
      "if total >= 0:\n    print(name)",
    )
    expect(assemblePlaceholderCode("plain", [])).toBe("plain")
  })

  it("keeps unfilled slots as token", () => {
    expect(assemblePlaceholderCode("a ___ b", [])).toBe(`a ${PLACEHOLDER_TOKEN} b`)
  })

  it("reads template and bank from payload", () => {
    expect(getPlaceholderTemplate(task)).toBe("name = ___()\nprice = ___(input())")
    expect(getPlaceholderBank(task)).toEqual(["input", "int", "float"])
    expect(getPlaceholderTemplate(null)).toBe("")
    expect(getPlaceholderBank(null)).toEqual([])
  })
})
