import { useState, type ChangeEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCatalogTasks } from "@/features/catalog"
import TaskCatalog, { TASK_CATALOG_FILTER_ALL } from "@/features/catalog/ui/TaskCatalog"
import { api } from "@/shared/api/client"
import { queryKeys } from "@/shared/config/queryKeys"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
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
    <div className="space-y-6">
      <TaskCatalog
        tasks={data}
        isLoading={isLoading}
        error={error ? getApiErrorMessage(error) : null}
        taskLinkPrefix="/tasks"
        title="Библиотека задач"
        description="Готовые задачи платформы. Создавайте свои и добавляйте их в наборы заданий по ID."
        difficultyFilter={TASK_CATALOG_FILTER_ALL}
        taskTypeFilter={TASK_CATALOG_FILTER_ALL}
        topicFilter={TASK_CATALOG_FILTER_ALL}
      />

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Создать задачу по условию</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Название"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            className="flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Текстовое условие для студентов"
            value={description}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
          />
          <Input
            placeholder="Ожидаемый вывод программы"
            value={testOutput}
            onChange={(event) => setTestOutput(event.target.value)}
          />
          <Button
            disabled={!title.trim() || !description.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? "Создание…" : "Создать задачу"}
          </Button>
          {createMutation.error ? (
            <p className="text-sm text-destructive">{getApiErrorMessage(createMutation.error)}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
