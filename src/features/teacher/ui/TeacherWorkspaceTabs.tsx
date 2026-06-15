import { Link, useLocation } from "react-router-dom"
import { cn } from "@/shared/ui/cn"

const TABS = [
  { id: "tasks", label: "Мои задачи", to: "/teacher/cabinet" },
  { id: "groups", label: "Мои группы", to: "/teacher/groups", matchPrefix: "/teacher/groups" },
  { id: "sets", label: "Наборы", to: "/teacher/assignment-sets" },
  { id: "library", label: "Библиотека", to: "/teacher/tasks/library" },
] as const

export default function TeacherWorkspaceTabs() {
  const location = useLocation()

  return (
    <div className="tp-tabbar mb-6">
      {TABS.map((tab) => {
        const active =
          location.pathname === tab.to ||
          (tab.matchPrefix != null && location.pathname.startsWith(tab.matchPrefix)) ||
          (tab.id === "tasks" && location.pathname === "/teacher/cabinet")
        return (
          <Link key={tab.id} to={tab.to} className={cn(active && "on", "no-underline")}>
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
