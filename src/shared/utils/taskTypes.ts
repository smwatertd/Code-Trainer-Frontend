import type { TaskDetail } from "@/shared/types/api"

export function isTranslationTask(task: TaskDetail): boolean {
  return task.task_type === "translation"
}

export function isWriteFromDescriptionTask(task: TaskDetail): boolean {
  return (
    task.task_type === "task_write_from_description" || task.task_type === "algorithm"
  )
}

export function isCodingTask(task: TaskDetail): boolean {
  return isTranslationTask(task) || isWriteFromDescriptionTask(task)
}

export function isBlockReorderTask(task: TaskDetail): boolean {
  return task.task_type === "task_build_from_blocks"
}

export function isFlowchartTask(task: TaskDetail): boolean {
  return task.task_type === "task_flowchart_to_code"
}

export function isCodeToFlowchartTask(task: TaskDetail): boolean {
  return isFlowchartTask(task) && task.payload.flowchart_mode === "code_to_flowchart"
}

export function sourceLanguage(task: TaskDetail | null): string {
  if (!task) return ""
  return String(task.payload.source_language ?? "python").trim()
}

export function sourceCode(task: TaskDetail | null): string {
  if (!task) return ""
  return String(task.payload.source_code ?? "")
}

export function starterCode(task: TaskDetail | null): string {
  if (!task) return ""
  if (isTranslationTask(task)) return ""
  return String(task.payload.template ?? "")
}

export function problemStatement(task: TaskDetail | null): string {
  if (!task) return ""
  return String(task.payload.problem_statement ?? "")
}

export function selectableLanguages(
  task: TaskDetail | null,
  languages: Array<{ id: string; label?: string }>,
): Array<{ id: string; label?: string }> {
  if (!task || !isTranslationTask(task)) return languages
  const source = sourceLanguage(task)
  if (!source) return languages
  return languages.filter((item) => item.id !== source)
}

export function defaultLanguage(
  task: TaskDetail | null,
  availableLanguageIds?: string[],
): string {
  if (!task) return "python"
  const payload = task.payload

  if (isTranslationTask(task)) {
    const source = sourceLanguage(task)
    const target = String(payload.target_language ?? "").trim()
    const pool = (availableLanguageIds ?? []).filter((id) => id && id !== source)
    if (target && target !== source) return target
    if (pool.length) return pool[0]
    return target && target !== source ? target : "python"
  }

  return String(
    payload.target_language ?? payload.language ?? payload.source_language ?? "python",
  )
}

export function resolveSolverLanguage(
  task: TaskDetail | null,
  language: string,
  availableLanguageIds: string[],
): string {
  if (!task || !isTranslationTask(task)) return language
  const selectable = availableLanguageIds.filter((id) => id !== sourceLanguage(task))
  if (selectable.includes(language)) return language
  return defaultLanguage(task, selectable)
}
