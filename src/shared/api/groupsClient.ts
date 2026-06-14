import { api } from "@/shared/api/client"
import type { GroupDashboard, InvitationCode, StudyGroup } from "@/shared/types/api"

export async function createGroup(name: string): Promise<StudyGroup> {
  const { data } = await api.post<StudyGroup>("/groups", { name })
  return data
}

export async function listTeacherGroups(): Promise<StudyGroup[]> {
  const { data } = await api.get<StudyGroup[]>("/groups/mine")
  return data
}

export async function listJoinedGroups(): Promise<StudyGroup[]> {
  const { data } = await api.get<StudyGroup[]>("/groups/joined")
  return data
}

export async function joinGroup(code: string): Promise<StudyGroup> {
  const { data } = await api.post<StudyGroup>("/groups/join", { code })
  return data
}

export async function createGroupInvitation(
  groupId: number,
  payload: { max_uses?: number | null; expires_in_days?: number | null } = {},
): Promise<InvitationCode> {
  const { data } = await api.post<InvitationCode>(`/groups/${groupId}/invitations`, payload)
  return data
}

export async function getGroupDashboard(groupId: number): Promise<GroupDashboard> {
  const { data } = await api.get<GroupDashboard>(`/groups/${groupId}/dashboard`)
  return data
}
