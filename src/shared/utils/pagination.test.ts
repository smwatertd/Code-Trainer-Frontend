import { describe, expect, it } from "vitest"

import { getVisiblePageNumbers } from "@/shared/utils/pagination"

describe("getVisiblePageNumbers", () => {
  it("returns all pages when total fits the window", () => {
    expect(getVisiblePageNumbers(1, 3)).toEqual([1, 2, 3])
  })

  it("shows the first window at the start", () => {
    expect(getVisiblePageNumbers(1, 10)).toEqual([1, 2, 3, 4, 5])
    expect(getVisiblePageNumbers(3, 10)).toEqual([1, 2, 3, 4, 5])
  })

  it("slides the window around the current page", () => {
    expect(getVisiblePageNumbers(6, 10)).toEqual([4, 5, 6, 7, 8])
    expect(getVisiblePageNumbers(7, 12)).toEqual([5, 6, 7, 8, 9])
  })

  it("shows the last window at the end", () => {
    expect(getVisiblePageNumbers(10, 10)).toEqual([6, 7, 8, 9, 10])
    expect(getVisiblePageNumbers(12, 12)).toEqual([8, 9, 10, 11, 12])
  })

  it("returns empty list when there are no pages", () => {
    expect(getVisiblePageNumbers(1, 0)).toEqual([])
    expect(getVisiblePageNumbers(6, -1)).toEqual([])
  })

  it("keeps page 6 visible in the sliding window", () => {
    expect(getVisiblePageNumbers(6, 10)).toContain(6)
    expect(getVisiblePageNumbers(6, 10)).toEqual([4, 5, 6, 7, 8])
  })
})
