import { useState, type ChangeEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCatalogTasks } from "@/features/catalog"
import TaskCatalog, { TASK_CATALOG_FILTER_ALL } from "@/features/catalog/ui/TaskCatalog"
import { api } from "@/shared/api/client"
import { queryKeys } from "@/shared/config/queryKeys"
import ShellPage from "@/shared/ui/ShellPage"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { getApiErrorMessage } from "@/shared/utils/apiErrors"

export default function TeacherTaskLibraryPage() {
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
      title="Библиотека задач"
      subtitle="Готовые задачи платформы и создание своих заданий"
    >
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
          <Input
            placeholder="Название"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-[42px] border-[#333d4f] bg-bg-2"
          />
          <textarea
            className="flex min-h-[96px] w-full rounded-md border border-[#333d4f] bg-bg-2 px-3 py-2 font-mono text-sm text-ink outline-none focus:border-lime focus:ring-[3px] focus:ring-lime-soft"
            placeholder="Текстовое условие для студентов"
            value={description}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
          />
          <Input
            placeholder="Ожидаемый вывод программы"
            value={testOutput}
            onChange={(event) => setTestOutput(event.target.value)}
            className="h-[42px] border-[#333d4f] bg-bg-2"
          />
          <Button
            disabled={!title.trim() || !description.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? "Создание…" : "Создать задачу"}
          </Button>
          {createMutation.error ? (
            <p className="text-sm text-[#ff8198]">{getApiErrorMessage(createMutation.error)}</p>
          ) : null}
        </div>
      </div>
    </ShellPage>
  )
}
