import { useQuery } from "@tanstack/react-query"
import { getTaskProgress } from "@/shared/api/progressClient"
import { queryKeys } from "@/shared/config/queryKeys"

export function useTaskProgress(taskId: number | null, enabled = true) {
  return useQuery({
    queryKey: taskId ? queryKeys.taskProgress(taskId) : ["progress", "empty"],
    queryFn: () => getTaskProgress(taskId!),
    enabled: enabled && taskId != null && taskId > 0,
  })
}
