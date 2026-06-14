import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addAssignmentSetItem,
  createAssignmentSet,
  listAccessibleAssignmentSets,
  listTeacherAssignmentSets,
  type CreateAssignmentSetPayload,
} from "@/shared/api/assignmentSetsClient"
import { queryKeys } from "@/shared/config/queryKeys"

export function useTeacherAssignmentSets() {
  return useQuery({
    queryKey: queryKeys.teacherAssignmentSets,
    queryFn: () => listTeacherAssignmentSets(),
  })
}

export function useAccessibleAssignmentSets() {
  return useQuery({
    queryKey: queryKeys.accessibleAssignmentSets,
    queryFn: listAccessibleAssignmentSets,
  })
}

export function useCreateAssignmentSet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAssignmentSetPayload) => createAssignmentSet(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.teacherAssignmentSets })
    },
  })
}

export function useAddAssignmentSetItem(setId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taskId: number) => addAssignmentSetItem(setId, { task_id: taskId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.teacherAssignmentSets })
      void queryClient.invalidateQueries({ queryKey: queryKeys.accessibleAssignmentSets })
    },
  })
}
