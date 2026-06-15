import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useCatalogTasks } from "@/features/catalog"
import { filterTaskSummaries } from "@/features/catalog/lib/taskCatalogFilters"
import { countSolvedTasks } from "@/features/catalog/lib/taskCatalogView"
import TaskCatalog, { TASK_CATALOG_FILTER_ALL } from "@/features/catalog/ui/TaskCatalog"
import AssignmentSetsSidebar from "@/features/catalog/ui/AssignmentSetsSidebar"
import { useAuth } from "@/features/auth"
import { useLanguages } from "@/features/languages/hooks/useLanguages"
import GuestBanner from "@/shared/ui/GuestBanner"
import PageHeader from "@/shared/ui/PageHeader"
import { Button } from "@/shared/ui/button"
import { getApiErrorMessage } from "@/shared/utils/apiErrors"

export default function HomePage() {
  const { isAuthenticated, isGuest } = useAuth()
  const { data: languages = [] } = useLanguages()
  const [difficultyFilter, setDifficultyFilter] = useState(TASK_CATALOG_FILTER_ALL)
  const [taskTypeFilter, setTaskTypeFilter] = useState(TASK_CATALOG_FILTER_ALL)
  const [topicFilter, setTopicFilter] = useState(TASK_CATALOG_FILTER_ALL)
  const [statusFilter, setStatusFilter] = useState(TASK_CATALOG_FILTER_ALL)
  const [langFrom, setLangFrom] = useState(TASK_CATALOG_FILTER_ALL)
  const [langTo, setLangTo] = useState(TASK_CATALOG_FILTER_ALL)

  const languageOptions = useMemo(
    () => languages.map((language) => language.label).filter(Boolean),
    [languages],
  )

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

  const solvedCount = useMemo(() => countSolvedTasks(allTasks), [allTasks])
  const subtitle = isAuthenticated
    ? `Решено ${solvedCount} из ${allTasks.length} · средняя сложность растёт`
    : `Показано ${tasks.length} из ${allTasks.length} · войдите, чтобы сохранять прогресс`

  const swapLangs = () => {
    setLangFrom(langTo)
    setLangTo(langFrom)
  }

  return (
    <div>
      {isGuest ? (
        <div className="mb-4">
          <GuestBanner />
        </div>
      ) : null}

      <PageHeader
        title="Список задач"
        subtitle={subtitle}
        right={
          isAuthenticated ? (
            <Button size="sm" variant="secondary" asChild>
              <Link to="/student/profile">Профиль ученика</Link>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to="/login">Войти</Link>
            </Button>
          )
        }
      />

      <div
        className={
          isAuthenticated
            ? "flex flex-col gap-[18px xl:flex-row xl:items-start xl:gap-6"
            : undefined
        }
      >
        <TaskCatalog
          className={isAuthenticated ? "min-w-0 flex-1" : "w-full"}
          tasks={tasks}
          filterSourceTasks={allTasks}
          isLoading={isLoading}
          error={error ? getApiErrorMessage(error) : null}
          taskLinkPrefix="/tasks"
          difficultyFilter={difficultyFilter}
          taskTypeFilter={taskTypeFilter}
          topicFilter={topicFilter}
          statusFilter={statusFilter}
          langFrom={langFrom}
          langTo={langTo}
          languageOptions={languageOptions}
          onDifficultyFilterChange={setDifficultyFilter}
          onTaskTypeFilterChange={setTaskTypeFilter}
          onTopicFilterChange={setTopicFilter}
          onStatusFilterChange={setStatusFilter}
          onLangFromChange={setLangFrom}
          onLangToChange={setLangTo}
          onSwapLangs={swapLangs}
        />

        {isAuthenticated ? (
          <AssignmentSetsSidebar className="w-full shrink-0 xl:w-[290px]" />
        ) : null}
      </div>
    </div>
  )
}
