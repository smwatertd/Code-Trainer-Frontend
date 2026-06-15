import { tokenizeCodeLine } from "@/widgets/block-assembly-editor/lib/codeTokenizer"

export function FixedCodeTokens({ text, language }: { text: string; language: string }) {
  const tokens = tokenizeCodeLine(text, language)
  return (
    <>
      {tokens.map((token, index) => (
        <span key={`${index}-${token.c}`} className={`tk-${token.c}`}>
          {token.t}
        </span>
      ))}
    </>
  )
}

export function TemplateSlot({
  blockText,
  onDragOver,
  onDrop,
  onClear,
}: {
  blockText: string | null
  onDragOver: (event: React.DragEvent) => void
  onDrop: (event: React.DragEvent) => void
  onClear?: () => void
}) {
  const filled = blockText != null && blockText !== ""

  return (
    <span
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => {
        if (filled) onClear?.()
      }}
      className={[
        "mx-0.5 inline-flex min-w-[64px] cursor-pointer items-center justify-center rounded-md px-2 py-0.5 font-mono text-[13.5px] transition",
        filled
          ? "border border-border-2 bg-surface-3 text-ink hover:border-danger/60 hover:bg-danger-soft hover:text-danger"
          : "border border-dashed border-border-2 bg-bg-2 text-ink-faint hover:border-lime/50 hover:bg-surface-2",
      ].join(" ")}
      title={filled ? "Клик — убрать" : "Перетащи сюда блок"}
    >
      {filled ? <span className="whitespace-pre">{blockText}</span> : "___"}
    </span>
  )
}
