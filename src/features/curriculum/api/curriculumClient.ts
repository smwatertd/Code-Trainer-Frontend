import { api } from "@/shared/api/client"
import type { CollectionShowcase, LanguageTrack } from "@/features/curriculum/types"

export async function fetchLanguageTrack(language: string): Promise<LanguageTrack> {
  const { data } = await api.get<LanguageTrack>(`/curriculum/${language}/collections`)
  return data
}

export async function fetchCollectionShowcase(
  language: string,
  learningConceptId: string,
): Promise<CollectionShowcase> {
  const { data } = await api.get<CollectionShowcase>(
    `/curriculum/${language}/collections/${learningConceptId}`,
  )
  return data
}
