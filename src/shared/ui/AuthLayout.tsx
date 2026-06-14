import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import Brand from "@/shared/ui/Brand"
import { Badge } from "@/shared/ui/badge"

type AuthBrandPanelProps = {
  headline?: ReactNode
  description?: string
}

export function AuthBrandPanel({
  headline = (
    <>
      Тренажёр, который
      <br />
      учит писать <em className="font-serif font-normal not-italic text-lime">код</em>
    </>
  ),
  description = "Задачи, автоматические тесты и прогресс — в одном тёмном минималистичном интерфейсе.",
}: AuthBrandPanelProps) {
  return (
    <div className="auth-brand">
      <Brand />
      <div>
        <div className="text-[34px] font-extrabold leading-[1.1] tracking-[-1px]">{headline}</div>
        <p className="mt-3.5 max-w-[340px] text-sm text-ink-muted">{description}</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Badge variant="default">600+ задач</Badge>
          <Badge variant="secondary">3 языка</Badge>
          <Badge variant="muted">Авто-проверка</Badge>
        </div>
      </div>
      <span className="text-xs text-ink-faint">© 2026 Практика кода</span>
    </div>
  )
}

export function AuthGuestLink() {
  return (
    <Link to="/" className="btn-guest">
      → Войти без регистрации
    </Link>
  )
}

export function AuthSplitLayout({
  brand,
  children,
}: {
  brand?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="auth-shell">
      <div className="auth-split">
        {brand ?? <AuthBrandPanel />}
        <div className="auth-form">{children}</div>
      </div>
    </div>
  )
}

export function AuthCardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">{children}</div>
    </div>
  )
}
