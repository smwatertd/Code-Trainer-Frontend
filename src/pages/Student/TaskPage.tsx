import { useMemo } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useCatalogTasks } from "@/features/catalog"
import { useTaskSolver } from "@/features/task-solving"
import { useTaskProgress } from "@/features/progress/hooks/useTaskProgress"
import TaskWorkspace from "@/widgets/task-workspace/TaskWorkspace"
import TaskWorkspaceHeader from "@/widgets/task-workspace/TaskWorkspaceHeader"
import { useAuth } from "@/features/auth"
import { labelProgressStatus } from "@/shared/utils/labels"
import { canAccessTeacherWorkspace } from "@/shared/types/user"
import GuestBanner from "@/shared/ui/GuestBanner"
import { Button } from "@/shared/ui/button"

export default function TaskPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, isGuest, logout } = useAuth()
  const taskId = id ? Number(id) : null
  const solver = useTaskSolver({ mode: isAuthenticated ? "student" : "guest", taskId })
  const progressQuery = useTaskProgress(taskId, isAuthenticated)
  const { data: catalogTasks = [] } = useCatalogTasks()
  const isTeacher = canAccessTeacherWorkspace(user)

  const taskMismatch =
    taskId != null && solver.task != null && solver.task.id !== taskId

  const navIndex = useMemo(
    () => catalogTasks.findIndex((item) => item.id === taskId),
    [catalogTasks, taskId],
  )

  if (solver.isTaskLoading || taskMismatch || (taskId != null && !solver.task)) {
    return <p className="px-4 py-12 text-center text-ink-muted">Загрузка задачи…</p>
  }

  if (!solver.task) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-ink-muted">{solver.taskLoadError || "Задача не найдена"}</p>
        <Button variant="ghost" onClick={() => navigate("/")}>
          К каталогу
        </Button>
      </div>
    )
  }

  const progress = progressQuery.data

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <TaskWorkspaceHeader
        task={solver.task}
        user={user}
        onLogout={() => void logout()}
        taskIndex={navIndex >= 0 ? navIndex : undefined}
        taskTotal={catalogTasks.length || undefined}
        onPrev={
          navIndex > 0
            ? () => navigate(`/tasks/${catalogTasks[navIndex - 1]?.id}`)
            : undefined
        }
        onNext={
          navIndex >= 0 && navIndex < catalogTasks.length - 1
            ? () => navigate(`/tasks/${catalogTasks[navIndex + 1]?.id}`)
            : undefined
        }
      />

      {isGuest ? (
        <div className="shrink-0 px-4 pt-3">
          <GuestBanner />
        </div>
      ) : null}

      {progress ? (
        <div
          className="flex shrink-0 flex-wrap items-center gap-4 border-b border-border bg-surface px-5 py-2.5 text-sm text-ink-muted"
          data-testid="task-progress"
        >
          <span>
            Прогресс:{" "}
            <strong className="text-ink">{labelProgressStatus(progress.progress_status)}</strong>
          </span>
          <span>Попыток: {progress.attempts_count}</span>
          <span>
            Успешных: <strong className="text-ink">{progress.passed_count}</strong>
          </span>
          {isTeacher && taskId ? (
            <Button variant="outline" size="sm" className="ml-auto" asChild>
              <Link to={`/teacher/tasks/${taskId}/curriculum`}>Учебный план</Link>
            </Button>
          ) : null}
        </div>
      ) : isTeacher && taskId ? (
        <div className="flex shrink-0 justify-end border-b border-border px-5 py-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/teacher/tasks/${taskId}/curriculum`}>Учебный план</Link>
          </Button>
        </div>
      ) : null}

      <TaskWorkspace solver={solver} isGuest={isGuest} />
    </div>
  )
}
