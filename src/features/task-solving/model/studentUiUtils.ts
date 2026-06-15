import type { TaskDetail } from "@/shared/types/api"
import {
  defaultLanguage,
  isBlockReorderTask,
  isCodeToFlowchartTask,
  isDebugTranslationTask,
  isFlowchartTask,
  isPlaceholderTask,
  isTranslationTask,
  isWriteFromDescriptionTask,
  problemStatement,
  sourceCode,
  sourceLanguage,
} from "@/shared/utils/taskTypes"
import { labelLanguage, labelTechnicalConcept } from "@/shared/utils/labels"
import { getConstructionDetail } from "@/features/task-solving/model/constructionCatalog"
import {
  isStubCodeExample,
} from "@/features/task-solving/model/placeholderTask"
import { inferCodeLanguage } from "@/features/task-solving/model/codeLanguageHeuristic"

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
  stdin_read: "Ввод с клавиатуры",
  if_statement: "Условие",
  for_loop: "Цикл for",
  while_loop: "Цикл while",
  counted_loop: "Цикл со счётчиком",
  io: "Ввод / вывод",
  nested_loops: "Вложенные циклы",
}

export function getConstructionLabel(
  pattern: string,
  hints: Record<string, { title?: string }> = {},
): string {
  return (
    hints[pattern]?.title ??
    getConstructionDetail(pattern)?.title ??
    CONSTRUCTION_LABELS[pattern] ??
    (labelTechnicalConcept(pattern) !== pattern ? labelTechnicalConcept(pattern) : null) ??
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

export function getTaskConstructionHints(
  task: TaskDetail | null,
): Record<string, { title?: string; description?: string; examples?: Record<string, string> }> {
  const raw = payloadOf(task).construction_hints
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}
  return raw as Record<string, { title?: string; description?: string; examples?: Record<string, string> }>
}

function hasNonEmptyExample(value: unknown): boolean {
  const text = String(value ?? "").trim()
  return Boolean(text) && !isStubCodeExample(text)
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

export function debugTemplateLanguage(task: TaskDetail | null): string {
  if (!task || !isDebugTranslationTask(task)) return ""
  const payload = payloadOf(task)
  const template = String(payload.template ?? "")
  const inferred = inferCodeLanguage(template)
  if (inferred) return inferred
  return String(payload.target_language ?? sourceLanguage(task) ?? "python").toLowerCase()
}

export function taskWorkingLanguage(task: TaskDetail | null): string {
  if (!task) return "python"
  const payload = payloadOf(task)

  if (isPlaceholderTask(task)) {
    return String(payload.language ?? payload.target_language ?? "python").toLowerCase()
  }

  if (isDebugTranslationTask(task)) {
    return debugTemplateLanguage(task) || "python"
  }

  if (isTranslationTask(task)) {
    const target = String(payload.target_language ?? "").toLowerCase()
    if (target) return target
  }

  return String(
    payload.target_language ?? payload.language ?? payload.source_language ?? "python",
  ).toLowerCase()
}

/** Language sent to the checker/compiler — always matches editor content. */
export function resolveSubmissionLanguage(
  task: TaskDetail | null,
  learningLanguage: string,
): string {
  if (!task) return learningLanguage
  if (isPlaceholderTask(task) || isDebugTranslationTask(task)) {
    return taskWorkingLanguage(task)
  }
  return learningLanguage
}

export function shouldShowParallelLanguageBar(
  task: TaskDetail | null,
  knownLanguages: string[],
  learningLanguages: string[],
): boolean {
  if (!task) return false
  const known = knownLanguages.filter(Boolean)
  const learning = learningLanguages.filter(Boolean)
  const referenceLangs = Object.keys(getCodeExamples(task)).filter((key) =>
    KNOWN_SOURCE_LANGUAGES.has(key.toLowerCase()),
  )
  if (referenceLangs.length > 1) return true
  if (isPlaceholderTask(task) || isDebugTranslationTask(task)) {
    if (known.length > 1) return true
    if (isDebugTranslationTask(task)) {
      return resolveKnownLanguage(task) !== taskWorkingLanguage(task)
    }
    return false
  }
  return known.length > 0 && learning.length > 1
}

export function getKnownLanguages(task: TaskDetail | null): string[] {
  if (!task) return []
  const langs = new Set<string>()

  if (isPlaceholderTask(task)) {
    for (const key of Object.keys(getCodeExamples(task))) {
      if (KNOWN_SOURCE_LANGUAGES.has(key)) langs.add(key)
    }
    const working = taskWorkingLanguage(task)
    if (working) langs.add(working)
    return [...langs]
  }

  if (isDebugTranslationTask(task)) {
    const src = sourceLanguage(task).toLowerCase()
    if (src) langs.add(src)
    for (const key of Object.keys(getCodeExamples(task))) {
      if (KNOWN_SOURCE_LANGUAGES.has(key)) langs.add(key)
    }
    return [...langs]
  }

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

  if (isPlaceholderTask(task)) {
    const working = taskWorkingLanguage(task)
    if (working) langs.add(working)
    return [...langs]
  }

  if (isDebugTranslationTask(task)) {
    const working = debugTemplateLanguage(task)
    if (working) langs.add(working)
    const src = sourceLanguage(task).toLowerCase()
    if (src && src !== working) langs.add(src)
    return [...langs]
  }

  if (isBlockReorderTask(task)) {
    const variants = payload.blocks_by_language
    if (variants && typeof variants === "object" && !Array.isArray(variants)) {
      for (const key of Object.keys(variants as Record<string, unknown>)) {
        if (key) langs.add(String(key).toLowerCase())
      }
    }
    const primary = String(payload.language ?? "python").toLowerCase()
    if (primary) langs.add(primary)
    for (const key of Object.keys(getCodeExamples(task))) {
      langs.add(key.toLowerCase())
    }
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
  if (!task) return "python"
  if (isPlaceholderTask(task)) {
    const available = getKnownLanguages(task)
    const normalized = String(preferred ?? "").toLowerCase()
    if (normalized && available.includes(normalized)) return normalized
    return taskWorkingLanguage(task)
  }
  if (isDebugTranslationTask(task)) {
    const working = taskWorkingLanguage(task)
    const available = getKnownLanguages(task)
    const normalized = String(preferred ?? "").toLowerCase()
    if (normalized && available.includes(normalized)) return normalized
    if (working === "python") return "python"
    if (available.includes("python")) return "python"
    return working
  }
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
  if (!task) return "python"
  if (isPlaceholderTask(task) || isDebugTranslationTask(task)) {
    return taskWorkingLanguage(task)
  }
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

export function resolveKnownLanguageBarOptions(task: TaskDetail | null): string[] {
  return getKnownLanguages(task)
}

/** Языки для «Учу»: только языки, релевантные задаче. */
export function resolveLearningLanguageBarOptions(
  task: TaskDetail | null,
  serverLanguageIds: string[] = [],
): string[] {
  if (!task) return serverLanguageIds.length ? serverLanguageIds : ["python"]
  if (isPlaceholderTask(task) || isDebugTranslationTask(task)) {
    return getLearningLanguages(task, serverLanguageIds)
  }
  const fromTask = getLearningLanguages(task, serverLanguageIds)
  const fromExamples = getKnownLanguages(task)
  const merged = [...new Set([...fromTask, ...fromExamples])]
  if (merged.length > 0) return merged
  return fromTask
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
  const knownSet = new Set(
    knownLanguages.map((id) => String(id).toLowerCase()).filter(Boolean),
  )
  const learningSet = new Set(
    learningLanguages.map((id) => String(id).toLowerCase()).filter(Boolean),
  )
  return knownSet.has(learning) && learningSet.has(known)
}

export function hasReferencePane(task: TaskDetail | null): boolean {
  if (!task) return false
  if (isPlaceholderTask(task)) {
    return Boolean(getReferenceCode(task, taskWorkingLanguage(task)))
  }
  if (isDebugTranslationTask(task)) {
    return Boolean(getReferenceCode(task, taskWorkingLanguage(task)))
  }
  if (getKnownLanguages(task).length > 0) return true
  if (isWriteFromDescriptionTask(task)) return true
  if (isCodeToFlowchartTask(task) && getReferenceCode(task, "python")) return true
  return false
}
