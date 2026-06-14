import { Link } from "react-router-dom"
import ShellPage from "@/shared/ui/ShellPage"
import { Button } from "@/shared/ui/button"

export default function SettingsPage() {
  return (
    <ShellPage
      title="Настройки"
      subtitle="Профиль, безопасность и параметры обучения — в разработке"
      right={
        <Button size="sm" variant="secondary" asChild>
          <Link to="/">На главную</Link>
        </Button>
      }
    >
      <div className="rounded-lg border border-dashed border-border bg-surface/50 p-8 text-center">
        <p className="text-sm text-ink-muted">
          Раздел настроек появится в следующих версиях. Пока используйте профиль и меню пользователя
          в правом верхнем углу.
        </p>
      </div>
    </ShellPage>
  )
}
