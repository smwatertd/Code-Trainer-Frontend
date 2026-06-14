import { Link, useParams } from "react-router-dom"
import { useGroupDashboard } from "@/features/groups/hooks/useGroups"
import ApiErrorAlert from "@/shared/ui/ApiErrorAlert"
import ShellPage from "@/shared/ui/ShellPage"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { labelProgressStatus } from "@/shared/utils/labels"

export default function GroupDashboardPage() {
  const { id } = useParams()
  const groupId = Number(id)
  const dashboardQuery = useGroupDashboard(groupId)

  if (!groupId) {
    return <p className="py-8 text-sm text-ink-muted">Некорректный ID группы</p>
  }

  if (dashboardQuery.isLoading) {
    return <p className="py-8 text-sm text-ink-muted">Загрузка дашборда…</p>
  }

  if (dashboardQuery.isError) {
    return (
      <ShellPage title="Дашборд группы">
        <ApiErrorAlert error={dashboardQuery.error} />
        <Button variant="link" className="mt-4 h-auto px-0 text-lime" asChild>
          <Link to="/teacher/groups">← К группам</Link>
        </Button>
      </ShellPage>
    )
  }

  const dashboard = dashboardQuery.data!
  const taskIds = [...new Set(dashboard.task_progress.map((item) => item.task_id))].sort(
    (left, right) => left - right,
  )

  return (
    <div data-testid="group-dashboard">
      <ShellPage
        title={dashboard.group.name}
        subtitle={`Участников: ${dashboard.members.length} · Наборов: ${dashboard.assignment_sets.length}`}
        right={
          <Button variant="ghost" size="sm" asChild>
            <Link to="/teacher/groups">← Группы</Link>
          </Button>
        }
      >
        <h1 className="sr-only" data-testid="group-dashboard-title">
          {dashboard.group.name}
        </h1>

        <div className="mb-[18px] grid gap-[18px] md:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
            <b className="mb-3 block text-[15px]">Участники</b>
            <div className="space-y-2">
              {dashboard.members.length ? (
                dashboard.members.map((member) => (
                  <div
                    key={member.id}
                    data-testid={`dashboard-member-${member.id}`}
                    className="rounded-xl border border-border bg-surface-2 p-3 text-sm"
                  >
                    <p className="font-medium">{member.name}</p>
                    <p className="text-ink-muted">{member.email}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-muted">Пока нет участников</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
            <b className="mb-3 block text-[15px]">Наборы заданий</b>
            <div className="space-y-2">
              {dashboard.assignment_sets.length ? (
                dashboard.assignment_sets.map((set) => (
                  <div key={set.id} className="rounded-xl border border-border bg-surface-2 p-3 text-sm">
                    <p className="font-medium">{set.name}</p>
                    <p className="text-ink-muted">Задач: {set.task_count}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-muted">Наборов пока нет</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-[18px] rounded-lg border border-border bg-surface p-5 shadow-card">
          <b className="mb-3 block text-[15px]">Прогресс студентов</b>
          <div className="space-y-4">
            {dashboard.student_summaries.length ? (
              dashboard.student_summaries.map((summary) => (
                <div
                  key={summary.student_id}
                  data-testid={`dashboard-student-${summary.student_id}`}
                  className="rounded-xl border border-border bg-surface-2 p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{summary.student_name}</p>
                    <Badge variant="secondary">
                      {summary.solved_count}/{summary.total_tasks} · {summary.progress_percent}%
                    </Badge>
                  </div>
                  <div className="tp-progress pp">
                    <i style={{ width: `${summary.progress_percent}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink-muted">Нет данных о прогрессе</p>
            )}
          </div>
        </div>

        {taskIds.length && dashboard.members.length ? (
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
            <b className="mb-3 block text-[15px]">Матрица задач</b>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="text-left text-[11.5px] font-semibold uppercase tracking-wider text-ink-faint">
                    <th className="pb-3 pr-4">Студент</th>
                    {taskIds.map((taskId) => (
                      <th key={taskId} className="px-2 pb-3 font-semibold">
                        #{taskId}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dashboard.members.map((member) => (
                    <tr key={member.id}>
                      <td className="border-t border-border py-2.5 pr-4">{member.name}</td>
                      {taskIds.map((taskId) => {
                        const row = dashboard.task_progress.find(
                          (item) => item.student_id === member.id && item.task_id === taskId,
                        )
                        const status = row?.progress_status ?? "not_started"
                        return (
                          <td key={taskId} className="border-t border-border px-2 py-2.5">
                            <Badge variant="muted" className="whitespace-nowrap">
                              {labelProgressStatus(status)}
                            </Badge>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </ShellPage>
    </div>
  )
}
