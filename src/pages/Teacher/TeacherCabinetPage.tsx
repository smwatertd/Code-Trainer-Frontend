import { Link, useLocation } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useCatalogTasks } from "@/features/catalog"
import TaskCatalog, { TASK_CATALOG_FILTER_ALL } from "@/features/catalog/ui/TaskCatalog"
import { api } from "@/shared/api/client"
import { queryKeys } from "@/shared/config/queryKeys"
import ShellPage from "@/shared/ui/ShellPage"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { cn } from "@/shared/ui/cn"
import { getApiErrorMessage } from "@/shared/utils/apiErrors"

const TABS = [
  { id: "tasks", label: "Мои задачи", to: "/teacher/cabinet" },
  { id: "groups", label: "Мои группы", to: "/teacher/groups" },
  { id: "sets", label: "Наборы", to: "/teacher/assignment-sets" },
  { id: "library", label: "Библиотека", to: "/teacher/tasks/library" },
] as const

export default function TeacherCabinetPage() {
  const location = useLocation()
  const queryClient = useQueryClient()
  const { data = [], isLoading, error } = useCatalogTasks()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [testOutput, setTestOutput] = useState("Hello")

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: created } = await api.post("/teacher/tasks", {
        title,
        description,
        difficulty: "easy",
        task_type: "task_write_from_description",
        payload: {
          target_language: "python",
          test_cases: [{ inputs: "", output: testOutput }],
          topics: ["custom"],
        },
      })
      return created
    },
    onSuccess: async () => {
      setTitle("")
      setDescription("")
      await queryClient.invalidateQueries({ queryKey: queryKeys.catalogTasks() })
    },
  })

  return (
    <ShellPage
      title="Кабинет преподавателя"
      subtitle="Задачи, решения студентов, аналитика, каталоги и управление группами"
    >
      <div className="tp-tabbar mb-6">
        {TABS.map((tab) => {
          const active = location.pathname === tab.to || (tab.id === "tasks" && location.pathname === "/teacher/cabinet")
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={cn(active && "on", "no-underline")}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <Input
          className="h-[42px] max-w-md flex-1"
          placeholder="Поиск среди ваших задач…"
          disabled
        />
        <Button size="sm" disabled>
          + Создать задачу
        </Button>
      </div>

      <TaskCatalog
        tasks={data}
        isLoading={isLoading}
        error={error ? getApiErrorMessage(error) : null}
        taskLinkPrefix="/tasks"
        difficultyFilter={TASK_CATALOG_FILTER_ALL}
        taskTypeFilter={TASK_CATALOG_FILTER_ALL}
        topicFilter={TASK_CATALOG_FILTER_ALL}
      />

      <div className="mt-[18px] rounded-lg border border-border bg-surface p-5 shadow-card">
        <b className="mb-4 block text-[15px]">Создать задачу по условию</b>
        <div className="space-y-3">
          <Input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="Ожидаемый вывод теста"
            value={testOutput}
            onChange={(e) => setTestOutput(e.target.value)}
          />
          <Button
            disabled={!title.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? "Создание…" : "Создать"}
          </Button>
        </div>
      </div>
    </ShellPage>
  )
}
