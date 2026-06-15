import { describe, expect, it } from "vitest"

import {
  filterProfileSubmissions,
  mapSubmissionStatus,
} from "@/shared/utils/submissionStatus"

describe("mapSubmissionStatus", () => {
  it("maps API statuses to catalog statuses", () => {
    expect(mapSubmissionStatus("accepted")).toBe("solved")
    expect(mapSubmissionStatus("failed")).toBe("attempted")
    expect(mapSubmissionStatus("reviewing")).toBe("todo")
  })
})

describe("filterProfileSubmissions", () => {
  const rows = [
    { task_title: "Binary search", status: "accepted" },
    { task_title: "Two sum", status: "failed" },
    { task_title: "Graph path", status: "accepted" },
  ]

  it("filters by search text", () => {
    expect(filterProfileSubmissions(rows, "graph", "all")).toEqual([rows[2]])
  })

  it("filters by solved status", () => {
    expect(filterProfileSubmissions(rows, "", "solved")).toEqual([rows[0], rows[2]])
  })

  it("filters by attempted status", () => {
    expect(filterProfileSubmissions(rows, "", "attempted")).toEqual([rows[1]])
  })
})
