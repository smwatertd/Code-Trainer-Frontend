import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as curriculumClient from "@/shared/api/curriculumClient"
import { queryKeys } from "@/shared/config/queryKeys"
import type { TaskCurriculumLinkCreate, TaskCurriculumLinkValidate } from "@/shared/types/api"

export function useTaskCurriculumLinks(taskId: number | null) {
  return useQuery({
    queryKey: taskId ? queryKeys.curriculumLinks(taskId) : ["curriculum", "empty"],
    queryFn: () => curriculumClient.getTaskCurriculumLinks(taskId!),
    enabled: taskId != null && taskId > 0,
  })
}

export function useValidateCurriculumLink() {
  return useMutation({
    mutationFn: (payload: TaskCurriculumLinkValidate) =>
      curriculumClient.validateTaskCurriculumLink(payload),
  })
}

export function useCreateCurriculumLink(taskId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TaskCurriculumLinkCreate) =>
      curriculumClient.createTaskCurriculumLink(taskId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.curriculumLinks(taskId) })
    },
  })
}

export function useDeleteCurriculumLink(taskId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (linkId: number) => curriculumClient.deleteTaskCurriculumLink(taskId, linkId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.curriculumLinks(taskId) })
    },
  })
}

export function useCurriculumValidation(language: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.curriculumValidate(language),
    queryFn: () => curriculumClient.validateCurriculum(language),
    enabled: enabled && Boolean(language),
  })
}

export function useCurriculumDebug(language: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.curriculumDebug(language),
    queryFn: () => curriculumClient.getCurriculumDebug(language),
    enabled: enabled && Boolean(language),
  })
}
