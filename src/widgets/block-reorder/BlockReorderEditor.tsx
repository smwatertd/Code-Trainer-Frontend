import type { TaskBlock } from "@/shared/types/api"
import {
  moveBlockOrder,
  normalizeBlockOrder,
} from "@/features/task-solving/model/blockAssemblyHelpers"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/ui/cn"
import { useEffect, useMemo } from "react"

type BlockReorderEditorProps = {
  blocks: TaskBlock[]
  order: number[]
  onChange: (order: number[]) => void
}

export default function BlockReorderEditor({ blocks, order, onChange }: BlockReorderEditorProps) {
  const byId = useMemo(() => new Map(blocks.map((block) => [block.id, block])), [blocks])
  const displayOrder = useMemo(() => normalizeBlockOrder(order, blocks), [blocks, order])

  useEffect(() => {
    if (
      displayOrder.length !== order.length ||
      displayOrder.some((blockId, index) => blockId !== order[index])
    ) {
      onChange(displayOrder)
    }
  }, [displayOrder, onChange, order])

  const move = (index: number, direction: -1 | 1) => {
    onChange(moveBlockOrder(order, index, direction, blocks))
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <p className="mb-3 shrink-0 px-1 text-sm text-muted-foreground">
        Расположите блоки в правильном порядке.
      </p>
      <div className="min-h-0 flex-1 space-y-2 overflow-auto">
        {displayOrder.map((blockId, index) => {
          const block = byId.get(blockId)
          return (
            <div
              key={`${blockId}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-[#0b0f17] px-3 py-2.5"
              data-testid={`block-reorder-row-${index}`}
            >
              <span className="w-6 select-none text-right font-mono text-sm text-muted-foreground">
                {index + 1}
              </span>
              <code className="flex-1 font-mono text-[13.5px] leading-relaxed text-foreground">
                {block?.content ?? "—"}
              </code>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-8 w-8 p-0 text-muted-foreground hover:text-foreground")}
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Переместить вверх"
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-8 w-8 p-0 text-muted-foreground hover:text-foreground")}
                  onClick={() => move(index, 1)}
                  disabled={index === displayOrder.length - 1}
                  data-testid={`block-move-down-${index}`}
                  aria-label="Переместить вниз"
                >
                  ↓
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
