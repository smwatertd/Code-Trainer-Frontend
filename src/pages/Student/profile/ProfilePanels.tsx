import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import CatalogStatusBadge from "@/features/catalog/ui/CatalogStatusBadge"
import { useJoinedGroups, useJoinGroup } from "@/features/groups/hooks/useGroups"
import type { RecentSubmission, SkillProgress } from "@/shared/types/profile"
import EmptyState from "@/shared/ui/EmptyState"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/ui/cn"
import {
  filterProfileSubmissions,
  mapSubmissionStatus,
} from "@/shared/utils/submissionStatus"

const RECOMMENDATIONS = [
  { kind: "purple" as const, symbol: "→", text: "Подтяните ", bold: "динамическое программирование" },
  { kind: "purple" as const, symbol: "→", text: "5 задач по графам ждут решения" },
  { kind: "lime" as const, symbol: "✓", text: "Бинарный поиск освоен — отлично!" },
  { kind: "purple" as const, symbol: "→", text: "Продолжайте серию дней!" },
]

function submissionStatus(status: string): "solved" | "attempted" | "todo" {
  return mapSubmissionStatus(status)
}

function RecRow({
  kind,
  symbol,
  text,
  bold,
}: {
  kind: "purple" | "lime"
  symbol: string
  text: string
  bold?: string
}) {
  return (
    <div className="flex items-center gap-2.5 text-[13.5px]">
      <span
        className={cn(
          "inline-flex h-[26px] w-[26px] items-center justify-center rounded-lg text-xs font-semibold",
          kind === "lime"
            ? "border border-lime/30 bg-lime-soft text-lime"
            : "border border-purple/30 bg-purple-soft text-[#cbb6ff]",
        )}
      >
        {symbol}
      </span>
      <span>
        {text}
        {bold ? <b>{bold}</b> : null}
      </span>
    </div>
  )
}

export function ProfileProgressPanel({ skills }: { skills: SkillProgress[] }) {
  const displaySkills =
    skills.length > 0
      ? skills
      : [
          { id: "algorithms", label: "Алгоритмы", percent: 0, solved: 0, total: 0 },
          { id: "strings", label: "Строки", percent: 0, solved: 0, total: 0 },
        ]

  return (
    <div className="tp-cards2">
      <div className="rounded-lg border border-border bg-surface p-[22px] shadow-card">
        <b className="text-sm">Навыки</b>
        <div className="mt-3.5 space-y-4">
          {displaySkills.map((skill, index) => (
            <div key={skill.id}>
              <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                <span className="text-ink-muted">
                  {skill.label}
                  <span className="ml-2 text-[11px] text-ink-faint">
                    {skill.solved} / {skill.total}
                  </span>
                </span>
                <span
                  className={cn(
                    "font-mono font-semibold",
                    index % 2 === 1 ? "text-[#b89bff]" : "text-lime",
                  )}
                >
                  {skill.percent}%
                </span>
              </div>
              <div className={cn("tp-progress", index % 2 === 1 && "pp")}>
                <i style={{ width: `${skill.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface p-[22px] shadow-card">
        <b className="text-sm">Рекомендации</b>
        <div className="mt-3.5 grid gap-2.5">
          {RECOMMENDATIONS.map((item, index) => (
            <RecRow key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

type ProfileSolutionsPanelProps = {
  submissions: RecentSubmission[]
}

export function ProfileSolutionsPanel({ submissions }: ProfileSolutionsPanelProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = useMemo(
    () =>
      filterProfileSubmissions(
        submissions,
        search,
        statusFilter === "all" ? "all" : statusFilter,
      ),
    [submissions, search, statusFilter],
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
        <input
          className="h-[38px] w-full max-w-[280px] rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm"
          placeholder="Поиск по решениям…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="h-[38px] rounded-md border border-[#333d4f] bg-bg-2 px-3 text-[13px]"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">Все статусы</option>
          <option value="solved">Решено</option>
          <option value="attempted">Ошибка тестов</option>
        </select>
      </div>
      <div className="rounded-lg border border-border bg-surface p-[22px] shadow-card">
        {filtered.length === 0 ? (
          <EmptyState
            title="Нет решений"
            description="Решите свою первую задачу — попытки появятся здесь."
            action={
              <Button type="button" size="sm" onClick={() => navigate("/")}>
                К списку задач
              </Button>
            }
          />
        ) : (
          <table className="catalog-table w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-ink-muted">
                <th className="pb-2 pr-3 font-semibold">Задача</th>
                <th className="pb-2 pr-3 font-semibold">Язык</th>
                <th className="pb-2 pr-3 font-semibold">Статус</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/60 last:border-0"
                  onClick={() => navigate(`/tasks/${row.id}`)}
                >
                  <td className="t-name py-2.5 pr-3">{row.task_title}</td>
                  <td className="py-2.5 pr-3 text-ink-muted">{row.language}</td>
                  <td className="py-2.5 pr-3">
                    <CatalogStatusBadge status={submissionStatus(row.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export function ProfileGroupsPanel() {
  const navigate = useNavigate()
  const groupsQuery = useJoinedGroups()
  const joinMutation = useJoinGroup()
  const [code, setCode] = useState("")

  const groups = groupsQuery.data ?? []

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
        <b className="text-[15px]">Мои группы</b>
        <div className="flex flex-wrap gap-2">
          <input
            className="h-[38px] w-[160px] rounded-md border border-[#333d4f] bg-bg-2 px-3 font-mono text-sm uppercase"
            placeholder="GRP-XXXX"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
          />
          <Button
            type="button"
            size="sm"
            disabled={joinMutation.isPending || !code.trim()}
            onClick={() => {
              void joinMutation.mutateAsync(code.trim()).then(() => setCode(""))
            }}
          >
            Вступить по коду
          </Button>
        </div>
      </div>
      {groupsQuery.isLoading ? (
        <p className="text-sm text-ink-muted">Загрузка…</p>
      ) : groups.length === 0 ? (
        <EmptyState
          title="Вы не состоите в группах"
          description="Получите код приглашения от преподавателя или перейдите на страницу вступления."
          action={
            <Button type="button" size="sm" asChild>
              <Link to="/groups/join">Вступить в группу</Link>
            </Button>
          }
        />
      ) : (
        <div className="tp-cards2">
          {groups.map((group, index) => (
            <button
              key={group.id}
              type="button"
              className={cn(
                "course-card w-full text-left",
                index % 2 === 1 && "pp",
              )}
              onClick={() => navigate("/assignment-sets")}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <b className="text-[15px]">{group.name}</b>
                <Badge variant={index % 2 === 1 ? "secondary" : "default"}>Активна</Badge>
              </div>
              <p className="mb-3.5 text-[13px] text-ink-muted">
                Преподаватель:{" "}
                <Link to={`/users/${group.teacher_id}`} className="font-semibold text-lime hover:underline">
                  #{group.teacher_id}
                </Link>
              </p>
              <div className={cn("tp-progress", index % 2 === 1 && "pp")}>
                <i style={{ width: `${Math.min(40 + index * 15, 90)}%` }} />
              </div>
              <p className="mt-2 text-xs text-ink-faint">Открыть сборники группы →</p>
            </button>
          ))}
        </div>
      )}
      <div className="tp-note mt-[18px]">
        <b>Хотите стать преподавателем?</b> Подайте заявку — администратор рассмотрит её в течение
        1–2 дней.
      </div>
    </div>
  )
}
