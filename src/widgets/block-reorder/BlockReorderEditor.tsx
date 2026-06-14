import type { TaskBlock } from "@/shared/types/api"
import { Button } from "@/shared/ui/button"

type BlockReorderEditorProps = {
  blocks: TaskBlock[]
  order: number[]
  onChange: (order: number[]) => void
}

export default function BlockReorderEditor({ blocks, order, onChange }: BlockReorderEditorProps) {
  const byId = new Map(blocks.map((block) => [block.id, block]))

  const move = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= order.length) return
    const next = [...order]
    const tmp = next[index]
    next[index] = next[nextIndex]
    next[nextIndex] = tmp
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Расположите блоки в правильном порядке.</p>
      {order.map((blockId, index) => {
        const block = byId.get(blockId)
        return (
          <div
            key={blockId}
            className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2"
          >
            <span className="w-6 text-sm text-muted-foreground">{index + 1}</span>
            <code className="flex-1 font-mono text-sm">{block?.content ?? "—"}</code>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => move(index, -1)} disabled={index === 0}>
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => move(index, 1)}
                disabled={index === order.length - 1}
                data-testid={`block-move-down-${index}`}
              >
                ↓
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
