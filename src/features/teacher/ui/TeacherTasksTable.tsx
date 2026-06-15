import { Link } from "react-router-dom"
import DiffBadge from "@/features/catalog/ui/DiffBadge"
import type { TaskSummary } from "@/shared/types/api"
import { labelTaskType } from "@/shared/utils/labels"
import EmptyState from "@/shared/ui/EmptyState"
import { Button } from "@/shared/ui/button"

type TeacherTasksTableProps = {
  tasks: TaskSummary[]
  isLoading: boolean
  error?: string | null
}

function taskLanguageLabel(task: TaskSummary): string {
  const langs = task.languages ?? []
  if (langs.length === 0) return "—"
  return langs.join(", ")
}

export default function TeacherTasksTable({ tasks, isLoading, error }: TeacherTasksTableProps) {
  if (isLoading) {
    return <p className="text-sm text-ink-muted">Загрузка ваших задач…</p>
  }

  if (error) {
    return <p className="text-sm text-danger">{error}</p>
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="У вас пока нет своих задач"
        description="Создайте задание — оно появится здесь и будет доступно для наборов и групп."
        action={
          <Button size="sm" asChild>
            <Link to="/teacher/tasks/new">+ Создать задачу</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <table className="w-full border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-faint">
            <th className="px-4 py-3 font-semibold">Задача</th>
            <th className="px-4 py-3 font-semibold">Тип</th>
            <th className="px-4 py-3 font-semibold">Язык</th>
            <th className="px-4 py-3 font-semibold">Сложность</th>
            <th className="px-4 py-3 font-semibold text-right">Действия</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b border-border/70 last:border-0">
              <td className="px-4 py-3">
                <Link
                  to={`/teacher/tasks/${task.id}/edit`}
                  className="font-medium text-ink hover:text-lime"
                >
                  {task.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-ink-muted">{labelTaskType(task.task_type)}</td>
              <td className="px-4 py-3 font-mono text-[12px] text-ink-muted">
                {taskLanguageLabel(task)}
              </td>
              <td className="px-4 py-3">
                <DiffBadge difficulty={task.difficulty} />
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/teacher/tasks/${task.id}/edit`}>Редактировать</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
