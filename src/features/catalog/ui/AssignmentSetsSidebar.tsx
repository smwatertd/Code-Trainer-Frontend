import { Link } from "react-router-dom"
import { useAccessibleAssignmentSets } from "@/features/assignment-sets/hooks/useAssignmentSets"
import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/ui/cn"

type AssignmentSetsSidebarProps = {
  className?: string
}

export default function AssignmentSetsSidebar({ className }: AssignmentSetsSidebarProps) {
  const setsQuery = useAccessibleAssignmentSets()

  return (
    <aside
      className={cn(
        "rounded-lg border border-border bg-surface p-5 shadow-card",
        className,
      )}
    >
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <b className="text-[15px]">Сборники</b>
        <Badge variant="secondary">{setsQuery.data?.length ?? 0}</Badge>
      </div>

      {setsQuery.isLoading ? (
        <p className="text-sm text-ink-muted">Загрузка…</p>
      ) : !setsQuery.data?.length ? (
        <div className="space-y-3">
          <p className="text-sm text-ink-muted">
            Наборов пока нет. Вступите в группу по коду преподавателя.
          </p>
          <Link
            to="/groups/join"
            className="flex w-full items-center justify-center rounded-xl border border-dashed border-[#333d4f] px-3 py-3 text-[13px] text-ink-muted transition hover:border-lime hover:text-lime"
          >
            + Ввести инвайт-код
          </Link>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {setsQuery.data.map((set, index) => {
            const total = set.items.length
            const purple = index % 2 === 1
            return (
              <Link
                key={set.id}
                to="/assignment-sets"
                data-testid={`assignment-set-${set.id}`}
                className="block rounded-xl border border-border p-3 transition hover:border-lime/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <b className="text-[13.5px]">{set.name}</b>
                  <Badge variant={purple ? "secondary" : "default"}>
                    {total} {total === 1 ? "задача" : "задач"}
                  </Badge>
                </div>
                <div className={cn("tp-progress mt-2.5", purple && "pp")}>
                  <i style={{ width: total > 0 ? "35%" : "0%" }} />
                </div>
              </Link>
            )
          })}
          <Link
            to="/groups/join"
            className="flex w-full items-center justify-center rounded-xl border border-dashed border-[#333d4f] px-3 py-3 text-[13px] text-ink-muted transition hover:border-lime hover:text-lime"
          >
            + Ввести инвайт-код
          </Link>
        </div>
      )}
    </aside>
  )
}
