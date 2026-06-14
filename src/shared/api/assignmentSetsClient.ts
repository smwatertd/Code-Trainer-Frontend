import { api } from "@/shared/api/client"
import type { AssignmentSet } from "@/shared/types/api"

export type CreateAssignmentSetPayload = {
  name: string
  description?: string
  visibility?: string
  group_id?: number | null
  deadline_at?: string | null
}

export async function createAssignmentSet(
  payload: CreateAssignmentSetPayload,
): Promise<AssignmentSet> {
  const { data } = await api.post<AssignmentSet>("/assignment-sets", payload)
  return data
}

export async function listTeacherAssignmentSets(
  includeArchived = false,
): Promise<AssignmentSet[]> {
  const { data } = await api.get<AssignmentSet[]>("/assignment-sets/mine", {
    params: { include_archived: includeArchived },
  })
  return data
}

export async function listAccessibleAssignmentSets(): Promise<AssignmentSet[]> {
  const { data } = await api.get<AssignmentSet[]>("/assignment-sets")
  return data
}

export async function getAssignmentSet(setId: number): Promise<AssignmentSet> {
  const { data } = await api.get<AssignmentSet>(`/assignment-sets/${setId}`)
  return data
}

export async function addAssignmentSetItem(
  setId: number,
  payload: { task_id: number; sort_order?: number },
): Promise<void> {
  await api.post(`/assignment-sets/${setId}/items`, payload)
}
