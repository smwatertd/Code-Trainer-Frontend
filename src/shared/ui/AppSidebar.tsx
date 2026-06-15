import type { ReactNode } from "react"
import { NavLink, useLocation } from "react-router-dom"
import type { CurrentUser } from "@/shared/types/api"
import {
  canAccessAdminWorkspace,
  canAccessTeacherWorkspace,
} from "@/shared/types/user"
import { cn } from "@/shared/ui/cn"
import Brand from "@/shared/ui/Brand"
import StreakCard from "@/shared/ui/StreakCard"
import { Button } from "@/shared/ui/button"

type NavItem = {
  to: string
  label: string
  end?: boolean
  matchPrefix?: string
}

function NavSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <div className="mb-1 mt-3.5 px-2.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-faint first:mt-0">
        {title}
      </div>
      {children}
    </>
  )
}

function SidebarLink({ item, purpleAccent }: { item: NavItem; purpleAccent: boolean }) {
  const location = useLocation()
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => {
        const active =
          isActive ||
          (item.matchPrefix != null && location.pathname.startsWith(item.matchPrefix))
        return cn(
          "mb-0.5 flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13.5px] font-medium text-ink-muted transition-colors",
          active
            ? purpleAccent
              ? "bg-purple-soft text-[#b89bff]"
              : "bg-lime-soft text-lime"
            : "hover:bg-surface hover:text-ink",
        )
      }}
    >
      <span className="h-4 w-4 shrink-0 rounded-[5px] border-[1.6px] border-current opacity-70" />
      {item.label}
    </NavLink>
  )
}

type AppSidebarProps = {
  user: CurrentUser | null
  onLogout: () => void
}

export default function AppSidebar({ user, onLogout }: AppSidebarProps) {
  const isTeacher = canAccessTeacherWorkspace(user)
  const isAdmin = canAccessAdminWorkspace(user)
  const purpleAccent = isTeacher || isAdmin

  const learningItems: NavItem[] = [
    { to: "/", label: "Список задач", end: true },
    { to: "/learn", label: "Учебные треки", matchPrefix: "/learn" },
  ]

  if (user) {
    learningItems.push({ to: "/student/profile", label: "Профиль", matchPrefix: "/student/profile" })
    if (isTeacher) {
      learningItems.push({
        to: "/teacher/groups",
        label: "Мои группы",
        matchPrefix: "/teacher/groups",
      })
    } else {
      learningItems.push({
        to: "/assignment-sets",
        label: "Мои группы",
        matchPrefix: "/assignment-sets",
      })
    }
  }

  const accountItems: NavItem[] = user
    ? [{ to: "/settings/profile", label: "Настройки", matchPrefix: "/settings" }]
    : []

  const workspaceItems: NavItem[] = []
  if (user && isTeacher) {
    workspaceItems.push({ to: "/teacher/cabinet", label: "Кабинет преподавателя" })
  }
  if (user && isAdmin) {
    workspaceItems.push({ to: "/admin/curriculum/python", label: "Панель управления" })
  }

  return (
    <nav className="sticky flex h-[calc(100vh-var(--banner-h))] w-[230px] shrink-0 flex-col overflow-y-auto border-r border-border bg-[#0c111a] px-3.5 py-[18px]" style={{ top: "var(--banner-h)" }}>
      <div className="mb-[18px] px-1.5 pt-1">
        <Brand compact purple={purpleAccent} />
      </div>

      <NavSection title="Обучение">
        {learningItems.map((item) => (
          <SidebarLink key={item.to + item.label} item={item} purpleAccent={purpleAccent} />
        ))}
      </NavSection>

      {workspaceItems.length > 0 ? (
        <NavSection title="Рабочее пространство">
          {workspaceItems.map((item) => (
            <SidebarLink key={item.to + item.label} item={item} purpleAccent={purpleAccent} />
          ))}
        </NavSection>
      ) : null}

      {accountItems.length > 0 ? (
        <NavSection title="Аккаунт">
          {accountItems.map((item) => (
            <SidebarLink key={item.to + item.label} item={item} purpleAccent={purpleAccent} />
          ))}
        </NavSection>
      ) : null}

      <div className="mt-auto space-y-3 pt-[18px]">
        {user ? <StreakCard /> : null}
        {user ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-ink-muted"
            onClick={onLogout}
            data-testid="logout-btn"
          >
            ↪ Выйти
          </Button>
        ) : (
          <div className="flex flex-col gap-2 px-1">
            <Button variant="ghost" size="sm" asChild className="justify-start">
              <NavLink to="/login">Войти</NavLink>
            </Button>
            <Button size="sm" asChild>
              <NavLink to="/register">Регистрация</NavLink>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
