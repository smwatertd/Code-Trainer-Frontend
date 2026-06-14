import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"
import { cn } from "@/shared/ui/cn"

type ResizableSplitProps = {
  layout: "row" | "column"
  storageKey: string
  defaultFirstRatio?: number
  minFirst?: number
  minSecond?: number
  first: ReactNode
  second: ReactNode
  disabled?: boolean
  className?: string
}

function readStoredRatio(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const value = Number.parseFloat(raw)
    return Number.isFinite(value) ? value : fallback
  } catch {
    return fallback
  }
}

function notifyLayoutChange() {
  window.dispatchEvent(new Event("resize"))
}

export default function ResizableSplit({
  layout,
  storageKey,
  defaultFirstRatio = 0.5,
  minFirst = 200,
  minSecond = 200,
  first,
  second,
  disabled = false,
  className,
}: ResizableSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [firstSize, setFirstSize] = useState(() =>
    readStoredRatio(storageKey, defaultFirstRatio),
  )
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    localStorage.setItem(storageKey, String(firstSize))
  }, [firstSize, storageKey])

  const updateSize = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const total = layout === "row" ? rect.width : rect.height
      if (total <= 0) return

      const pointer = layout === "row" ? clientX - rect.left : clientY - rect.top
      const handleSize = 6
      const maxFirst = total - minSecond - handleSize
      const next = Math.min(Math.max(pointer, minFirst), maxFirst)
      setFirstSize(next / total)
    },
    [layout, minFirst, minSecond],
  )

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || disabled) return
    updateSize(event.clientX, event.clientY)
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDragging(false)
    event.currentTarget.releasePointerCapture(event.pointerId)
    notifyLayoutChange()
  }

  if (disabled) {
    return (
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1",
          layout === "row" ? "flex-col xl:flex-row" : "flex-col",
          className,
        )}
      >
        <div className={cn("min-h-0 min-w-0", layout === "row" ? "xl:flex-none" : "flex-none")}>
          {first}
        </div>
        <div className="min-h-0 min-w-0 flex-1">{second}</div>
      </div>
    )
  }

  const firstStyle =
    layout === "row"
      ? { width: `${firstSize * 100}%` }
      : { height: `${firstSize * 100}%` }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex min-h-0 min-w-0 flex-1 overflow-hidden",
        layout === "row" ? "flex-row" : "flex-col",
        dragging && "select-none",
        className,
      )}
    >
      <div className="min-h-0 min-w-0 overflow-hidden" style={firstStyle}>
        {first}
      </div>

      <div
        role="separator"
        aria-orientation={layout === "row" ? "vertical" : "horizontal"}
        aria-label="Изменить размер панели"
        data-testid={`resize-handle-${storageKey}`}
        className={cn(
          "resize-handle shrink-0 touch-none bg-border transition-colors hover:bg-purple/45 active:bg-purple",
          layout === "row" ? "w-1.5 cursor-col-resize" : "h-1.5 cursor-row-resize",
          dragging && "bg-purple",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{second}</div>
    </div>
  )
}
