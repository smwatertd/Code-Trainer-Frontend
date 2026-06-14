import { api } from "@/shared/api/client"
import type { TaskDetail, TaskSummary } from "@/shared/types/api"

export type TaskCatalogFilters = {
  difficulty?: string
  task_type?: string
  topic?: string
}

export async function listTasks(filters: TaskCatalogFilters = {}): Promise<TaskSummary[]> {
  const { data } = await api.get<TaskSummary[]>("/catalog/tasks", { params: filters })
  return data
}

export async function getTask(taskId: number): Promise<TaskDetail> {
  const { data } = await api.get<TaskDetail>(`/catalog/tasks/${taskId}`)
  return data
}
