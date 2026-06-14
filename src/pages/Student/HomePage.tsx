import { useMemo, useState } from "react"
import { useCatalogTasks } from "@/features/catalog"
import { filterTaskSummaries } from "@/features/catalog/lib/taskCatalogFilters"
import TaskCatalog, { TASK_CATALOG_FILTER_ALL } from "@/features/catalog/ui/TaskCatalog"
import { useAuth } from "@/features/auth"
import ProgressSummary from "@/features/progress/ui/ProgressSummary"
import GuestBanner from "@/shared/ui/GuestBanner"
import { getApiErrorMessage } from "@/shared/utils/apiErrors"

export default function HomePage() {
  const { isAuthenticated, isGuest } = useAuth()
  const [difficultyFilter, setDifficultyFilter] = useState(TASK_CATALOG_FILTER_ALL)
  const [taskTypeFilter, setTaskTypeFilter] = useState(TASK_CATALOG_FILTER_ALL)
  const [topicFilter, setTopicFilter] = useState(TASK_CATALOG_FILTER_ALL)

  const filters = useMemo(
    () => ({
      difficulty: difficultyFilter === TASK_CATALOG_FILTER_ALL ? undefined : difficultyFilter,
      task_type: taskTypeFilter === TASK_CATALOG_FILTER_ALL ? undefined : taskTypeFilter,
      topic: topicFilter === TASK_CATALOG_FILTER_ALL ? undefined : topicFilter,
    }),
    [difficultyFilter, taskTypeFilter, topicFilter],
  )

  const { data: allTasks = [], isLoading, error } = useCatalogTasks()
  const tasks = useMemo(
    () => filterTaskSummaries(allTasks, filters),
    [allTasks, filters],
  )

  return (
    <div>
      {isGuest ? <GuestBanner /> : null}
      {isAuthenticated ? <ProgressSummary /> : null}
      <TaskCatalog
        tasks={tasks}
        filterSourceTasks={allTasks}
        isLoading={isLoading}
        error={error ? getApiErrorMessage(error) : null}
        taskLinkPrefix="/tasks"
        title="Задачи"
        description={
          isAuthenticated
            ? "Решайте задачи с сохранением прогресса."
            : "Решайте задачи без регистрации. Войдите, чтобы сохранять прогресс."
        }
        difficultyFilter={difficultyFilter}
        taskTypeFilter={taskTypeFilter}
        topicFilter={topicFilter}
        onDifficultyFilterChange={setDifficultyFilter}
        onTaskTypeFilterChange={setTaskTypeFilter}
        onTopicFilterChange={setTopicFilter}
      />
    </div>
  )
}
