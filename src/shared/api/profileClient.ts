import { api } from "@/shared/api/client"
import type { MyProfile, UserProfile } from "@/shared/types/profile"

export async function getMyProfile(): Promise<MyProfile> {
  const { data } = await api.get<MyProfile>("/profiles/me")
  return data
}

export async function getUserProfile(
  userId: number,
  options: { teacherId?: number | null } = {},
): Promise<UserProfile> {
  const params: Record<string, number> = {}
  if (options.teacherId != null) {
    params.teacher_id = options.teacherId
  }
  const { data } = await api.get<UserProfile>(`/profiles/users/${userId}`, { params })
  return data
}
