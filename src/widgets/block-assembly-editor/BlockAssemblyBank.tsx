const DRAG_TYPE = "application/x-block-reorder-index"

export function BlockAssemblyBank({
  title = "Доступные блоки",
  hint = "· перетащи в пропуск",
  blocks = [],
  blockIndices = [],
  onDragStart,
  onDragOver,
  onDrop,
  emptyText = "Все блоки расставлены.",
  isDistractor,
}) {
  return (
    <div
      className="border-t border-border bg-bg-2/60 px-4 py-3"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
        <span>{title}</span>
        {hint ? (
          <span className="font-normal normal-case tracking-normal text-ink-faint/70">{hint}</span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {blockIndices.length === 0 ? (
          <div className="text-[12.5px] italic text-ink-faint">{emptyText}</div>
        ) : (
          blockIndices.map((blockIndex) => {
            const text = blocks[blockIndex] ?? ""
            const distractor = isDistractor?.(blockIndex)
            return (
              <span
                key={blockIndex}
                draggable
                onDragStart={(event) => onDragStart?.(event, blockIndex)}
                className={[
                  "inline-flex cursor-grab select-none items-center rounded-lg border px-3 py-1.5 font-mono text-[13px] transition active:cursor-grabbing",
                  distractor
                    ? "border-border-2 bg-surface-2 text-ink-muted hover:border-warning/45 hover:text-warning"
                    : "border-border-2 bg-surface-2 text-ink hover:border-lime/45 hover:bg-surface-3",
                ].join(" ")}
              >
                {text}
              </span>
            )
          })
        )}
      </div>
    </div>
  )
}

export { DRAG_TYPE }
