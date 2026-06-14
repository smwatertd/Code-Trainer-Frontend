import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import type { CurrentUser } from "@/shared/types/api"
import { labelUserRole } from "@/shared/utils/labels"
import { cn } from "@/shared/ui/cn"

type UserMenuProps = {
  user: CurrentUser
  onLogout: () => void
  className?: string
}

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase()
}

export default function UserMenu({ user, onLogout, className }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener("pointerdown", onPointerDown)
    return () => window.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  const initials = userInitials(user.name)

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className="grid h-9 w-9 place-items-center rounded-full border border-purple/40 bg-purple-soft text-sm font-bold text-[#cbb6ff] transition hover:border-purple hover:bg-purple hover:text-white"
        aria-label={`Меню пользователя: ${user.name}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {initials}
      </button>
      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-[200px] overflow-hidden rounded-lg border border-border bg-surface py-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,.85)]">
          <div className="border-b border-border px-3.5 py-2.5">
            <b className="block text-sm">{user.name}</b>
            <span className="text-xs text-ink-muted">{labelUserRole(user.role)}</span>
          </div>
          <Link
            to="/profile"
            className="block px-3.5 py-2 text-sm text-ink-muted transition hover:bg-surface-2 hover:text-ink"
            onClick={() => setOpen(false)}
          >
            Профиль
          </Link>
          <Link
            to="/settings"
            className="block px-3.5 py-2 text-sm text-ink-muted transition hover:bg-surface-2 hover:text-ink"
            onClick={() => setOpen(false)}
          >
            Настройки
          </Link>
          <button
            type="button"
            className="block w-full px-3.5 py-2 text-left text-sm text-ink-muted transition hover:bg-surface-2 hover:text-ink"
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
          >
            Выйти
          </button>
        </div>
      ) : null}
    </div>
  )
}
