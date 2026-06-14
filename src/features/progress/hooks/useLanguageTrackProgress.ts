import { useMemo } from "react"
import { useLearningConceptProgress } from "@/features/progress/hooks/useLearningConceptProgress"

const TRACK_CONCEPTS = ["loops", "conditions", "functions"] as const

export function useLanguageTrackProgress(language: string, enabled: boolean) {
  const loops = useLearningConceptProgress(language, "loops", enabled)
  const conditions = useLearningConceptProgress(language, "conditions", enabled)
  const functions = useLearningConceptProgress(language, "functions", enabled)

  return useMemo(() => {
    const queries = [loops, conditions, functions]
    const isLoading = enabled && queries.some((query) => query.isLoading)
    const rows = queries.map((query) => query.data).filter(Boolean)

    const passedTasks = rows.reduce((sum, row) => sum + (row?.passed_tasks ?? 0), 0)
    const totalTasks = rows.reduce((sum, row) => sum + (row?.total_tasks ?? 0), 0)
    const progressPercent = totalTasks
      ? Math.min(100, Math.round((passedTasks / totalTasks) * 100))
      : 0

    return {
      isLoading,
      passedTasks,
      totalTasks,
      progressPercent,
    }
  }, [enabled, loops, conditions, functions])
}

export { TRACK_CONCEPTS }
