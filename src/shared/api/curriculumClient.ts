import { api } from "@/shared/api/client"
import type {
  CurriculumDebug,
  CurriculumValidation,
  TaskCurriculumLink,
  TaskCurriculumLinkCreate,
  TaskCurriculumLinkValidate,
  TaskCurriculumLinkValidateResult,
  TaskCurriculumMetadata,
} from "@/shared/types/api"

export async function getTaskCurriculumLinks(taskId: number): Promise<TaskCurriculumMetadata> {
  const { data } = await api.get<TaskCurriculumMetadata>(`/curriculum/tasks/${taskId}/links`)
  return data
}

export async function createTaskCurriculumLink(
  taskId: number,
  payload: TaskCurriculumLinkCreate,
): Promise<TaskCurriculumLink> {
  const { data } = await api.post<TaskCurriculumLink>(`/curriculum/tasks/${taskId}/links`, payload)
  return data
}

export async function updateTaskCurriculumLink(
  taskId: number,
  linkId: number,
  payload: Partial<TaskCurriculumLinkCreate & { is_primary?: boolean }>,
): Promise<TaskCurriculumLink> {
  const { data } = await api.patch<TaskCurriculumLink>(
    `/curriculum/tasks/${taskId}/links/${linkId}`,
    payload,
  )
  return data
}

export async function deleteTaskCurriculumLink(taskId: number, linkId: number): Promise<void> {
  await api.delete(`/curriculum/tasks/${taskId}/links/${linkId}`)
}

export async function validateTaskCurriculumLink(
  payload: TaskCurriculumLinkValidate,
): Promise<TaskCurriculumLinkValidateResult> {
  const { data } = await api.post<TaskCurriculumLinkValidateResult>(
    "/curriculum/tasks/validate-link",
    payload,
  )
  return data
}

export async function validateCurriculum(language: string): Promise<CurriculumValidation> {
  const { data } = await api.get<CurriculumValidation>(`/curriculum/${language}/validate`)
  return data
}

export async function getCurriculumDebug(language: string): Promise<CurriculumDebug> {
  const { data } = await api.get<CurriculumDebug>(`/curriculum/${language}/debug`)
  return data
}
