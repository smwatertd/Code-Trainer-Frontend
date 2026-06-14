import { Link, useLocation, useNavigate } from "react-router-dom"
import type { TaskDetail } from "@/shared/types/api"
import type { CurrentUser } from "@/shared/types/api"
import type { CurriculumNavState } from "@/features/curriculum/types"
import { labelUserRole } from "@/shared/utils/labels"
import { labelDifficulty } from "@/shared/utils/labels"
import Brand from "@/shared/ui/Brand"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"

type TaskWorkspaceHeaderProps = {
  task: TaskDetail
  user: CurrentUser | null
  onLogout: () => void
  taskIndex?: number
  taskTotal?: number
  onPrev?: () => void
  onNext?: () => void
}

export default function TaskWorkspaceHeader({
  task,
  user,
  onLogout,
  taskIndex,
  taskTotal,
  onPrev,
  onNext,
}: TaskWorkspaceHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const curriculumState = location.state as CurriculumNavState | null
  const backTarget = curriculumState?.returnTo ?? "/"
  const backLabel = curriculumState?.returnTo?.includes("/learn/")
    ? curriculumState.collectionTitle
      ? `← ${curriculumState.collectionTitle}`
      : "← К сборнику"
    : "← Каталог"

  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-[rgba(12,17,26,.85)] px-5 py-3 backdrop-blur-md">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <Link to="/" className="hidden sm:block">
          <Brand compact />
        </Link>
        <Button variant="ghost" size="sm" onClick={() => navigate(backTarget)}>
          {backLabel}
        </Button>
        <div className="text-sm text-ink-muted">
          Задачи / <b className="font-semibold text-ink">{task.title}</b>
        </div>
        <Badge variant="muted">{labelDifficulty(task.difficulty)}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {taskIndex != null && taskTotal != null ? (
          <span className="text-sm text-ink-muted">
            Задача {taskIndex + 1} из {taskTotal}
          </span>
        ) : null}
        <Button variant="ghost" size="sm" disabled={!onPrev} onClick={onPrev}>
          ← Предыдущая
        </Button>
        <Button variant="ghost" size="sm" disabled={!onNext} onClick={onNext}>
          Следующая →
        </Button>
        {user ? (
          <>
            <span className="hidden text-sm text-ink-muted md:inline" data-testid="user-info">
              {user.name} · {labelUserRole(user.role)}
            </span>
            <Button variant="ghost" size="sm" onClick={onLogout} data-testid="logout-btn">
              Выйти
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Войти</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Регистрация</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
