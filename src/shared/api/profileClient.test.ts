import { afterEach, describe, expect, it, vi } from "vitest"

const { getMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
}))

vi.mock("@/shared/api/client", () => ({
  api: { get: getMock },
}))

import { getMyProfile, getUserProfile } from "@/shared/api/profileClient"

describe("profileClient", () => {
  afterEach(() => {
    getMock.mockReset()
  })

  it("loads own profile", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        user_id: 1,
        name: "Student Dev",
        email: "student@code-trainer.dev",
        role: "student",
        handle: "@student",
        level: "Beginner",
        solved_tasks_count: 0,
        total_tasks_attempted: 0,
        success_rate: 0,
        streak_days: 0,
        groups_count: 0,
        activity_by_date: {},
        recent_submissions: [],
        skills: [],
      },
    })

    const profile = await getMyProfile()
    expect(getMock).toHaveBeenCalledWith("/profiles/me")
    expect(profile.name).toBe("Student Dev")
  })

  it("loads public profile with optional teacher scope", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        kind: "student",
        user_id: 1,
        name: "Student Dev",
      },
    })

    await getUserProfile(1, { teacherId: 2 })
    expect(getMock).toHaveBeenCalledWith("/profiles/users/1", { params: { teacher_id: 2 } })
  })

  it("loads teacher public profile without teacher_id param", async () => {
    getMock.mockResolvedValueOnce({
      data: {
        kind: "teacher",
        user_id: 2,
        name: "Teacher Dev",
      },
    })

    await getUserProfile(2)
    expect(getMock).toHaveBeenCalledWith("/profiles/users/2", { params: {} })
  })
})
