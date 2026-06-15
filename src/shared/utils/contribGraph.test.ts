import { describe, expect, it } from "vitest"

import {
  buildContribGrid,
  buildSeedContribGrid,
  levelFromCount,
} from "@/shared/utils/contribGraph"

describe("levelFromCount", () => {
  it("returns zero for empty activity", () => {
    expect(levelFromCount(0, 10)).toBe(0)
    expect(levelFromCount(3, 0)).toBe(0)
  })

  it("maps relative intensity to levels 1-4", () => {
    expect(levelFromCount(2, 10)).toBe(1)
    expect(levelFromCount(4, 10)).toBe(2)
    expect(levelFromCount(7, 10)).toBe(3)
    expect(levelFromCount(9, 10)).toBe(4)
  })
})

describe("buildContribGrid", () => {
  it("builds a grid with correct week/day dimensions", () => {
    const grid = buildContribGrid({}, 4)
    expect(grid).toHaveLength(4)
    expect(grid.every((week) => week.length === 7)).toBe(true)
  })

  it("assigns higher levels to busier days", () => {
    const today = new Date()
    const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
    const key = end.toISOString().slice(0, 10)

    const grid = buildContribGrid({ [key]: 10 }, 1)
    expect(grid[0]?.some((level) => level > 0)).toBe(true)
  })
})

describe("buildSeedContribGrid", () => {
  it("is deterministic for the same week count", () => {
    expect(buildSeedContribGrid(3)).toEqual(buildSeedContribGrid(3))
  })
})
