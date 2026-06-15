import { useMemo, type DragEvent } from "react"
import { PLACEHOLDER_TOKEN } from "@/features/task-solving/model/placeholderTask"
import { shuffleBlockIndices } from "@/features/task-solving/model/blockReorderAssembly"
import { BlockAssemblyBank } from "@/widgets/block-assembly-editor/BlockAssemblyBank"
import { FixedCodeTokens, TemplateSlot } from "@/widgets/block-assembly-editor/TemplateCodeTokens"

const DRAG_TYPE = "application/x-placeholder-block"

export type PlaceholderLinePart = {
  lineNum: number
  indentStr: string
  segments: Array<{ kind: "text"; value: string } | { kind: "slot"; index: number }>
}

export function parsePlaceholderLines(template: string, token = PLACEHOLDER_TOKEN): PlaceholderLinePart[] {
  if (!template) return []

  let globalSlot = 0
  return template.split("\n").map((line, lineIndex) => {
    const indentMatch = line.match(/^(\s*)/)
    const indentStr = indentMatch?.[1] ?? ""
    const content = line.slice(indentStr.length)
    const parts = content.split(token)
    const segments: PlaceholderLinePart["segments"] = []

    parts.forEach((part, partIndex) => {
      if (part) {
        segments.push({ kind: "text", value: part })
      }
      if (partIndex < parts.length - 1) {
        segments.push({ kind: "slot", index: globalSlot })
        globalSlot += 1
      }
    })

    return { lineNum: lineIndex + 1, indentStr, segments }
  })
}

type PlaceholderEditorProps = {
  template: string
  fills: string[]
  bank: string[]
  activeSlot: number
  onActiveSlotChange: (index: number) => void
  onFillSlot: (index: number, value: string) => void
  language?: string
  shuffleKey?: string
}

export default function PlaceholderEditor({
  template,
  fills,
  bank,
  activeSlot,
  onActiveSlotChange,
  onFillSlot,
  language = "python",
  shuffleKey = "",
}: PlaceholderEditorProps) {
  const lines = useMemo(() => parsePlaceholderLines(template), [template])

  const bankOrder = useMemo(
    () => shuffleBlockIndices(bank.length, shuffleKey || bank.join("|")),
    [bank, shuffleKey],
  )

  const usedValues = useMemo(
    () => new Set(fills.map((value) => value.trim()).filter(Boolean)),
    [fills],
  )

  const availableBank = bankOrder.filter((index) => !usedValues.has(bank[index]?.trim() ?? ""))

  const allowDrop = (event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  const onDragStart = (event: DragEvent, block: string) => {
    event.dataTransfer.setData(DRAG_TYPE, block)
    event.dataTransfer.effectAllowed = "move"
  }

  const dropOnSlot = (slotIndex: number) => (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const block = event.dataTransfer.getData(DRAG_TYPE)
    if (!block) return
    onFillSlot(slotIndex, block)
  }

  const dropOnBank = (event: DragEvent) => {
    event.preventDefault()
    const block = event.dataTransfer.getData(DRAG_TYPE)
    if (!block) return
    const slotIndex = fills.findIndex((value) => value.trim() === block.trim())
    if (slotIndex >= 0) {
      onFillSlot(slotIndex, "")
    }
  }

  return (
    <div className="grid h-full min-h-0 flex-1 grid-rows-[1fr_auto]" data-testid="placeholder-editor">
      <div className="overflow-auto bg-surface">
        <pre className="m-0 px-4 py-3 font-mono text-[14px] leading-[1.85]">
          {lines.map((line) => (
            <div key={line.lineNum} className="code-line">
              <div className="ln">{line.lineNum}</div>
              <div className="flex min-w-0 items-center gap-x-0 gap-y-0 whitespace-pre">
                {line.indentStr ? <span aria-hidden>{line.indentStr}</span> : null}
                {line.segments.map((segment, index) =>
                  segment.kind === "text" ? (
                    <span key={`t-${line.lineNum}-${index}`}>
                      <FixedCodeTokens text={segment.value} language={language} />
                    </span>
                  ) : (
                    <span
                      key={`s-${line.lineNum}-${index}`}
                      onFocus={() => onActiveSlotChange(segment.index)}
                    >
                      <TemplateSlot
                        blockText={fills[segment.index]?.trim() ? fills[segment.index] : null}
                        onDragOver={allowDrop}
                        onDrop={dropOnSlot(segment.index)}
                        onClear={() => onFillSlot(segment.index, "")}
                      />
                    </span>
                  ),
                )}
              </div>
            </div>
          ))}
        </pre>
      </div>

      <BlockAssemblyBank
        blocks={bank}
        blockIndices={availableBank}
        title="Доступные блоки"
        hint="· перетащи в пропуск"
        onDragStart={(event, bankIndex) => onDragStart(event, bank[bankIndex] ?? "")}
        onDragOver={allowDrop}
        onDrop={dropOnBank}
      />
    </div>
  )
}
