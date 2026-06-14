import { useState, type FormEvent } from "react"
import {
  useAddAssignmentSetItem,
  useCreateAssignmentSet,
  useTeacherAssignmentSets,
} from "@/features/assignment-sets/hooks/useAssignmentSets"
import { useTeacherGroups } from "@/features/groups/hooks/useGroups"
import ApiErrorAlert from "@/shared/ui/ApiErrorAlert"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import ShellPage from "@/shared/ui/ShellPage"
import SimpleSelect from "@/shared/ui/SimpleSelect"
import { showError, showSuccess } from "@/shared/utils/toast"

const PUBLIC_SET_VALUE = "__public__"

export default function TeacherAssignmentSetsPage() {
  const setsQuery = useTeacherAssignmentSets()
  const groupsQuery = useTeacherGroups()
  const createMutation = useCreateAssignmentSet()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [groupId, setGroupId] = useState<string>("")
  const [taskInputs, setTaskInputs] = useState<Record<number, string>>({})
  const [formError, setFormError] = useState<unknown>(null)

  const groupOptions = [
    { value: PUBLIC_SET_VALUE, label: "Публичный набор" },
    ...(groupsQuery.data ?? []).map((group) => ({
      value: String(group.id),
      label: group.name,
    })),
  ]

  const onCreate = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    try {
      await createMutation.mutateAsync({
        name,
        description,
        visibility: groupId ? "private" : "public",
        group_id: groupId ? Number(groupId) : null,
      })
      setName("")
      setDescription("")
      showSuccess("Набор создан")
    } catch (error) {
      setFormError(error)
      showError(error)
    }
  }

  return (
    <ShellPage title="Наборы заданий" subtitle="Соберите подборку задач для группы">
      <div className="grid gap-[18px]">
      <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <b className="mb-4 block text-[15px]">Создать набор</b>
        <form className="space-y-4" onSubmit={onCreate}>
            <div className="space-y-2">
              <Label htmlFor="set-name">Название</Label>
              <Input
                id="set-name"
                data-testid="assignment-set-name-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-description">Описание</Label>
              <Input
                id="set-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-group">Группа (опционально)</Label>
              <SimpleSelect
                id="set-group"
                triggerTestId="assignment-set-group-select"
                value={groupId || PUBLIC_SET_VALUE}
                onValueChange={(value) => setGroupId(value === PUBLIC_SET_VALUE ? "" : value)}
                options={groupOptions}
                placeholder="Публичный набор"
              />
            </div>
            {formError ? <ApiErrorAlert error={formError} /> : null}
            <Button type="submit" disabled={createMutation.isPending} data-testid="assignment-set-create-btn">
              {createMutation.isPending ? "Создание…" : "Создать набор"}
            </Button>
          </form>
          {formError ? <ApiErrorAlert error={formError} className="mt-4" /> : null}
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <b className="mb-4 block text-[15px]">Мои наборы</b>
        <div className="space-y-4">
          {setsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Загрузка…</p>
          ) : !setsQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">Наборов пока нет</p>
          ) : (
            setsQuery.data.map((set) => (
              <AssignmentSetCard
                key={set.id}
                set={set}
                taskInput={taskInputs[set.id] ?? ""}
                onTaskInputChange={(value) =>
                  setTaskInputs((prev) => ({ ...prev, [set.id]: value }))
                }
              />
            ))
          )}
        </div>
      </div>
      </div>
    </ShellPage>
  )
}

function AssignmentSetCard({
  set,
  taskInput,
  onTaskInputChange,
}: {
  set: {
    id: number
    name: string
    description: string
    visibility: string
    group_id: number | null
    items: Array<{ task_id: number; sort_order: number }>
  }
  taskInput: string
  onTaskInputChange: (value: string) => void
}) {
  const addItemMutation = useAddAssignmentSetItem(set.id)

  const onAddTask = async () => {
    const taskId = Number(taskInput)
    if (!taskId) return
    try {
      await addItemMutation.mutateAsync(taskId)
      onTaskInputChange("")
      showSuccess(`Задача ${taskId} добавлена`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <div data-testid={`teacher-assignment-set-${set.id}`} className="space-y-3 rounded-xl border border-border bg-surface-2 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-medium">{set.name}</h2>
        <Badge variant="outline">{set.visibility}</Badge>
        {set.group_id ? <Badge variant="secondary">группа #{set.group_id}</Badge> : null}
      </div>
      {set.description ? <p className="text-sm text-muted-foreground">{set.description}</p> : null}
      <ul className="text-sm text-muted-foreground">
        {set.items.length ? (
          set.items.map((item) => <li key={item.task_id}>Задача {item.task_id}</li>)
        ) : (
          <li>Задач пока нет</li>
        )}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Input
          className="w-32"
          placeholder="ID задачи"
          value={taskInput}
          onChange={(event) => onTaskInputChange(event.target.value)}
          data-testid={`assignment-set-add-task-${set.id}`}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => void onAddTask()}
          disabled={addItemMutation.isPending}
          data-testid={`assignment-set-add-btn-${set.id}`}
        >
          Добавить задачу
        </Button>
      </div>
    </div>
  )
}
