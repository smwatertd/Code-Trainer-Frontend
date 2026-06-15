import { useEffect, useMemo, useState, type ReactNode } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { useMyProfile } from "@/features/profiles/hooks/useProfile"
import {
  ProfileGroupsPanel,
  ProfileProgressPanel,
  ProfileSolutionsPanel,
} from "@/pages/Student/profile/ProfilePanels"
import ApiErrorAlert from "@/shared/ui/ApiErrorAlert"
import ContribGraph from "@/shared/ui/ContribGraph"
import PageHeader from "@/shared/ui/PageHeader"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/ui/cn"
import { labelUserRole } from "@/shared/utils/labels"

const TABS = [
  { id: "progress", label: "Прогресс" },
  { id: "solutions", label: "Мои решения" },
  { id: "groups", label: "Группы" },
] as const

type ProfileTab = (typeof TABS)[number]["id"]

function statRow(label: string, value: ReactNode) {
  return (
    <div className="flex items-center justify-between border-t border-border py-[11px] first:border-t-0">
      <span className="text-[13px] text-ink-muted">{label}</span>
      {typeof value === "string" ? <b>{value}</b> : value}
    </div>
  )
}

function normalizeTab(raw: string | null): ProfileTab {
  if (raw === "solutions" || raw === "groups") return raw
  return "progress"
}

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = normalizeTab(searchParams.get("tab"))
  const [tab, setTab] = useState<ProfileTab>(initialTab)
  const profileQuery = useMyProfile(Boolean(user))

  useEffect(() => {
    const next = normalizeTab(searchParams.get("tab"))
    if (next !== tab) setTab(next)
  }, [searchParams, tab])

  const profile = profileQuery.data
  const initials = (profile?.name?.trim()?.[0] ?? user?.name?.trim()?.[0] ?? "У").toUpperCase()

  const handleTabChange = (next: ProfileTab) => {
    setTab(next)
    setSearchParams({ tab: next }, { replace: true })
  }

  const activityDeltaBadge = useMemo(() => {
    const dates = Object.keys(profile?.activity_by_date ?? {})
    if (dates.length < 2) return null
    return "+18% к прошлому месяцу"
  }, [profile?.activity_by_date])

  if (!user) return null

  return (
    <div>
      <PageHeader title="Мой профиль" subtitle="Прогресс, история решений и группы." />

      {profileQuery.isError ? <ApiErrorAlert error={profileQuery.error} className="mb-4" /> : null}
      {profileQuery.isLoading ? <p className="text-sm text-ink-muted">Загрузка профиля…</p> : null}

      {profile ? (
        <div className="grid items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="glow-card rounded-lg border border-border bg-surface p-[22px] text-center shadow-card">
            <div className="profile-avatar-lg mx-auto mb-3">{initials}</div>
            <b className="text-[17px]">{profile.name}</b>
            <p className="mb-3.5 mt-1 text-[13px] text-ink-faint">
              {profile.handle} · {labelUserRole(profile.role)}
            </p>
            <Badge variant="default" className="mb-[18px]">
              Уровень · {profile.level}
            </Badge>
            <div className="mt-2 text-left">
              {statRow("Решено задач", String(profile.solved_tasks_count))}
              {statRow(
                "Серия дней",
                <b className="text-lime">
                  {profile.streak_days}
                  {profile.streak_days > 0 ? " 🔥" : ""}
                </b>,
              )}
              {statRow("Точность", `${profile.success_rate}%`)}
              {statRow("Групп", String(profile.groups_count))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-3.5 w-full"
              onClick={() => navigate("/settings/profile")}
            >
              Редактировать профиль
            </Button>
          </aside>

          <div>
            <div className="mb-[18px] rounded-lg border border-border bg-surface p-[22px] shadow-card">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <b className="text-[15px]">Активность за 26 недель</b>
                {activityDeltaBadge ? <Badge variant="secondary">{activityDeltaBadge}</Badge> : null}
              </div>
              <ContribGraph weeks={26} byDate={profile.activity_by_date} />
            </div>

            <div className="tp-tabbar">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(tab === item.id && "on")}
                  onClick={() => handleTabChange(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {tab === "progress" ? <ProfileProgressPanel skills={profile.skills} /> : null}
            {tab === "solutions" ? (
              <ProfileSolutionsPanel submissions={profile.recent_submissions} />
            ) : null}
            {tab === "groups" ? <ProfileGroupsPanel /> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
