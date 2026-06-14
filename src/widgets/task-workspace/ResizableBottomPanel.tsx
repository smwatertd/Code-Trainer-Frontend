import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"
import { cn } from "@/shared/ui/cn"

const STORAGE_KEY = "task-workspace-bottom-h"
const DEFAULT_HEIGHT = 220
const MIN_HEIGHT = 140
const MAX_HEIGHT_RATIO = 0.42

function readStoredHeight(fallback: number): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const value = Number.parseFloat(raw)
    return Number.isFinite(value) && value >= MIN_HEIGHT ? value : fallback
  } catch {
    return fallback
  }
}

function notifyLayoutChange() {
  window.dispatchEvent(new Event("resize"))
}

type ResizableBottomPanelProps = {
  children: ReactNode
  className?: string
}

export default function ResizableBottomPanel({ children, className }: ResizableBottomPanelProps) {
  const [height, setHeight] = useState(() => readStoredHeight(DEFAULT_HEIGHT))
  const [dragging, setDragging] = useState(false)
  const startYRef = useRef(0)
  const startHeightRef = useRef(height)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(Math.round(height)))
  }, [height])

  const clampHeight = useCallback((next: number, containerHeight: number) => {
    const maxHeight = Math.max(MIN_HEIGHT, containerHeight * MAX_HEIGHT_RATIO)
    return Math.min(Math.max(next, MIN_HEIGHT), maxHeight)
  }, [])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    startYRef.current = event.clientY
    startHeightRef.current = height
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    const containerHeight = window.innerHeight
    const delta = startYRef.current - event.clientY
    setHeight(clampHeight(startHeightRef.current + delta, containerHeight))
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDragging(false)
    event.currentTarget.releasePointerCapture(event.pointerId)
    notifyLayoutChange()
  }

  return (
    <>
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Изменить высоту панели тестов"
        data-testid={`resize-handle-${STORAGE_KEY}`}
        className={cn(
          "h-1.5 shrink-0 touch-none bg-border transition-colors hover:bg-purple/45 active:bg-purple",
          dragging ? "cursor-row-resize bg-purple" : "cursor-row-resize",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
      <div
        className={cn("flex shrink-0 flex-col overflow-hidden", className)}
        style={{ height }}
      >
        {children}
      </div>
    </>
  )
}

export { STORAGE_KEY as BOTTOM_PANEL_STORAGE_KEY, DEFAULT_HEIGHT as BOTTOM_PANEL_DEFAULT_HEIGHT }
