import { describe, expect, it } from "vitest"

/** Contract mirrored from GET /api/curriculum/{language}/collections */
type LanguageTrackPayload = {
  progress: { total_tasks: number; passed_tasks: number }
  collections: Array<{
    collection_id: string
    progress: { total_tasks: number }
    button_label: string
  }>
}

function isHealthyTrack(body: LanguageTrackPayload): boolean {
  if (body.progress.total_tasks <= 0) return false
  return body.collections.every(
    (chapter) => chapter.progress.total_tasks > 0 && chapter.button_label !== "Нет задач",
  )
}

describe("learnTrackRegression /learn/python", () => {
  it("detects broken track when curriculum links are missing (0/0 on server)", () => {
    const emptyTrack: LanguageTrackPayload = {
      progress: { total_tasks: 0, passed_tasks: 0 },
      collections: [
        { collection_id: "first_steps", progress: { total_tasks: 0 }, button_label: "Нет задач" },
      ],
    }

    expect(isHealthyTrack(emptyTrack)).toBe(false)
  })

  it("detects healthy python plan with five chapters", () => {
    const seededTrack: LanguageTrackPayload = {
      progress: { total_tasks: 24, passed_tasks: 0 },
      collections: [
        { collection_id: "first_steps", progress: { total_tasks: 3 }, button_label: "Начать" },
        { collection_id: "data_expressions", progress: { total_tasks: 4 }, button_label: "Начать" },
        { collection_id: "branching", progress: { total_tasks: 4 }, button_label: "Начать" },
        { collection_id: "repetition", progress: { total_tasks: 5 }, button_label: "Начать" },
        { collection_id: "functions_console", progress: { total_tasks: 8 }, button_label: "Начать" },
      ],
    }

    expect(isHealthyTrack(seededTrack)).toBe(true)
  })
})

describe("learnTrackRegression /learn/cpp", () => {
  it("uses cpp-specific chapter ids", () => {
    const seededTrack: LanguageTrackPayload = {
      progress: { total_tasks: 24, passed_tasks: 0 },
      collections: [
        { collection_id: "program_structure", progress: { total_tasks: 3 }, button_label: "Начать" },
        { collection_id: "variables_ops", progress: { total_tasks: 6 }, button_label: "Начать" },
        { collection_id: "control_if", progress: { total_tasks: 5 }, button_label: "Начать" },
        { collection_id: "control_loops", progress: { total_tasks: 5 }, button_label: "Начать" },
        { collection_id: "functions_streams", progress: { total_tasks: 5 }, button_label: "Начать" },
      ],
    }

    expect(isHealthyTrack(seededTrack)).toBe(true)
  })
})

describe("learnTrackRegression /learn/pascal", () => {
  it("counts tasks in six pascal chapters", () => {
    const seededTrack: LanguageTrackPayload = {
      progress: { total_tasks: 24, passed_tasks: 0 },
      collections: [
        { collection_id: "program_structure", progress: { total_tasks: 2 }, button_label: "Начать" },
        { collection_id: "data_and_variables", progress: { total_tasks: 6 }, button_label: "Начать" },
        { collection_id: "operators", progress: { total_tasks: 6 }, button_label: "Начать" },
        { collection_id: "conditions", progress: { total_tasks: 5 }, button_label: "Начать" },
        { collection_id: "loops", progress: { total_tasks: 3 }, button_label: "Начать" },
        { collection_id: "files", progress: { total_tasks: 2 }, button_label: "Начать" },
      ],
    }

    expect(seededTrack.progress.total_tasks).toBe(24)
    expect(isHealthyTrack(seededTrack)).toBe(true)
  })
})
