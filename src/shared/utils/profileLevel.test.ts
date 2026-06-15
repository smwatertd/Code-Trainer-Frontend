import { describe, expect, it } from "vitest"

import { computeStreakDays, levelLabelFromSolved } from "@/shared/utils/profileLevel"

describe("levelLabelFromSolved", () => {
  it("maps solved counts to level labels", () => {
    expect(levelLabelFromSolved(0)).toBe("Beginner")
    expect(levelLabelFromSolved(10)).toBe("Newcomer")
    expect(levelLabelFromSolved(30)).toBe("Junior")
    expect(levelLabelFromSolved(80)).toBe("Middle")
  })
})

describe("computeStreakDays", () => {
  it("counts consecutive active days ending today", () => {
    const today = new Date()
    const day = (offset: number) => {
      const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
      date.setUTCDate(date.getUTCDate() - offset)
      return date.toISOString().slice(0, 10)
    }

    expect(
      computeStreakDays({
        [day(0)]: 2,
        [day(1)]: 1,
        [day(2)]: 3,
      }),
    ).toBe(3)
  })

  it("returns zero when today has no activity", () => {
    const yesterday = new Date()
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)
    expect(
      computeStreakDays({
        [yesterday.toISOString().slice(0, 10)]: 1,
      }),
    ).toBe(0)
  })
})
