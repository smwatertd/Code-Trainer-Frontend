import { Link, useParams, useNavigate } from "react-router-dom"
import { useTaskSolver } from "@/features/task-solving"
import { useTaskProgress } from "@/features/progress/hooks/useTaskProgress"
import TaskWorkspace from "@/widgets/task-workspace/TaskWorkspace"
import { useAuth } from "@/features/auth"
import { labelProgressStatus } from "@/shared/utils/labels"
import { canAccessTeacherWorkspace } from "@/shared/types/user"
import GuestBanner from "@/shared/ui/GuestBanner"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"

export default function TaskPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, isGuest } = useAuth()
  const taskId = id ? Number(id) : null
  const solver = useTaskSolver({ mode: isAuthenticated ? "student" : "guest", taskId })
  const progressQuery = useTaskProgress(taskId, isAuthenticated)
  const isTeacher = canAccessTeacherWorkspace(user)

  const taskMismatch =
    taskId != null && solver.task != null && solver.task.id !== taskId

  if (solver.isTaskLoading || taskMismatch || (taskId != null && !solver.task)) {
    return <p className="px-4 py-12 text-center text-muted-foreground">Загрузка задачи…</p>
  }

  if (!solver.task) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
        <p className="text-muted-foreground">{solver.taskLoadError || "Задача не найдена"}</p>
        <Button variant="ghost" onClick={() => navigate("/")}>
          К каталогу
        </Button>
      </div>
    )
  }

  const progress = progressQuery.data

  return (
    <div className="space-y-4">
      {isGuest ? <GuestBanner /> : null}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 pt-6">
        {progress ? (
          <Card className="flex-1" data-testid="task-progress">
            <CardContent className="flex flex-wrap items-center gap-4 p-4 text-sm text-muted-foreground">
              <span>
                Прогресс: <strong className="text-foreground">{labelProgressStatus(progress.progress_status)}</strong>
              </span>
              <span>Попыток: {progress.attempts_count}</span>
              <span>
                Успешных:{" "}
                <strong className="text-foreground">{progress.passed_count}</strong>
              </span>
              <span>
                Неудачных:{" "}
                <strong className={progress.failed_count ? "text-destructive" : "text-foreground"}>
                  {progress.failed_count ?? Math.max(progress.attempts_count - progress.passed_count, 0)}
                </strong>
              </span>
            </CardContent>
          </Card>
        ) : (
          <div />
        )}
        {isTeacher && taskId ? (
          <Button variant="outline" asChild>
            <Link to={`/teacher/tasks/${taskId}/curriculum`}>Учебный план</Link>
          </Button>
        ) : null}
      </div>
      <TaskWorkspace solver={solver} isGuest={isGuest} showSubmissionHistory={isAuthenticated} />
    </div>
  )
}
