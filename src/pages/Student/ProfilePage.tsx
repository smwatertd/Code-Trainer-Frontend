import { Link } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { useCatalogTasks } from "@/features/catalog"
import { countSolvedTasks } from "@/features/catalog/lib/taskCatalogView"
import ShellPage from "@/shared/ui/ShellPage"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { labelUserRole } from "@/shared/utils/labels"

export default function ProfilePage() {
  const { user } = useAuth()
  const { data: tasks = [] } = useCatalogTasks()

  if (!user) return null

  const solved = countSolvedTasks(tasks)

  return (
    <ShellPage
      title="Профиль"
      subtitle="Краткая сводка по аккаунту и прогрессу"
      right={
        <Button size="sm" variant="secondary" asChild>
          <Link to="/">К списку задач</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-3 text-base font-semibold">Аккаунт</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Имя</dt>
              <dd className="font-medium">{user.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Email</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Роль</dt>
              <dd>
                <Badge variant="secondary">{labelUserRole(user.role)}</Badge>
              </dd>
            </div>
          </dl>
        </section>
        <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-3 text-base font-semibold">Прогресс</h2>
          <p className="text-3xl font-extrabold text-lime">
            {solved}
            <span className="ml-1 text-base font-medium text-ink-muted">/ {tasks.length}</span>
          </p>
          <p className="mt-1 text-sm text-ink-muted">решённых задач в каталоге</p>
        </section>
      </div>
    </ShellPage>
  )
}
