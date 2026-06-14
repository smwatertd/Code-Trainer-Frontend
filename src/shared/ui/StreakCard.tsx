import { useCatalogTasks } from "@/features/catalog"
import { countSolvedTasks } from "@/features/catalog/lib/taskCatalogView"
import { useAuth } from "@/features/auth"

export default function StreakCard() {
  const { isAuthenticated } = useAuth()
  const { data: tasks = [] } = useCatalogTasks()

  if (!isAuthenticated) return null

  const solved = countSolvedTasks(tasks)
  const streak = solved > 0 ? Math.min(solved, 99) : 0

  return (
    <div className="rounded-lg border border-border bg-surface/80 px-3 py-3">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
        Серия дней
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-[28px] font-extrabold leading-none text-lime">{streak}</span>
        <span className="pb-0.5 text-xs text-ink-muted">
          {streak === 1 ? "день подряд" : "дней подряд"}
        </span>
        {streak > 0 ? <span aria-hidden>🔥</span> : null}
      </div>
    </div>
  )
}
