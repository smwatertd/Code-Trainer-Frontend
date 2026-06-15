import { api } from "@/shared/api/client"
import type { TaskDetail, TaskSummary } from "@/shared/types/api"

export type TeacherTaskPayload = {
  title: string
  description: string
  difficulty: string
  task_type: string
  payload: Record<string, unknown>
}

export async function listTeacherTasks(): Promise<TaskSummary[]> {
  const { data } = await api.get<TaskSummary[]>("/teacher/tasks/mine")
  return data
}

export async function getTeacherTask(taskId: number): Promise<TaskDetail> {
  const { data } = await api.get<TaskDetail>(`/teacher/tasks/${taskId}`)
  return data
}

export async function createTeacherTask(body: TeacherTaskPayload): Promise<TaskDetail> {
  const { data } = await api.post<TaskDetail>("/teacher/tasks", body)
  return data
}

export async function updateTeacherTask(
  taskId: number,
  body: Partial<TeacherTaskPayload>,
): Promise<TaskDetail> {
  const { data } = await api.patch<TaskDetail>(`/teacher/tasks/${taskId}`, body)
  return data
}
