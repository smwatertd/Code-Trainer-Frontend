import { Link } from "react-router-dom"
import { useMemo, useState } from "react"
import { useTeacherTasks } from "@/features/teacher/hooks/useTeacherTasks"
import TeacherTasksTable from "@/features/teacher/ui/TeacherTasksTable"
import TeacherWorkspaceTabs from "@/features/teacher/ui/TeacherWorkspaceTabs"
import ShellPage from "@/shared/ui/ShellPage"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { getApiErrorMessage } from "@/shared/utils/apiErrors"

export default function TeacherCabinetPage() {
  const { data = [], isLoading, error } = useTeacherTasks()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return data
    return data.filter(
      (task) =>
        task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q),
    )
  }, [data, search])

  return (
    <ShellPage
      title="Кабинет преподавателя"
      subtitle="Задачи, решения студентов, аналитика, каталоги и управление группами"
    >
      <TeacherWorkspaceTabs />

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <Input
          className="h-[42px] max-w-md flex-1"
          placeholder="Поиск среди ваших задач…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button size="sm" asChild data-testid="teacher-create-task">
          <Link to="/teacher/tasks/new">+ Создать задачу</Link>
        </Button>
      </div>

      <TeacherTasksTable
        tasks={filtered}
        isLoading={isLoading}
        error={error ? getApiErrorMessage(error) : null}
      />
    </ShellPage>
  )
}
