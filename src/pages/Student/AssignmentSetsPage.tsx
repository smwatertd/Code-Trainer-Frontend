import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import {
  useAccessibleAssignmentSets,
} from "@/features/assignment-sets/hooks/useAssignmentSets"
import { Badge } from "@/shared/ui/badge"
import ShellPage from "@/shared/ui/ShellPage"
import { Button } from "@/shared/ui/button"

export default function StudentAssignmentSetsPage() {
  const setsQuery = useAccessibleAssignmentSets()

  return (
    <ShellPage
      title="Мои группы"
      subtitle="Сборники и задания от преподавателя"
      right={
        <Button size="sm" variant="secondary" asChild>
          <Link to="/groups/join">Вступить в группу</Link>
        </Button>
      }
    >
      <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
        {setsQuery.isLoading ? (
          <p className="text-sm text-ink-muted">Загрузка…</p>
        ) : !setsQuery.data?.length ? (
          <p className="text-sm text-ink-muted">
            Наборов нет. Вступите в группу по коду преподавателя.
          </p>
        ) : (
          <div className="grid gap-3">
            {setsQuery.data.map((set) => (
              <div
                key={set.id}
                data-testid={`assignment-set-${set.id}`}
                className="rounded-xl border border-border p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{set.name}</h2>
                  <Badge variant="outline">{set.visibility}</Badge>
                  {set.group_id ? (
                    <Badge variant="muted">группа #{set.group_id}</Badge>
                  ) : null}
                </div>
                {set.description ? (
                  <p className="mb-2 text-sm text-ink-muted">{set.description}</p>
                ) : null}
                <ul className="text-sm">
                  {set.items.map((item) => (
                    <li key={item.task_id}>
                      <Link
                        to={`/tasks/${item.task_id}`}
                        className="font-medium text-lime hover:underline"
                      >
                        Задача {item.task_id}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </ShellPage>
  )
}
