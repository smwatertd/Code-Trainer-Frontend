import { useQuery } from "@tanstack/react-query"
import { getLearningConceptProgress } from "@/shared/api/progressClient"
import { queryKeys } from "@/shared/config/queryKeys"

export function useLearningConceptProgress(
  language: string,
  learningConceptId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.learningConceptProgress(language, learningConceptId),
    queryFn: () => getLearningConceptProgress(language, learningConceptId),
    enabled: enabled && Boolean(language && learningConceptId),
  })
}
