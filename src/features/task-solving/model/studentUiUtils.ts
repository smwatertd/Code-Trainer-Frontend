import type { TaskDetail } from "@/shared/types/api"
import {
  defaultLanguage,
  isBlockReorderTask,
  isCodeToFlowchartTask,
  isFlowchartTask,
  isTranslationTask,
  isWriteFromDescriptionTask,
  problemStatement,
  sourceCode,
  sourceLanguage,
} from "@/shared/utils/taskTypes"
import { labelLanguage, labelTechnicalConcept } from "@/shared/utils/labels"

type Payload = Record<string, unknown>

function payloadOf(task: TaskDetail | null): Payload {
  return (task?.payload ?? {}) as Payload
}

const KNOWN_SOURCE_LANGUAGES = new Set(["python", "cpp", "java", "csharp", "javascript", "js", "pascal"])

export function langDisplay(lang: string | undefined): string {
  const normalized = String(lang ?? "").trim()
  if (!normalized) return "—"
  return labelLanguage(normalized)
}

const CONSTRUCTION_LABELS: Record<string, string> = {
  program_entry: "Точка входа программы",
  typed_declaration: "Объявление переменной",
  assignment: "Присваивание",
  arithmetic_ops: "Арифметические операции",
  stdout_write: "Вывод в консоль",
  if_statement: "Условие",
  for_loop: "Цикл for",
  while_loop: "Цикл while",
  io: "Ввод / вывод",
  nested_loops: "Вложенные циклы",
}

export function getConstructionLabel(
  pattern: string,
  hints: Record<string, { title?: string }> = {},
): string {
  return (
    CONSTRUCTION_LABELS[pattern] ??
    (labelTechnicalConcept(pattern) !== pattern ? labelTechnicalConcept(pattern) : null) ??
    hints[pattern]?.title ??
    pattern
  )
}

export function getTaskTestCases(task: TaskDetail | null): Array<{ inputs: string; output: string }> {
  const raw = payloadOf(task).test_cases
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      inputs: String(item.inputs ?? item.input ?? ""),
      output: String(item.output ?? item.expected_output ?? item.expected ?? ""),
    }))
}

export function getTaskConstructions(task: TaskDetail | null): string[] {
  const raw = payloadOf(task).constructions
  if (!Array.isArray(raw)) return []
  return raw.map((item) => String(item)).filter(Boolean)
}

export function getTaskConstructionHints(task: TaskDetail | null): Record<string, { title?: string }> {
  const raw = payloadOf(task).construction_hints
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}
  return raw as Record<string, { title?: string }>
}

function hasNonEmptyExample(value: unknown): boolean {
  return Boolean(String(value ?? "").trim())
}

export function getCodeExamples(task: TaskDetail | null): Record<string, string> {
  const payload = payloadOf(task)
  const examples = payload.code_examples
  if (examples && typeof examples === "object" && !Array.isArray(examples)) {
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(examples as Record<string, unknown>)) {
      if (hasNonEmptyExample(value)) {
        result[String(key).toLowerCase()] = String(value)
      }
    }
    if (Object.keys(result).length) return result
  }

  if (isTranslationTask(task ?? ({} as TaskDetail))) {
    const lang = sourceLanguage(task).toLowerCase()
    const code = sourceCode(task)
    if (lang && code.trim()) return { [lang]: code }
  }

  if (isCodeToFlowchartTask(task ?? ({} as TaskDetail))) {
    const variants = payload.source_code_by_language
    if (variants && typeof variants === "object" && !Array.isArray(variants)) {
      const result: Record<string, string> = {}
      for (const [key, value] of Object.entries(variants as Record<string, unknown>)) {
        if (hasNonEmptyExample(value)) {
          result[String(key).toLowerCase()] = String(value)
        }
      }
      if (Object.keys(result).length) return result
    }
    const lang = String(payload.source_language ?? "python").toLowerCase()
    const code = String(payload.source_code ?? "")
    if (lang && code.trim()) return { [lang]: code }
  }

  return {}
}

export function getKnownLanguages(task: TaskDetail | null): string[] {
  const langs = new Set<string>()
  for (const key of Object.keys(getCodeExamples(task))) {
    if (KNOWN_SOURCE_LANGUAGES.has(key)) langs.add(key)
  }
  const src = sourceLanguage(task).toLowerCase()
  if (src && KNOWN_SOURCE_LANGUAGES.has(src) && sourceCode(task).trim()) {
    langs.add(src)
  }
  return [...langs]
}

export function getLearningLanguages(task: TaskDetail | null, serverLanguageIds: string[] = []): string[] {
  if (!task) return serverLanguageIds
  const payload = payloadOf(task)
  const langs = new Set<string>()

  if (isBlockReorderTask(task)) {
    const variants = payload.blocks_by_language
    if (variants && typeof variants === "object" && !Array.isArray(variants)) {
      for (const key of Object.keys(variants as Record<string, unknown>)) {
        if (key) langs.add(String(key).toLowerCase())
      }
    }
    const primary = String(payload.language ?? "python").toLowerCase()
    if (primary) langs.add(primary)
  } else if (isTranslationTask(task)) {
    const target = String(payload.target_language ?? "").toLowerCase()
    if (target) langs.add(target)
    for (const id of serverLanguageIds) {
      if (id && id !== sourceLanguage(task)) langs.add(id)
    }
  } else if (isFlowchartTask(task)) {
    for (const id of serverLanguageIds) {
      if (id) langs.add(id)
    }
    const primary = String(payload.source_language ?? "python").toLowerCase()
    if (primary) langs.add(primary)
  } else {
    const target = String(payload.target_language ?? payload.language ?? "python").toLowerCase()
    if (target) langs.add(target)
    for (const id of serverLanguageIds) {
      if (id) langs.add(id)
    }
  }

  const merged = [...langs]
  if (merged.length) return merged
  return serverLanguageIds.length ? serverLanguageIds : ["python"]
}

export function getReferenceCode(task: TaskDetail | null, language: string): string | null {
  const lang = String(language || "").toLowerCase()
  if (!lang || !task) return null

  const examples = getCodeExamples(task)
  if (hasNonEmptyExample(examples[lang])) return examples[lang]
  const matchedKey = Object.keys(examples).find((key) => key.toLowerCase() === lang)
  if (matchedKey && hasNonEmptyExample(examples[matchedKey])) return examples[matchedKey]

  if (lang === sourceLanguage(task).toLowerCase() && sourceCode(task).trim()) {
    return sourceCode(task)
  }

  if (isCodeToFlowchartTask(task)) {
    const payload = payloadOf(task)
    const variants = payload.source_code_by_language as Record<string, string> | undefined
    if (variants?.[lang]?.trim()) return variants[lang]
  }

  return null
}

export function getWriteTaskReferenceText(task: TaskDetail | null): string | null {
  if (!task || !isWriteFromDescriptionTask(task)) return null
  const statement = problemStatement(task).trim()
  const description = task.description.trim()
  if (statement) {
    const lines = statement.split("\n").map((line) => `# ${line}`)
    return `# ${description}\n#\n${lines.join("\n")}`
  }
  if (description) return `# ${description}`
  return null
}

export function resolveKnownLanguage(
  task: TaskDetail | null,
  preferred?: string,
): string {
  const available = getKnownLanguages(task)
  const normalized = String(preferred ?? "").toLowerCase()
  if (normalized && available.includes(normalized)) return normalized
  if (available.includes("python")) return "python"
  return available[0] ?? "python"
}

export function resolveLearningLanguage(
  task: TaskDetail | null,
  knownLanguage: string,
  preferred?: string,
  serverLanguageIds: string[] = [],
): string {
  const available = getLearningLanguages(task, serverLanguageIds)
  const normalized = String(preferred ?? "").toLowerCase()
  const known = String(knownLanguage || "").toLowerCase()

  if (normalized && available.includes(normalized) && normalized !== known) {
    return normalized
  }

  const fromTask = defaultLanguage(task, available.filter((id) => id !== known))
  if (fromTask && fromTask !== known && available.includes(fromTask)) return fromTask

  const other = available.find((id) => id !== known)
  return other ?? fromTask ?? available[0] ?? "python"
}

export function canSwapParallelLanguages(
  knownLanguage: string,
  learningLanguage: string,
  knownLanguages: string[],
  learningLanguages: string[],
): boolean {
  const known = String(knownLanguage || "").toLowerCase()
  const learning = String(learningLanguage || "").toLowerCase()
  if (!known || !learning || known === learning) return false
  const knownSet = new Set(knownLanguages.map((id) => id.toLowerCase()))
  const learningSet = new Set(learningLanguages.map((id) => id.toLowerCase()))
  return knownSet.has(learning) && learningSet.has(known)
}

export function hasReferencePane(task: TaskDetail | null): boolean {
  if (!task) return false
  if (getKnownLanguages(task).length > 0) return true
  if (isWriteFromDescriptionTask(task)) return true
  if (isCodeToFlowchartTask(task) && getReferenceCode(task, "python")) return true
  return false
}
