import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCatalogTasks } from "@/features/catalog"
import { filterTaskSummaries } from "@/features/catalog/lib/taskCatalogFilters"
import {
  countSolvedTasks,
  findNextIncompleteTask,
} from "@/features/catalog/lib/taskCatalogView"
import TaskCatalog, { TASK_CATALOG_FILTER_ALL } from "@/features/catalog/ui/TaskCatalog"
import AssignmentSetsSidebar from "@/features/catalog/ui/AssignmentSetsSidebar"
import LearningLanguagesBlock from "@/features/catalog/ui/LearningLanguagesBlock"
import { useAuth } from "@/features/auth"
import { useLanguages } from "@/features/languages/hooks/useLanguages"
import GuestBanner from "@/shared/ui/GuestBanner"
import PageHeader from "@/shared/ui/PageHeader"
import { Button } from "@/shared/ui/button"
import { getApiErrorMessage } from "@/shared/utils/apiErrors"

export default function HomePage() {
  const navigate = useNavigate()
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
    ? `Решено ${solvedCount} из ${allTasks.length} · уровень задач постепенно повышается`
    : `Показано ${tasks.length} из ${allTasks.length} · войдите, чтобы сохранять прогресс`

  const swapLangs = () => {
    setLangFrom(langTo)
    setLangTo(langFrom)
  }

  const continueLearning = () => {
    const nextTask = findNextIncompleteTask(allTasks)
    if (nextTask) {
      navigate(`/tasks/${nextTask.id}`)
    }
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
            <Button size="sm" onClick={continueLearning}>
              ▸ Продолжить обучение
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link to="/login">Войти</Link>
            </Button>
          )
        }
      />

      <LearningLanguagesBlock />

      <div className="grid items-start gap-[18px] xl:grid-cols-[1fr_290px]">
        <TaskCatalog
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
        {isAuthenticated ? <AssignmentSetsSidebar className="hidden xl:block" /> : null}
      </div>
    </div>
  )
}
