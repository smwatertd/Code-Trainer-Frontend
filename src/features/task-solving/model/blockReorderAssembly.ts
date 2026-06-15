/** Client-side block assembly — mirrors backend BlockReorderTask.build_code. */

export function isFragmentAssemblyTemplate(template: string | null | undefined): boolean {
  return Boolean(template && /\{\d+\}/.test(String(template)))
}

export function countTemplateSlots(template: string): number {
  return [...String(template).matchAll(/\{\d+\}/g)].length
}

export function shuffleBlockIndices(blockCount: number, seed = ""): number[] {
  const indices = Array.from({ length: blockCount }, (_, index) => index)
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0
  }
  const random = () => {
    hash = (hash * 1664525 + 1013904223) | 0
    return (hash >>> 0) / 4294967296
  }
  for (let index = indices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]]
  }
  return indices
}

function getTemplateSlotIndent(template: string, slotIndex: number): string {
  const slotToken = `{${slotIndex}}`
  const position = template.indexOf(slotToken)
  if (position === -1) return ""
  const lineStart = template.lastIndexOf("\n", Math.max(0, position - 1)) + 1
  let indent = ""
  for (const char of template.slice(lineStart, position)) {
    if (char === " " || char === "\t") indent += char
    else break
  }
  return indent
}

function applyIndentToBlock(block: string, indent: string): string {
  if (!indent || !block.includes("\n")) return block
  const lines = block.split("\n")
  return lines[0] + lines.slice(1).map((line) => `\n${indent}${line}`).join("")
}

function applyManualIndentLevel(block: string, level: number): string {
  if (level <= 0) return block
  const prefix = " ".repeat(level)
  return block
    .split("\n")
    .map((line) => (line ? prefix + line : line))
    .join("\n")
}

/** Сборка кода из порядка блоков — с template ({0}…) или без (join строк). */
export function buildBlockCodeFromOrder(
  blocks: string[],
  order: number[],
  template: string | null = null,
  indents: number[] = [],
): string {
  const selected = order
    .filter((index) => typeof index === "number" && index >= 0)
    .map((index) => blocks[index] ?? "")

  if (!template) {
    if (indents.length > 0) {
      return selected
        .map((block, index) => applyManualIndentLevel(block, Number(indents[index] ?? 0)))
        .join("\n")
    }
    return selected.join("\n")
  }

  let result = template
  for (let slotIndex = 0; slotIndex < order.length; slotIndex += 1) {
    const blockIndex = order[slotIndex]
    if (blockIndex < 0) continue
    const blockText = blocks[blockIndex] ?? ""
    const slotToken = `{${slotIndex}}`
    const indent = getTemplateSlotIndent(result, slotIndex)
    const indented = applyIndentToBlock(blockText, indent)
    result = result.replace(slotToken, indented)
  }
  return result
}

/** @deprecated use buildBlockCodeFromOrder */
export function buildAssembledCode(
  blocks: string[],
  order: number[],
  indents: number[] = [],
): string {
  return buildBlockCodeFromOrder(blocks, order, null, indents)
}

export type TemplateDisplaySegment =
  | { kind: "text"; value: string }
  | { kind: "slot"; slotIndex: number }

export type TemplateDisplayLine = {
  lineNum: number
  segments: TemplateDisplaySegment[]
}

export function parseTemplateDisplayLines(template: string): TemplateDisplayLine[] {
  if (!template) return []

  let slotCounter = 0
  return template.split("\n").map((line, lineIndex) => {
    const segments: TemplateDisplaySegment[] = []
    const pattern = /\{\d+\}/g
    let lastIndex = 0
    let match = pattern.exec(line)

    while (match) {
      if (match.index > lastIndex) {
        segments.push({ kind: "text", value: line.slice(lastIndex, match.index) })
      }
      segments.push({ kind: "slot", slotIndex: slotCounter })
      slotCounter += 1
      lastIndex = match.index + match[0].length
      match = pattern.exec(line)
    }

    if (lastIndex < line.length) {
      segments.push({ kind: "text", value: line.slice(lastIndex) })
    }

    return { lineNum: lineIndex + 1, segments }
  })
}
