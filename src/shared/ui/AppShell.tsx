import { useLocation } from "react-router-dom"
import type { ReactNode } from "react"
import type { CurrentUser } from "@/shared/types/api"
import AppSidebar from "@/shared/ui/AppSidebar"
import AppTopbar from "@/shared/ui/AppTopbar"

type AppShellProps = {
  children: ReactNode
  user: CurrentUser | null
  onLogout: () => void
}

const AUTH_PATHS = new Set(["/login", "/register"])

function usePageMeta(pathname: string): { crumbHome?: string; crumbCurrent: string } {
  if (pathname === "/") return { crumbHome: "Практика кода", crumbCurrent: "Список задач" }
  if (pathname === "/profile") return { crumbHome: "Практика кода", crumbCurrent: "Профиль" }
  if (pathname === "/settings") return { crumbHome: "Практика кода", crumbCurrent: "Настройки" }
  if (pathname.startsWith("/learn/")) {
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length >= 3) {
      return { crumbHome: "Практика кода", crumbCurrent: "Сборник" }
    }
    return { crumbHome: "Практика кода", crumbCurrent: "Учебные треки" }
  }
  if (pathname.startsWith("/assignment-sets")) return { crumbHome: "Практика кода", crumbCurrent: "Наборы" }
  if (pathname.startsWith("/groups/join")) return { crumbHome: "Практика кода", crumbCurrent: "Мои группы" }
  if (pathname === "/teacher/cabinet")
    return { crumbHome: "Преподаватель", crumbCurrent: "Кабинет" }
  if (pathname.startsWith("/teacher/groups")) return { crumbHome: "Преподаватель", crumbCurrent: "Группы" }
  if (pathname.startsWith("/teacher/assignment-sets"))
    return { crumbHome: "Преподаватель", crumbCurrent: "Наборы" }
  if (pathname.startsWith("/teacher/tasks/library"))
    return { crumbHome: "Преподаватель", crumbCurrent: "Библиотека" }
  if (pathname.startsWith("/admin")) return { crumbHome: "Админ", crumbCurrent: "Curriculum" }
  return { crumbCurrent: "Практика кода" }
}

export default function AppShell({ children, user, onLogout }: AppShellProps) {
  const { pathname } = useLocation()
  const isAuthPage = AUTH_PATHS.has(pathname)
  const isTaskPage = pathname.startsWith("/tasks/")

  if (isAuthPage || isTaskPage) {
    return <>{children}</>
  }

  const meta = usePageMeta(pathname)

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[230px_1fr]">
      <div className="hidden lg:block">
        <AppSidebar user={user} onLogout={onLogout} />
      </div>
      <div className="min-w-0">
        <AppTopbar
          user={user}
          onLogout={onLogout}
          crumbHome={meta.crumbHome}
          crumbCurrent={meta.crumbCurrent}
        />
        <main className="px-7">
          <div className="mx-auto max-w-[1320px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
