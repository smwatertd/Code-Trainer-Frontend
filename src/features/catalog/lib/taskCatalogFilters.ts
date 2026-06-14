import type { TaskSummary } from "@/shared/types/api"

export type TaskCatalogFilterValues = {
  difficulty?: string
  task_type?: string
  topic?: string
}

function taskTopics(task: TaskSummary): string[] {
  const raw = (task as TaskSummary & { topics?: string[] }).topics
  return Array.isArray(raw) ? raw : []
}

export function filterTaskSummaries(
  tasks: TaskSummary[],
  filters: TaskCatalogFilterValues,
): TaskSummary[] {
  return tasks.filter((task) => {
    if (filters.difficulty && task.difficulty !== filters.difficulty) {
      return false
    }
    if (filters.task_type && task.task_type !== filters.task_type) {
      return false
    }
    if (filters.topic && !taskTopics(task).includes(filters.topic)) {
      return false
    }
    return true
  })
}

export function collectCatalogFilterOptions(tasks: TaskSummary[]) {
  const difficulties = new Set<string>()
  const taskTypes = new Set<string>()
  const topics = new Set<string>()

  for (const task of tasks) {
    difficulties.add(task.difficulty)
    taskTypes.add(task.task_type)
    taskTopics(task).forEach((topic) => topics.add(topic))
  }

  return {
    difficulties: Array.from(difficulties).sort(),
    taskTypes: Array.from(taskTypes).sort(),
    topics: Array.from(topics).sort(),
  }
}
