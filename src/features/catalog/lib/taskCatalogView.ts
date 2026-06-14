import type { TaskSummary } from "@/shared/types/api"
import { labelLanguage, labelProgressStatus } from "@/shared/utils/labels"

export type CatalogStudentStatus = "solved" | "attempted" | "todo"

export function catalogStudentStatus(progressStatus?: string | null): CatalogStudentStatus {
  if (progressStatus === "passed") return "solved"
  if (progressStatus === "failed") return "attempted"
  return "todo"
}

export function catalogStatusLabel(progressStatus?: string | null): string {
  const status = catalogStudentStatus(progressStatus)
  if (status === "solved") return "Решено"
  if (status === "attempted") return "В процессе"
  return labelProgressStatus("not_started")
}

export function formatTaskLanguageLabels(languages: string[] | undefined): string {
  if (!languages?.length) return "—"
  return languages.map((language) => labelLanguage(language)).join(", ")
}

export function countSolvedTasks(tasks: TaskSummary[]): number {
  return tasks.filter((task) => task.progress_status === "passed").length
}

export function findNextIncompleteTask(tasks: TaskSummary[]): TaskSummary | undefined {
  return tasks.find((task) => task.progress_status !== "passed")
}

export function matchesLanguageFilter(
  task: TaskSummary,
  langFrom: string,
  langTo: string,
  allValue: string,
): boolean {
  const languages = task.languages ?? []
  if (langFrom !== allValue) {
    const fromId = resolveLanguageId(langFrom)
    if (fromId && !languages.includes(fromId)) return false
  }
  if (langTo !== allValue) {
    const toId = resolveLanguageId(langTo)
    if (toId && !languages.includes(toId)) return false
  }
  return true
}

function resolveLanguageId(value: string): string | null {
  const normalized = value.trim().toLowerCase()
  if (!normalized || normalized === "любой язык") return null
  const byLabel = Object.entries({
    python: "Python",
    pascal: "Pascal",
    java: "Java",
    cpp: "C++",
    csharp: "C#",
  }).find(([, label]) => label.toLowerCase() === normalized || label === value)
  return byLabel?.[0] ?? normalized
}

export function matchesStatusFilter(
  task: TaskSummary,
  statusFilter: string,
  allValue: string,
): boolean {
  if (statusFilter === allValue) return true
  return catalogStudentStatus(task.progress_status) === statusFilter
}
