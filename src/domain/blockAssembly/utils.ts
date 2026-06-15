import type { BlockPlacement } from "@/domain/blockAssembly/types"

export const BLOCK_ASSEMBLY_TAB_SIZE = 4

/** Normalizes teacher-stored newlines (`\n`, `` `n ``) for display and assembly. */
export function decodeTemplateText(text = ""): string {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/`n/g, "\n")
}

export function createPlacementId(): string {
  return `blk-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Length of leading whitespace (spaces/tabs) on a line — Python indent region. */
export function getLineIndentLen(lineText: string): number {
  const match = lineText.match(/^(\s*)/)
  return match?.[1]?.length ?? 0
}

/**
 * 1-based code column preserving user drop position.
 * Only clamps invalid values; does not enforce indentation boundaries.
 */
export function normalizeCodeColumn(lineText: string, column: number): number {
  void lineText
  return Math.max(1, Math.floor(column))
}

/** Snap 1-based columns to editor-like tab stops: 1, 5, 9, 13... */
export function snapColumnToTab(
  column: number,
  tabSize = BLOCK_ASSEMBLY_TAB_SIZE,
): number {
  const safeColumn = Math.max(1, Math.floor(column))
  const safeTabSize = Math.max(1, Math.floor(tabSize))
  return Math.round((safeColumn - 1) / safeTabSize) * safeTabSize + 1
}

export function getBaseLine(baseCode: string, line: number): string {
  const lines = baseCode.split("\n")
  const lineNum = Math.max(1, line)
  while (lines.length < lineNum) {
    lines.push("")
  }
  return lines[lineNum - 1] ?? ""
}

export function blockFirstLineWidth(blockText: string): number {
  const first = blockText.split("\n")[0] ?? ""
  return Math.max(first.length, 1)
}

export function blockLineSpan(blockText: string): number {
  return Math.max(1, blockText.split("\n").length)
}

export function placementsOnLine(
  placements: BlockPlacement[],
  line: number,
): BlockPlacement[] {
  return placements
    .filter((p) => p.line === line)
    .sort((a, b) => a.slot - b.slot || a.column - b.column)
}

export function padBaseCodeToLine(baseCode: string, line: number): string {
  const lines = baseCode.split("\n")
  while (lines.length < line) {
    lines.push("")
  }
  return lines.join("\n")
}

export function maxPlacementLine(
  placements: BlockPlacement[],
  blocks: string[],
): number {
  let max = 1
  for (const p of placements) {
    const span = blockLineSpan(blocks[p.blockIndex] ?? "")
    max = Math.max(max, p.line + span - 1)
  }
  return max
}
