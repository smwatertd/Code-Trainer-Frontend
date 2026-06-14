import { api } from "@/shared/api/client"
import type { CheckResult } from "@/shared/types/api"

export type DemoCheckPayload = {
  task_id: number
  language: string
  code: string
  block_order?: number[]
  nodes?: Array<Record<string, unknown>>
  edges?: Array<Record<string, unknown>>
  flow?: Array<Record<string, unknown>>
}

export async function submitDemoCheck(payload: DemoCheckPayload): Promise<{ job_id: string; status: string }> {
  const { data } = await api.post<{ job_id: string; status: string }>("/demo/check", payload)
  return data
}

export async function getDemoCheckResult(jobId: string): Promise<CheckResult> {
  const { data } = await api.get<CheckResult>(`/demo/check/${jobId}`)
  return data
}
