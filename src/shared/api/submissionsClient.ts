import { api } from "@/shared/api/client"
import type { CheckResult } from "@/shared/types/api"

export type SubmissionPayload = {
  task_id: number
  language: string
  code: string
  block_order?: number[]
  nodes?: Array<Record<string, unknown>>
  edges?: Array<Record<string, unknown>>
  flow?: Array<Record<string, unknown>>
}

export async function submitSubmission(
  payload: SubmissionPayload,
): Promise<{ id: number; status: string }> {
  const { data } = await api.post<{ id: number; status: string }>("/submissions", payload)
  return data
}

export async function getSubmission(submissionId: number): Promise<CheckResult> {
  const { data } = await api.get<CheckResult>(`/submissions/${submissionId}`)
  return data
}

export type SubmissionHistoryItem = {
  id: number
  task_id: number
  language: string
  status: string
  success: boolean | null
  created_at: string | null
  duration_ms: number | null
}

export async function listSubmissionHistory(taskId: number, limit = 20): Promise<SubmissionHistoryItem[]> {
  const { data } = await api.get<SubmissionHistoryItem[]>("/submissions/history", {
    params: { task_id: taskId, limit },
  })
  return data
}
