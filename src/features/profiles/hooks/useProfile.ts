import { useQuery } from "@tanstack/react-query"
import { getMyProfile, getUserProfile } from "@/shared/api/profileClient"
import { queryKeys } from "@/shared/config/queryKeys"

export function useMyProfile(enabled = true) {
  return useQuery({
    queryKey: queryKeys.myProfile,
    queryFn: getMyProfile,
    enabled,
  })
}

export function useUserProfile(userId: number, teacherId?: number | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.userProfile(userId, teacherId ?? null),
    queryFn: () => getUserProfile(userId, { teacherId }),
    enabled: enabled && userId > 0,
  })
}
