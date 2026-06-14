import { Link, useParams } from "react-router-dom"
import { useGroupDashboard } from "@/features/groups/hooks/useGroups"
import ApiErrorAlert from "@/shared/ui/ApiErrorAlert"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"

import { labelProgressStatus } from "@/shared/utils/labels"

export default function GroupDashboardPage() {
  const { id } = useParams()
  const groupId = Number(id)
  const dashboardQuery = useGroupDashboard(groupId)

  if (!groupId) {
    return <p className="px-4 py-8 text-sm text-muted-foreground">Некорректный ID группы</p>
  }

  if (dashboardQuery.isLoading) {
    return <p className="px-4 py-8 text-sm text-muted-foreground">Загрузка дашборда…</p>
  }

  if (dashboardQuery.isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <ApiErrorAlert error={dashboardQuery.error} />
        <Button variant="link" className="mt-4 px-0" asChild>
          <Link to="/teacher/groups">← К группам</Link>
        </Button>
      </div>
    )
  }

  const dashboard = dashboardQuery.data!
  const taskIds = [...new Set(dashboard.task_progress.map((item) => item.task_id))].sort(
    (left, right) => left - right,
  )

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8" data-testid="group-dashboard">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button variant="link" className="mb-2 h-auto px-0 text-muted-foreground" asChild>
            <Link to="/teacher/groups">← Группы</Link>
          </Button>
          <h1 className="text-2xl font-semibold" data-testid="group-dashboard-title">
            {dashboard.group.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Участников: {dashboard.members.length} · Наборов: {dashboard.assignment_sets.length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Участники</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboard.members.length ? (
              dashboard.members.map((member) => (
                <div
                  key={member.id}
                  data-testid={`dashboard-member-${member.id}`}
                  className="rounded-lg border p-3 text-sm"
                >
                  <p className="font-medium">{member.name}</p>
                  <p className="text-muted-foreground">{member.email}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Пока нет участников</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Наборы заданий</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboard.assignment_sets.length ? (
              dashboard.assignment_sets.map((set) => (
                <div key={set.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">{set.name}</p>
                  <p className="text-muted-foreground">Задач: {set.task_count}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Наборов пока нет</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Прогресс студентов</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dashboard.student_summaries.length ? (
            dashboard.student_summaries.map((summary) => (
              <div
                key={summary.student_id}
                data-testid={`dashboard-student-${summary.student_id}`}
                className="space-y-2 rounded-lg border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{summary.student_name}</p>
                  <Badge variant="secondary">
                    {summary.solved_count}/{summary.total_tasks} · {summary.progress_percent}%
                  </Badge>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${summary.progress_percent}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Нет данных о прогрессе</p>
          )}
        </CardContent>
      </Card>

      {taskIds.length && dashboard.members.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Матрица задач</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 font-medium">Студент</th>
                  {taskIds.map((taskId) => (
                    <th key={taskId} className="px-2 py-2 font-medium">
                      #{taskId}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dashboard.members.map((member) => (
                  <tr key={member.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{member.name}</td>
                    {taskIds.map((taskId) => {
                      const row = dashboard.task_progress.find(
                        (item) => item.student_id === member.id && item.task_id === taskId,
                      )
                      const status = row?.progress_status ?? "not_started"
                      return (
                        <td key={taskId} className="px-2 py-2">
                          <Badge variant="outline">{labelProgressStatus(status)}</Badge>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
