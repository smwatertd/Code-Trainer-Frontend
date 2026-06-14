import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { useJoinedGroups, useJoinGroup } from "@/features/groups/hooks/useGroups"
import ApiErrorAlert from "@/shared/ui/ApiErrorAlert"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { showError, showSuccess } from "@/shared/utils/toast"

export default function JoinGroupPage() {
  const joinedQuery = useJoinedGroups()
  const joinMutation = useJoinGroup()
  const [code, setCode] = useState("")
  const [error, setError] = useState<unknown>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    try {
      await joinMutation.mutateAsync(code.trim())
      setCode("")
      showSuccess("Вы вступили в группу")
    } catch (err) {
      setError(err)
      showError(err)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Вступить в группу</h1>
        <p className="text-sm text-muted-foreground">Введите код от преподавателя</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="invite-code">Код приглашения</Label>
              <Input
                id="invite-code"
                data-testid="join-group-code-input"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="ABCD1234"
                required
              />
            </div>
            {error ? <ApiErrorAlert error={error} /> : null}
            <Button type="submit" disabled={joinMutation.isPending} data-testid="join-group-btn">
              {joinMutation.isPending ? "Вступаем…" : "Вступить"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Мои группы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {joinedQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Загрузка…</p>
          ) : !joinedQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">Вы ещё не вступили ни в одну группу</p>
          ) : (
            joinedQuery.data.map((group) => (
              <div
                key={group.id}
                data-testid={`joined-group-${group.id}`}
                className="rounded-lg border p-3 text-sm"
              >
                {group.name}
              </div>
            ))
          )}
          <Button variant="link" className="px-0" asChild>
            <Link to="/assignment-sets">Мои наборы заданий →</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
