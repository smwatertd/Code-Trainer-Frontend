import { useQuery } from "@tanstack/react-query"
import { getTask } from "@/shared/api/catalogClient"
import { queryKeys } from "@/shared/config/queryKeys"

export function useTaskDetail(taskId: number | null) {
  return useQuery({
    queryKey: taskId ? queryKeys.catalogTask(taskId) : ["catalog", "tasks", "empty"],
    queryFn: () => getTask(taskId!),
    enabled: taskId != null && taskId > 0,
  })
}
