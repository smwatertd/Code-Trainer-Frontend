import type { TaskBlock } from "@/shared/types/api"
import type { BlockPlacement } from "@/domain/blockAssembly"
import {
  buildCode,
  deriveSubmitPayload,
  getInitialBaseCode,
  normalizePlacements,
} from "@/domain/blockAssembly"
import { buildAssembledCode } from "@/features/task-solving/model/blockReorderAssembly"
import {
  getBlockAssemblyTemplate,
  initialBlockAssemblyOrder,
  resolveBlockAssemblyKind,
} from "@/features/task-solving/model/blockAssemblyMode"
import type { TaskDetail } from "@/shared/types/api"
import {
  assembleBlockReorderCodeFromLines,
  isStructuralProgramBlocks,
} from "@/features/task-solving/model/blockReorderLanguage"
import { buildCodeFromBlocks, getTaskBlocks } from "@/features/task-solving/model/solverState"

export function blockOrderFromPlacements(
  placements: BlockPlacement[],
  baseCode = "",
): number[] {
  return deriveSubmitPayload(normalizePlacements(placements, baseCode), baseCode).order
}

export function buildCodeFromBlockTask(
  task: TaskDetail | null,
  blocks: TaskBlock[],
  order: number[],
  placements: BlockPlacement[],
  language: string,
): string {
  const texts = blocks.map((block) => block.content)
  const template = getBlockAssemblyTemplate(task, language)
  const kind = resolveBlockAssemblyKind(blocks, template)

  if (kind === "fragment") {
    const baseCode = getInitialBaseCode(template, texts)
    if (placements.length > 0) {
      return buildCode(baseCode, placements, texts)
    }
    return baseCode
  }

  if (kind === "program_lines" && placements.length > 0) {
    const { order: lineOrder, indents } = deriveSubmitPayload(
      normalizePlacements(placements, ""),
      "",
    )
    if (language === "python" && !isStructuralProgramBlocks(texts)) {
      return buildAssembledCode(texts, lineOrder, indents)
    }
    return buildCodeFromBlocks(blocks, lineOrder, language)
  }

  if (kind === "program_lines") {
    const lines = order.map((index) => texts[index] ?? "").filter(Boolean)
    if (language === "python" && !isStructuralProgramBlocks(lines)) {
      return lines.join("\n")
    }
  }

  return buildCodeFromBlocks(blocks, order, language)
}

/** @deprecated use buildCodeFromBlockTask */
export function buildCodeFromPlacements(
  blocks: TaskBlock[],
  placements: BlockPlacement[],
  language: string,
): string {
  const texts = blocks.map((block) => block.content)
  const { order, indents } = deriveSubmitPayload(normalizePlacements(placements, ""), "")
  if (!order.length) {
    return buildCodeFromBlocks(blocks, blocks.map((block) => block.id), language)
  }

  if (language === "python" && !isStructuralProgramBlocks(texts)) {
    return buildAssembledCode(texts, order, indents)
  }

  const lines = order.map((index) => texts[index] ?? "").filter(Boolean)
  if (isStructuralProgramBlocks(lines)) {
    return assembleBlockReorderCodeFromLines(lines, language)
  }

  return buildCodeFromBlocks(blocks, order, language)
}

export function getFragmentBaseCode(task: TaskDetail | null, blocks: TaskBlock[], language: string): string {
  const template = getBlockAssemblyTemplate(task, language)
  const texts = blocks.map((block) => block.content)
  return getInitialBaseCode(template, texts)
}

/** Keep block order aligned with the current block list (drop stale ids, append missing). */
export function normalizeBlockOrder(order: number[], blocks: TaskBlock[]): number[] {
  if (!blocks.length) return []
  const ids = blocks.map((block) => block.id)
  const idSet = new Set(ids)
  const seen = new Set<number>()
  const normalized: number[] = []

  for (const value of order) {
    if (!idSet.has(value) || seen.has(value)) continue
    seen.add(value)
    normalized.push(value)
  }

  for (const id of ids) {
    if (!seen.has(id)) normalized.push(id)
  }

  return normalized
}

/** Whether stored order must be rewritten to match the current block list. */
export function shouldSyncBlockOrder(order: number[], blocks: TaskBlock[]): boolean {
  const displayOrder = normalizeBlockOrder(order, blocks)
  return (
    displayOrder.length !== order.length ||
    displayOrder.some((blockId, index) => blockId !== order[index])
  )
}

/** Swap a block one position up or down; keeps order aligned with `blocks`. */
export function moveBlockOrder(
  order: number[],
  index: number,
  direction: -1 | 1,
  blocks: TaskBlock[],
): number[] {
  const displayOrder = normalizeBlockOrder(order, blocks)
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= displayOrder.length) {
    return displayOrder
  }
  const next = [...displayOrder]
  const tmp = next[index]
  next[index] = next[nextIndex]
  next[nextIndex] = tmp
  return next
}

/** Same normalization + code rebuild as `updateBlockOrder` in useTaskSolver. */
export function applyBlockOrderUpdate(
  task: TaskDetail,
  language: string,
  order: number[],
  blockPlacements: BlockPlacement[] = [],
): { blockOrder: number[]; code: string } {
  const blocks = getTaskBlocks(task, language)
  const blockOrder = normalizeBlockOrder(order, blocks)
  return {
    blockOrder,
    code: buildCodeFromBlockTask(task, blocks, blockOrder, blockPlacements, language),
  }
}

export function createBlockTaskStateForLanguage(
  task: TaskDetail,
  language: string,
): {
  blockOrder: number[]
  blockPlacements: BlockPlacement[]
  code: string
} {
  const blocks = getTaskBlocks(task, language)
  const template = getBlockAssemblyTemplate(task, language)
  const blockOrder = initialBlockAssemblyOrder(blocks, template)
  const kind = resolveBlockAssemblyKind(blocks, template)
  const code =
    kind === "fragment"
      ? getFragmentBaseCode(task, blocks, language)
      : buildCodeFromBlockTask(task, blocks, blockOrder, [], language)

  return {
    blockOrder,
    blockPlacements: [],
    code,
  }
}
