import { describe, expect, it } from "vitest"
import {
  CURRICULUM_TRACK_LANGUAGE_IDS,
  TRACK_LANGUAGE_OPTIONS,
  isTrackLanguageAvailable,
} from "@/features/curriculum/ui/LangMini"

describe("LangMini track languages", () => {
  it("marks all app languages as available curriculum tracks", () => {
    for (const id of ["python", "pascal", "cpp", "csharp", "java"]) {
      expect(isTrackLanguageAvailable(id)).toBe(true)
      expect(CURRICULUM_TRACK_LANGUAGE_IDS.has(id)).toBe(true)
    }
  })

  it("marks unknown languages as unavailable", () => {
    expect(isTrackLanguageAvailable("rust")).toBe(false)
    expect(isTrackLanguageAvailable("go")).toBe(false)
  })

  it("exposes routes for every track language", () => {
    for (const option of TRACK_LANGUAGE_OPTIONS) {
      expect(option.route).toBe(`/learn/${option.id}`)
      expect(isTrackLanguageAvailable(option.id)).toBe(true)
    }
  })
})
