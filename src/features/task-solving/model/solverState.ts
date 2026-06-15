import type { TaskBlock, TaskDetail, CheckResult, FlowPayload } from "@/shared/types/api"
import {
  defaultLanguage,
  isBlockReorderTask,
  isCodeToFlowchartTask,
  isDebugTranslationTask,
  isFlowchartTask,
  isPlaceholderTask,
  isTranslationTask,
  isWriteFromDescriptionTask,
} from "@/shared/utils/taskTypes"
import {
  assembleBlockReorderCodeFromLines,
  blocksMatchLanguageParadigm,
  isStructuralProgramBlocks,
  localizeBlockStatement,
} from "@/features/task-solving/model/blockReorderLanguage"
import { getFlowchartReferenceCode } from "@/features/task-solving/model/flowchartReferenceCode"
import {
  debugTemplateLanguage,
  getCodeExamples,
  getReferenceCode,
  taskWorkingLanguage,
} from "@/features/task-solving/model/studentUiUtils"

export type SolverMode = "guest" | "student"

export type TaskSolverState = {
  code: string
  language: string
  blockOrder: number[]
  flow: FlowPayload
  result: CheckResult | null
  isSubmitting: boolean
  isPolling: boolean
  submitError: string | null
  pollError: string | null
}

export function initialBlockOrder(blocks: TaskBlock[]): number[] {
  return blocks.map((block) => block.id)
}

export function buildCodeFromBlocks(
  blocks: TaskBlock[],
  order: number[],
  language = "python",
): string {
  const byId = new Map(blocks.map((block) => [block.id, block.content]))
  const lines = order.map((id) => byId.get(id) ?? "").filter(Boolean)
  if (language === "python" && !isStructuralProgramBlocks(lines)) {
    return lines.join("\n")
  }
  return assembleBlockReorderCodeFromLines(lines, language)
}

function normalizeBlockItems(raw: unknown[]): TaskBlock[] {
  return raw.map((item, index) => {
    if (typeof item === "string") {
      return { id: index, content: item }
    }
    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>
      return {
        id: Number(record.id ?? index),
        content: String(record.content ?? ""),
      }
    }
    return { id: index, content: "" }
  })
}

export function blocksFromExampleCode(code: string): TaskBlock[] {
  return normalizeBlockItems(
    code
      .split("\n")
      .map((line) => line.trimEnd())
      .filter((line) => line.trim()),
  )
}

function resolveBlocksForLanguage(
  blocks: TaskBlock[],
  task: TaskDetail,
  resolvedLanguage: string,
): TaskBlock[] {
  const lines = blocks.map((block) => block.content)
  if (!lines.length || blocksMatchLanguageParadigm(lines, resolvedLanguage)) {
    return blocks
  }

  const example = getCodeExamples(task)[resolvedLanguage.toLowerCase()]
  if (example?.trim()) {
    return blocksFromExampleCode(example)
  }

  return blocks
}

export function getTaskBlocks(task: TaskDetail | null, language?: string): TaskBlock[] {
  if (!task) return []
  const payload = task.payload
  const resolvedLanguage = language ?? defaultLanguage(task)
  const variants = payload.blocks_by_language
  let blocks: TaskBlock[] = []

  if (variants && typeof variants === "object" && !Array.isArray(variants)) {
    const map = variants as Record<string, unknown>
    const raw = map[resolvedLanguage]
    if (Array.isArray(raw)) {
      const candidate = normalizeBlockItems(raw)
      const lines = candidate.map((block) => block.content)
      if (lines.length && blocksMatchLanguageParadigm(lines, resolvedLanguage)) {
        blocks = candidate
      }
    } else {
      const baseRaw =
        map[defaultLanguage(task)] ??
        map.python ??
        map[String(payload.language ?? "python")]
      if (Array.isArray(baseRaw)) {
        blocks = normalizeBlockItems(baseRaw).map((block) => ({
          ...block,
          content: localizeBlockStatement(block.content, resolvedLanguage),
        }))
      }
    }
  }

  if (!blocks.length) {
    const fallback = payload.blocks
    const baseItems = Array.isArray(fallback) ? normalizeBlockItems(fallback) : []
    blocks = baseItems.map((block) => ({
      ...block,
      content: localizeBlockStatement(block.content, resolvedLanguage),
    }))
  }

  const example = getCodeExamples(task)[resolvedLanguage.toLowerCase()]
  if (example?.trim() && !blocks.length) {
    return blocksFromExampleCode(example)
  }

  if (
    example?.trim() &&
    blocks.length > 0 &&
    !blocksMatchLanguageParadigm(
      blocks.map((block) => block.content),
      resolvedLanguage,
    )
  ) {
    return blocksFromExampleCode(example)
  }

  return resolveBlocksForLanguage(blocks, task, resolvedLanguage)
}

function templateFromLanguageVariant(
  payload: Record<string, unknown>,
  language: string,
): string | null {
  const variants = payload.language_variants
  if (!variants || typeof variants !== "object" || Array.isArray(variants)) {
    return null
  }
  const variant = (variants as Record<string, Record<string, unknown>>)[language.toLowerCase()]
  if (!variant || typeof variant.template !== "string") {
    return null
  }
  return variant.template
}

/** Starter code for the «Учу» editor when the learning language changes. */
export function getLearningStarterCode(task: TaskDetail | null, language: string): string {
  if (!task) return ""
  const lang = language.toLowerCase()
  const payload = (task.payload ?? {}) as Record<string, unknown>

  if (isCodeToFlowchartTask(task)) {
    return getFlowchartReferenceCode(task, lang)
  }

  const variantTemplate = templateFromLanguageVariant(payload, lang)
  if (variantTemplate !== null) {
    return variantTemplate
  }

  if (isDebugTranslationTask(task)) {
    const working = debugTemplateLanguage(task)
    const template = String(payload.template ?? "")
    if (template.trim() && lang === working) {
      return template
    }
    return ""
  }

  if (isTranslationTask(task)) {
    const target = String(payload.target_language ?? "").toLowerCase()
    const template = String(payload.template ?? "")
    if (template.trim() && lang === target) {
      return template
    }
    return ""
  }

  if (isPlaceholderTask(task)) {
    const working = taskWorkingLanguage(task)
    if (lang === working) {
      return String(payload.placeholder_template ?? payload.template_code ?? "")
    }
    return ""
  }

  if (isWriteFromDescriptionTask(task)) {
    return String(payload.template ?? "")
  }

  return String(payload.template ?? "")
}

/** Code for «Учу» after language swap: template first; этalon only for debug/fix tasks. */
export function resolveLearningCodeAfterSwap(task: TaskDetail | null, language: string): string {
  if (!task) return ""
  const starter = getLearningStarterCode(task, language)
  if (starter.trim()) return starter
  if (isDebugTranslationTask(task)) {
    return getReferenceCode(task, language) ?? ""
  }
  return ""
}

export function createInitialSolverState(
  task: TaskDetail | null,
  availableLanguageIds: string[] = [],
): Pick<TaskSolverState, "code" | "language" | "blockOrder" | "flow"> {
  const blocks = getTaskBlocks(task)
  const language = defaultLanguage(task, availableLanguageIds)
  return {
    language,
    code: getLearningStarterCode(task, language),
    blockOrder: initialBlockOrder(blocks),
    flow: { flow: [], nodes: [], edges: [] },
  }
}

export function createInitialBlockReorderCode(task: TaskDetail, language: string, blockOrder: number[]): string {
  return buildCodeFromBlocks(getTaskBlocks(task, language), blockOrder, language)
}

export function flowToApiPayload(flow: FlowPayload) {
  return {
    nodes: flow.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      x: node.position?.x ?? node.x ?? 0,
      y: node.position?.y ?? node.y ?? 0,
      text: node.text ?? "",
    })),
    edges: flow.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    })),
    flow: flow.flow,
  }
}

export type SubmissionInput = {
  code?: string | null
  language?: string | null
  block_order?: number[] | null
  nodes?: Array<Record<string, unknown>> | null
  edges?: Array<Record<string, unknown>> | null
  flow?: Array<Record<string, unknown>> | null
}

export function flowFromApiPayload(payload: {
  nodes: Array<Record<string, unknown>>
  edges: Array<Record<string, unknown>>
  flow: Array<Record<string, unknown>>
}): FlowPayload {
  return {
    nodes: payload.nodes.map((node) => ({
      id: String(node.id),
      type: String(node.type ?? "process"),
      x: Number(node.x ?? 0),
      y: Number(node.y ?? 0),
      text: String(node.text ?? ""),
      position: {
        x: Number(node.x ?? 0),
        y: Number(node.y ?? 0),
      },
    })),
    edges: payload.edges.map((edge) => ({
      source: String(edge.source),
      target: String(edge.target),
    })),
    flow: payload.flow.map((item) => ({
      id: String(item.id),
      type: String(item.type ?? "process"),
      text: item.text != null ? String(item.text) : undefined,
    })),
  }
}

export function applySubmissionInput(
  task: TaskDetail,
  input: SubmissionInput,
): Pick<TaskSolverState, "code" | "language" | "blockOrder" | "flow"> {
  const language = input.language ?? defaultLanguage(task)
  const blocks = getTaskBlocks(task, language)

  if (isBlockReorderTask(task) && input.block_order?.length) {
    const blockOrder = input.block_order
    return {
      language,
      blockOrder,
      code: buildCodeFromBlocks(blocks, blockOrder, language),
      flow: { flow: [], nodes: [], edges: [] },
    }
  }

  if (
    isFlowchartTask(task) &&
    Array.isArray(input.nodes) &&
    input.nodes.length > 0
  ) {
    return {
      language,
      code: isCodeToFlowchartTask(task)
        ? getFlowchartReferenceCode(task, language)
        : (input.code ?? ""),
      blockOrder: initialBlockOrder(blocks),
      flow: flowFromApiPayload({
        nodes: input.nodes,
        edges: input.edges ?? [],
        flow: input.flow ?? [],
      }),
    }
  }

  return {
    language,
    code: input.code ?? "",
    blockOrder: initialBlockOrder(blocks),
    flow: { flow: [], nodes: [], edges: [] },
  }
}
