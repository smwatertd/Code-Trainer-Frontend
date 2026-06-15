import type { ReactNode } from "react"
import { Bell } from "lucide-react"
import type { CurrentUser } from "@/shared/types/api"
import { labelUserRole } from "@/shared/utils/labels"
import UserMenu from "@/shared/ui/UserMenu"
import { Button } from "@/shared/ui/button"

type AppTopbarProps = {
  user: CurrentUser | null
  onLogout: () => void
  crumbHome?: string
  crumbCurrent?: string
  right?: ReactNode
}

export default function AppTopbar({
  user,
  onLogout,
  crumbHome,
  crumbCurrent,
  right,
}: AppTopbarProps) {
  return (
    <header className="sticky z-10 flex h-14 items-center justify-between border-b border-border bg-[rgba(12,17,26,.6)] px-6 backdrop-blur-md" style={{ top: "var(--banner-h)" }}>
      <div className="text-sm text-ink-muted">
        {crumbHome ? (
          <>
            {crumbHome} / <b className="font-semibold text-ink">{crumbCurrent}</b>
          </>
        ) : (
          <b className="font-semibold text-ink">{crumbCurrent ?? "Практика кода"}</b>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        {right}
        {user ? (
          <>
            <span
              className="hidden text-sm text-ink-muted sm:inline"
              data-testid="user-info"
            >
              {user.name} · {labelUserRole(user.role)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="relative hidden h-9 w-9 p-0 text-ink-muted hover:text-ink sm:inline-flex"
              aria-label="Уведомления"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ffc247]" />
            </Button>
            <UserMenu user={user} onLogout={onLogout} />
          </>
        ) : null}
      </div>
    </header>
  )
}
