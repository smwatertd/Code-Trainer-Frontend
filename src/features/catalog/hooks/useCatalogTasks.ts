import { useQuery } from "@tanstack/react-query"
import { listTasks, type TaskCatalogFilters } from "@/shared/api/catalogClient"
import { queryKeys } from "@/shared/config/queryKeys"

export function useCatalogTasks(filters: TaskCatalogFilters = {}) {
  return useQuery({
    queryKey: queryKeys.catalogTasks(filters),
    queryFn: () => listTasks(filters),
  })
}
