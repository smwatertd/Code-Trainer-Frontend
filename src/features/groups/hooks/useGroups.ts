import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createGroup,
  createGroupInvitation,
  getGroupDashboard,
  joinGroup,
  listJoinedGroups,
  listTeacherGroups,
} from "@/shared/api/groupsClient"
import { queryKeys } from "@/shared/config/queryKeys"

export function useTeacherGroups() {
  return useQuery({
    queryKey: queryKeys.teacherGroups,
    queryFn: listTeacherGroups,
  })
}

export function useJoinedGroups() {
  return useQuery({
    queryKey: queryKeys.joinedGroups,
    queryFn: listJoinedGroups,
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createGroup(name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.teacherGroups })
    },
  })
}

export function useCreateGroupInvitation() {
  return useMutation({
    mutationFn: (groupId: number) => createGroupInvitation(groupId),
  })
}

export function useJoinGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => joinGroup(code),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.joinedGroups })
      void queryClient.invalidateQueries({ queryKey: queryKeys.accessibleAssignmentSets })
    },
  })
}

export function useGroupDashboard(groupId: number) {
  return useQuery({
    queryKey: queryKeys.groupDashboard(groupId),
    queryFn: () => getGroupDashboard(groupId),
    enabled: groupId > 0,
  })
}
