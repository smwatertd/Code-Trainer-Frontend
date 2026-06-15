import { useEffect, useId, useState, type MouseEvent as ReactMouseEvent } from "react"
import { createPortal } from "react-dom"
import {
  getConstructionDetail,
} from "@/features/task-solving/model/constructionCatalog"
import {
  pickConstructionExamplesFromDetail,
  type ConstructionHintPayload,
} from "@/features/task-solving/model/constructionChipExamples"
import type { ConstructionExample } from "@/features/task-solving/model/constructionCatalog"
import { getConstructionLabel } from "@/features/task-solving/model/studentUiUtils"
import { labelLanguage } from "@/shared/utils/labels"
import { cn } from "@/shared/ui/cn"

type ConstructionChipProps = {
  pattern: string
  hints?: Record<string, ConstructionHintPayload>
  language?: string
  detected?: boolean
}

type AnchorRect = {
  left: number
  bottom: number
}

const POPOVER_WIDTH = 420

export default function ConstructionChip({
  pattern,
  hints = {},
  language = "python",
  detected = false,
}: ConstructionChipProps) {
  const chipId = useId()
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<AnchorRect | null>(null)
  const detail = getConstructionDetail(pattern)
  const hint = hints[pattern]
  const label = getConstructionLabel(pattern, hints)
  const title = hint?.title ?? detail?.title ?? label
  const description = hint?.description ?? detail?.description ?? ""
  const examples = pickConstructionExamplesFromDetail(detail, hint, language)

  useEffect(() => {
    if (!open) return
    const onDocumentMouseDown = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (
        !target.closest(`[data-construction-popover="${chipId}"]`) &&
        !target.closest(`[data-construction-chip="${chipId}"]`)
      ) {
        setOpen(false)
      }
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDocumentMouseDown)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.removeEventListener("mousedown", onDocumentMouseDown)
      document.removeEventListener("keydown", onEscape)
    }
  }, [chipId, open])

  const onToggle = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    if (open) {
      setOpen(false)
      return
    }
    setAnchor({ left: rect.left, bottom: rect.bottom })
    setOpen(true)
  }

  const popover =
    open && anchor && typeof document !== "undefined"
      ? createPortal(
          <ConstructionPopover
            chipId={chipId}
            title={title}
            description={description}
            language={language}
            examples={examples}
            anchor={anchor}
            onClose={() => setOpen(false)}
          />,
          document.body,
        )
      : null

  return (
    <>
      <button
        type="button"
        data-construction-chip={chipId}
        data-testid={`construction-chip-${pattern}`}
        className={cn("tp-chip sm transition", (open || detected) && "on")}
        onClick={onToggle}
      >
        {label}
      </button>
      {popover}
    </>
  )
}

type ConstructionPopoverProps = {
  chipId: string
  title: string
  description: string
  language: string
  examples: ConstructionExample[]
  anchor: AnchorRect
  onClose: () => void
}

function ConstructionPopover({
  chipId,
  title,
  description,
  language,
  examples,
  anchor,
  onClose,
}: ConstructionPopoverProps) {
  let left = anchor.left
  if (left + POPOVER_WIDTH > window.innerWidth - 12) {
    left = window.innerWidth - POPOVER_WIDTH - 12
  }
  if (left < 12) left = 12
  const top = anchor.bottom + 8

  return (
    <div
      data-construction-popover={chipId}
      data-testid="construction-popover"
      className="fixed z-[80] w-[min(420px,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-border bg-surface shadow-[0_24px_60px_-24px_rgba(0,0,0,.9)]"
      style={{ left, top, width: POPOVER_WIDTH }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <b className="text-sm text-ink">
            {title} · <span className="text-lime">{labelLanguage(language)}</span>
          </b>
          {description ? (
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{description}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="text-lg leading-none text-ink-faint hover:text-ink"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>
      <div className="max-h-[min(320px,55vh)] space-y-3 overflow-y-auto px-4 py-3">
        {examples.length === 0 ? (
          <p className="text-sm text-ink-muted">Примеры для этого языка появятся позже.</p>
        ) : (
          examples.map((example) => (
            <div key={example.title}>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {example.title}
              </div>
              <pre className="overflow-x-auto rounded-lg border border-border bg-[#0b0f17] p-3 font-mono text-xs leading-relaxed text-ink">
                {example.code}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
