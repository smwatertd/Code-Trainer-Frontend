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
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
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
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Группы</h1>
        <p className="text-sm text-muted-foreground">Создайте группу и выдайте студентам код приглашения</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Новая группа</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap gap-3" onSubmit={onCreate}>
            <div className="min-w-[220px] flex-1 space-y-2">
              <Label htmlFor="group-name">Название</Label>
              <Input
                id="group-name"
                data-testid="group-name-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="ИТ-301"
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
        </CardContent>
      </Card>

      {inviteCode ? (
        <Alert data-testid="invite-code-alert">
          <AlertDescription>
            Код приглашения: <strong className="font-mono">{inviteCode}</strong>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Мои группы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {groupsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Загрузка…</p>
          ) : !groupsQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">Групп пока нет</p>
          ) : (
            groupsQuery.data.map((group) => (
              <div
                key={group.id}
                data-testid={`teacher-group-${group.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{group.name}</p>
                  <p className="text-sm text-muted-foreground">
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
        </CardContent>
      </Card>
    </div>
  )
}
