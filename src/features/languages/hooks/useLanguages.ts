import { useQuery } from "@tanstack/react-query"
import { listLanguages } from "@/shared/api/languagesClient"
import { queryKeys } from "@/shared/config/queryKeys"

export function useLanguages() {
  return useQuery({
    queryKey: queryKeys.languages,
    queryFn: listLanguages,
  })
}
