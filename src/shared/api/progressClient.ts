import { api } from "@/shared/api/client"
import type { TaskProgress, LearningConceptProgress } from "@/shared/types/api"

export async function getTaskProgress(taskId: number): Promise<TaskProgress> {
  const { data } = await api.get<TaskProgress>(`/progress/tasks/${taskId}`)
  return data
}

export async function getLearningConceptProgress(
  language: string,
  learningConceptId: string,
): Promise<LearningConceptProgress> {
  const { data } = await api.get<LearningConceptProgress>(
    `/progress/curriculum/${language}/${learningConceptId}`,
  )
  return data
}
