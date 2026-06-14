import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import {
  useCreateGroup,
  useCreateGroupInvitation,
  useTeacherGroups,
} from "@/features/groups/hooks/useGroups"
import ApiErrorAlert from "@/shared/ui/ApiErrorAlert"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import ShellPage from "@/shared/ui/ShellPage"
import { showError, showSuccess } from "@/shared/utils/toast"

export default function TeacherGroupsPage() {
  const groupsQuery = useTeacherGroups()
  const createMutation = useCreateGroup()
  const [name, setName] = useState("")
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [formError, setFormError] = useState<unknown>(null)

  const inviteMutation = useCreateGroupInvitation()

  const onCreate = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    try {
      await createMutation.mutateAsync(name)
      setName("")
      showSuccess("Группа создана")
    } catch (error) {
      setFormError(error)
      showError(error)
    }
  }

  const onInvite = async (groupId: number) => {
    setInviteCode(null)
    try {
      const result = await inviteMutation.mutateAsync(groupId)
      setInviteCode(result.code)
      showSuccess("Код приглашения создан")
    } catch (error) {
      showError(error)
    }
  }

  return (
    <ShellPage
      title="Группы"
      subtitle="Создайте группу и выдайте студентам код приглашения"
    >
      <div className="grid gap-[18px]">
      <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <b className="mb-4 block text-[15px]">Новая группа</b>
        <form className="flex flex-wrap gap-3" onSubmit={onCreate}>
          <div className="min-w-[220px] flex-1 space-y-2">
            <Label htmlFor="group-name">Название</Label>
            <Input
              id="group-name"
              data-testid="group-name-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="ИТ-301"
              className="h-[42px] border-[#333d4f] bg-bg-2"
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={createMutation.isPending} data-testid="group-create-btn">
              {createMutation.isPending ? "Создание…" : "Создать"}
            </Button>
          </div>
        </form>
        {formError ? <ApiErrorAlert error={formError} className="mt-4" /> : null}
      </div>

      {inviteCode ? (
        <Alert data-testid="invite-code-alert">
          <AlertDescription>
            Код приглашения: <strong className="font-mono">{inviteCode}</strong>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <b className="mb-4 block text-[15px]">Мои группы</b>
        <div className="space-y-3">
          {groupsQuery.isLoading ? (
            <p className="text-sm text-ink-muted">Загрузка…</p>
          ) : !groupsQuery.data?.length ? (
            <p className="text-sm text-ink-muted">Групп пока нет</p>
          ) : (
            groupsQuery.data.map((group) => (
              <div
                key={group.id}
                data-testid={`teacher-group-${group.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-2 p-3"
              >
                <div>
                  <p className="font-medium">{group.name}</p>
                  <p className="text-sm text-ink-muted">
                    Участников: {group.member_count ?? 0}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link
                      to={`/teacher/groups/${group.id}/dashboard`}
                      data-testid={`group-dashboard-btn-${group.id}`}
                    >
                      Дашборд
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`group-invite-btn-${group.id}`}
                    onClick={() => void onInvite(group.id)}
                    disabled={inviteMutation.isPending}
                  >
                    Код приглашения
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </ShellPage>
  )
}
