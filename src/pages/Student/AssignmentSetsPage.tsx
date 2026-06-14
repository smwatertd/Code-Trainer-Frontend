import { Link } from "react-router-dom"
import {
  useAccessibleAssignmentSets,
} from "@/features/assignment-sets/hooks/useAssignmentSets"
import { Badge } from "@/shared/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"

export default function StudentAssignmentSetsPage() {
  const setsQuery = useAccessibleAssignmentSets()

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Наборы заданий</h1>
          <p className="text-sm text-muted-foreground">Задания от преподавателя и публичные наборы</p>
        </div>
        <Link to="/groups/join" className="text-sm text-primary hover:underline">
          Вступить в группу
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Доступные наборы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {setsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Загрузка…</p>
          ) : !setsQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">
              Наборов нет. Вступите в группу по коду преподавателя.
            </p>
          ) : (
            setsQuery.data.map((set) => (
              <div
                key={set.id}
                data-testid={`assignment-set-${set.id}`}
                className="space-y-2 rounded-lg border p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium">{set.name}</h2>
                  <Badge variant="outline">{set.visibility}</Badge>
                  {set.group_id ? <Badge variant="secondary">группа #{set.group_id}</Badge> : null}
                </div>
                {set.description ? (
                  <p className="text-sm text-muted-foreground">{set.description}</p>
                ) : null}
                <ul className="text-sm">
                  {set.items.map((item) => (
                    <li key={item.task_id}>
                      <Link to={`/tasks/${item.task_id}`} className="text-primary hover:underline">
                        Задача {item.task_id}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
