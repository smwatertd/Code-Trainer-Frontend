import { useQuery } from "@tanstack/react-query"
import { listSubmissionHistory } from "@/shared/api/submissionsClient"
import { queryKeys } from "@/shared/config/queryKeys"

export function useSubmissionHistory(taskId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.submissionHistory(taskId ?? 0),
    queryFn: () => listSubmissionHistory(taskId as number),
    enabled: enabled && taskId != null && taskId > 0,
  })
}
