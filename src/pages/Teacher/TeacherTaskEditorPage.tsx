import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createTeacherTask,
  getTeacherTask,
  updateTeacherTask,
} from "@/shared/api/teacherTaskClient"
import { queryKeys } from "@/shared/config/queryKeys"
import ShellPage from "@/shared/ui/ShellPage"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { getApiErrorMessage } from "@/shared/utils/apiErrors"

const DIFFICULTIES = [
  { value: "easy", label: "Лёгкая" },
  { value: "medium", label: "Средняя" },
  { value: "hard", label: "Сложная" },
]

export default function TeacherTaskEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = Boolean(id)
  const taskId = isEdit ? Number(id) : null

  const taskQuery = useQuery({
    queryKey: queryKeys.teacherTask(taskId ?? 0),
    queryFn: () => getTeacherTask(taskId!),
    enabled: isEdit && Number.isFinite(taskId),
  })

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState("easy")
  const [testOutput, setTestOutput] = useState("Hello")

  useEffect(() => {
    if (!taskQuery.data) return
    const task = taskQuery.data
    const testCases = Array.isArray(task.payload?.test_cases)
      ? (task.payload.test_cases as Array<{ output?: string }>)
      : []
    setTitle(task.title)
    setDescription(task.description)
    setDifficulty(task.difficulty || "easy")
    setTestOutput(String(testCases[0]?.output ?? ""))
  }, [taskQuery.data])

  const payload = useMemo(
    () => ({
      target_language: "python",
      problem_statement: description,
      template: "print('')",
      test_cases: [{ inputs: "", output: testOutput }],
      topics: ["custom"],
    }),
    [description, testOutput],
  )

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        task_type: "task_write_from_description",
        payload,
      }
      if (isEdit && taskId) {
        return updateTeacherTask(taskId, body)
      }
      return createTeacherTask(body)
    },
    onSuccess: async (task) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.teacherTasks() })
      navigate("/teacher/cabinet", { replace: true })
      void task
    },
  })

  const pageTitle = isEdit ? "Редактировать задачу" : "Создать задачу"

  return (
    <ShellPage
      title={pageTitle}
      subtitle="Задание по условию: студент пишет программу, проверка по тесту"
      right={
        <Button variant="ghost" size="sm" asChild>
          <Link to="/teacher/cabinet">← К кабинету</Link>
        </Button>
      }
    >
      {taskQuery.isLoading ? (
        <p className="text-sm text-ink-muted">Загрузка задачи…</p>
      ) : taskQuery.error ? (
        <p className="text-sm text-danger">{getApiErrorMessage(taskQuery.error)}</p>
      ) : (
        <form
          className="max-w-xl space-y-4 rounded-lg border border-border bg-surface p-5 shadow-card"
          onSubmit={(event) => {
            event.preventDefault()
            if (!title.trim() || !description.trim()) return
            saveMutation.mutate()
          }}
        >
          <div>
            <label htmlFor="teacher-task-title" className="mb-1.5 block text-[13px] font-medium text-ink-muted">
              Название
            </label>
            <Input id="teacher-task-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label htmlFor="teacher-task-description" className="mb-1.5 block text-[13px] font-medium text-ink-muted">
              Условие
            </label>
            <textarea
              id="teacher-task-description"
              className="flex min-h-[120px] w-full rounded-md border border-border bg-bg-2 px-3 py-2 text-sm text-ink outline-none focus:border-lime focus:ring-2 focus:ring-lime/20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-ink-muted">Сложность</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="h-[42px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="teacher-task-output" className="mb-1.5 block text-[13px] font-medium text-ink-muted">
              Ожидаемый вывод (тест)
            </label>
            <Input id="teacher-task-output" value={testOutput} onChange={(e) => setTestOutput(e.target.value)} required />
          </div>

          {saveMutation.error ? (
            <p className="text-sm text-danger">{getApiErrorMessage(saveMutation.error)}</p>
          ) : null}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saveMutation.isPending || !title.trim() || !description.trim()}>
              {saveMutation.isPending ? "Сохранение…" : isEdit ? "Сохранить" : "Создать"}
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link to="/teacher/cabinet">Отмена</Link>
            </Button>
          </div>
        </form>
      )}
    </ShellPage>
  )
}
