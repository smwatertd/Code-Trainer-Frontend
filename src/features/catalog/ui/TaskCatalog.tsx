import { useMemo } from "react"
import { Link } from "react-router-dom"
import { collectCatalogFilterOptions } from "@/features/catalog/lib/taskCatalogFilters"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent } from "@/shared/ui/card"
import EmptyState from "@/shared/ui/EmptyState"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import type { TaskSummary } from "@/shared/types/api"
import { labelDifficulty, labelTaskType, labelTopic } from "@/shared/utils/labels"

type TaskCatalogProps = {
  tasks: TaskSummary[]
  filterSourceTasks?: TaskSummary[]
  isLoading: boolean
  error?: string | null
  taskLinkPrefix: string
  title: string
  description: string
  difficultyFilter?: string
  taskTypeFilter?: string
  topicFilter?: string
  onDifficultyFilterChange?: (value: string) => void
  onTaskTypeFilterChange?: (value: string) => void
  onTopicFilterChange?: (value: string) => void
}

const ALL = "__all__"

export default function TaskCatalog({
  tasks,
  filterSourceTasks,
  isLoading,
  error,
  taskLinkPrefix,
  title,
  description,
  difficultyFilter = ALL,
  taskTypeFilter = ALL,
  topicFilter = ALL,
  onDifficultyFilterChange,
  onTaskTypeFilterChange,
  onTopicFilterChange,
}: TaskCatalogProps) {
  const optionTasks = filterSourceTasks ?? tasks
  const { difficulties, taskTypes, topics } = useMemo(
    () => collectCatalogFilterOptions(optionTasks),
    [optionTasks],
  )

  if (isLoading) {
    return <p className="px-4 py-12 text-center text-muted-foreground">Загрузка каталога…</p>
  }

  if (error) {
    return (
      <EmptyState
        title="Не удалось загрузить задачи"
        description={error}
        className="mx-4"
      />
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Select value={difficultyFilter} onValueChange={onDifficultyFilterChange}>
            <SelectTrigger className="w-[180px]" data-testid="filter-difficulty">
              <SelectValue placeholder="Сложность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все сложности</SelectItem>
              {difficulties.map((value) => (
                <SelectItem key={value} value={value}>
                  {labelDifficulty(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={taskTypeFilter} onValueChange={onTaskTypeFilterChange}>
            <SelectTrigger className="w-[220px]" data-testid="filter-task-type">
              <SelectValue placeholder="Тип задачи" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все типы</SelectItem>
              {taskTypes.map((value) => (
                <SelectItem key={value} value={value}>
                  {labelTaskType(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {topics.length > 0 ? (
            <Select value={topicFilter} onValueChange={onTopicFilterChange}>
              <SelectTrigger className="w-[180px]" data-testid="filter-topic">
                <SelectValue placeholder="Тема" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Все темы</SelectItem>
                {topics
                  .sort((left, right) => labelTopic(left).localeCompare(labelTopic(right), "ru"))
                  .map((value) => (
                  <SelectItem key={value} value={value}>
                    {labelTopic(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </div>
      </div>
      {tasks.length === 0 ? (
        <EmptyState title="Нет задач по выбранным фильтрам" description="Попробуйте сбросить фильтры." />
      ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Link key={task.id} to={`${taskLinkPrefix}/${task.id}`} data-testid={`catalog-task-${task.id}`}>
            <Card className="h-full transition hover:border-primary/60 hover:shadow-glow-lime">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">#{task.id}</span>
                  <Badge variant="muted">{labelDifficulty(task.difficulty)}</Badge>
                </div>
                <h2 className="font-semibold">{task.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{task.description}</p>
                <p className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">{labelTaskType(task.task_type)}</Badge>
                  {((task as TaskSummary & { topics?: string[] }).topics ?? []).slice(0, 2).map((topic) => (
                    <Badge key={topic} variant="muted">
                      {labelTopic(topic)}
                    </Badge>
                  ))}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      )}
    </div>
  )
}

export { ALL as TASK_CATALOG_FILTER_ALL }
