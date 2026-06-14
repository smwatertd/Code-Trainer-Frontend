import { useQuery } from "@tanstack/react-query"
import {
  fetchCollectionShowcase,
  fetchLanguageTrack,
} from "@/features/curriculum/api/curriculumClient"
import { queryKeys } from "@/shared/config/queryKeys"

export function useLanguageTrack(language: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.languageTrack(language),
    queryFn: () => fetchLanguageTrack(language),
    enabled: enabled && Boolean(language),
  })
}

export function useCollectionShowcase(
  language: string,
  learningConceptId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.collectionShowcase(language, learningConceptId),
    queryFn: () => fetchCollectionShowcase(language, learningConceptId),
    enabled: enabled && Boolean(language && learningConceptId),
  })
}
