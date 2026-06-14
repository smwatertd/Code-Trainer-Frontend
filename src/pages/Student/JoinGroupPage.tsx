import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { useJoinedGroups, useJoinGroup } from "@/features/groups/hooks/useGroups"
import ApiErrorAlert from "@/shared/ui/ApiErrorAlert"
import ShellPage from "@/shared/ui/ShellPage"
import { Button } from "@/shared/ui/button"
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
    <ShellPage title="Мои группы" subtitle="Введите код приглашения от преподавателя">
      <div className="grid gap-[18px] lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="invite-code">Код приглашения</Label>
              <Input
                id="invite-code"
                data-testid="join-group-code-input"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="ABCD1234"
                className="h-[42px] border-[#333d4f] bg-bg-2 font-mono"
                required
              />
            </div>
            {error ? <ApiErrorAlert error={error} /> : null}
            <Button
              type="submit"
              disabled={joinMutation.isPending}
              data-testid="join-group-btn"
            >
              {joinMutation.isPending ? "Вступаем…" : "Вступить"}
            </Button>
          </form>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <b className="text-[15px]">Ваши группы</b>
          <div className="mt-3 space-y-2">
            {joinedQuery.isLoading ? (
              <p className="text-sm text-ink-muted">Загрузка…</p>
            ) : !joinedQuery.data?.length ? (
              <p className="text-sm text-ink-muted">Вы ещё не вступили ни в одну группу</p>
            ) : (
              joinedQuery.data.map((group) => (
                <div
                  key={group.id}
                  data-testid={`joined-group-${group.id}`}
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm font-medium"
                >
                  {group.name}
                </div>
              ))
            )}
          </div>
          <Button variant="link" className="mt-3 h-auto px-0 text-lime" asChild>
            <Link to="/assignment-sets">Мои наборы заданий →</Link>
          </Button>
        </div>
      </div>
    </ShellPage>
  )
}
