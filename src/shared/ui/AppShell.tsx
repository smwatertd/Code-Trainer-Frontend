import { Link } from "react-router-dom"
import type { ReactNode } from "react"
import type { CurrentUser } from "@/shared/types/api"
import {
  canAccessAdminWorkspace,
  canAccessTeacherWorkspace,
} from "@/shared/types/user"
import { labelUserRole } from "@/shared/utils/labels"
import { Button } from "@/shared/ui/button"

type AppShellProps = {
  children: ReactNode
  user: CurrentUser | null
  onLogout: () => void
}

export default function AppShell({ children, user, onLogout }: AppShellProps) {
  const isTeacher = canAccessTeacherWorkspace(user)
  const isAdmin = canAccessAdminWorkspace(user)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-semibold">
              Code Trainer
            </Link>
            <nav className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex">
              <Link to="/" className="hover:text-foreground">
                Задачи
              </Link>
              {isTeacher ? (
                <>
                  <Link to="/teacher/groups" className="hover:text-foreground">
                    Группы
                  </Link>
                  <Link to="/teacher/assignment-sets" className="hover:text-foreground">
                    Наборы
                  </Link>
                  <Link to="/teacher/tasks/library" className="hover:text-foreground">
                    Библиотека
                  </Link>
                  <Link to="/teacher/tasks/4/curriculum" className="hover:text-foreground">
                    Учебный план
                  </Link>
                </>
              ) : null}
              {user && !isTeacher ? (
                <>
                  <Link to="/assignment-sets" className="hover:text-foreground">
                    Наборы
                  </Link>
                  <Link to="/groups/join" className="hover:text-foreground">
                    Группы
                  </Link>
                </>
              ) : null}
              {isAdmin ? (
                <Link to="/admin/curriculum/python" className="hover:text-foreground">
                  Админ
                </Link>
              ) : null}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline" data-testid="user-info">
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
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
