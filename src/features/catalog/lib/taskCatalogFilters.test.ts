import { describe, expect, it } from "vitest"

import {
  collectCatalogFilterOptions,
  filterTaskSummaries,
} from "@/features/catalog/lib/taskCatalogFilters"
import type { TaskSummary } from "@/shared/types/api"

const TASKS: TaskSummary[] = [
  {
    id: 1,
    title: "A",
    description: "",
    difficulty: "easy",
    task_type: "translation",
    topics: ["basics"],
  },
  {
    id: 2,
    title: "B",
    description: "",
    difficulty: "easy",
    task_type: "task_build_from_blocks",
    topics: ["loops"],
  },
  {
    id: 3,
    title: "C",
    description: "",
    difficulty: "medium",
    task_type: "translation",
    topics: ["loops"],
  },
]

describe("filterTaskSummaries", () => {
  it("filters tasks without changing available filter source", () => {
    expect(filterTaskSummaries(TASKS, { difficulty: "easy" })).toHaveLength(2)
    expect(collectCatalogFilterOptions(TASKS).taskTypes).toEqual([
      "task_build_from_blocks",
      "translation",
    ])
  })

  it("combines multiple filters", () => {
    expect(
      filterTaskSummaries(TASKS, { difficulty: "easy", task_type: "translation" }),
    ).toEqual([TASKS[0]])
  })
})

describe("collectCatalogFilterOptions", () => {
  it("collects all distinct values from full catalog", () => {
    expect(collectCatalogFilterOptions(TASKS)).toEqual({
      difficulties: ["easy", "medium"],
      taskTypes: ["task_build_from_blocks", "translation"],
      topics: ["basics", "loops"],
    })
  })
})
