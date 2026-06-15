import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { canAccessTeacherWorkspace } from "@/shared/types/user"
import PageHeader from "@/shared/ui/PageHeader"
import StatCard from "@/shared/ui/StatCard"
import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/ui/cn"
import { labelUserRole } from "@/shared/utils/labels"

const BASE_TABS = [
  { to: "/settings/profile", label: "Профиль" },
  { to: "/settings/security", label: "Безопасность" },
  { to: "/settings/learning", label: "Обучение" },
] as const

export default function SettingsLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isTeacher = canAccessTeacherWorkspace(user)
  const tabs = isTeacher
    ? [...BASE_TABS, { to: "/settings/teacher", label: "Преподаватель" }]
    : BASE_TABS

  const backTo = isTeacher ? "/teacher/cabinet" : "/"

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-3.5" onClick={() => navigate(backTo)}>
        ← Назад
      </Button>
      <PageHeader
        title="Настройки"
        subtitle="Управляйте профилем, безопасностью и предпочтениями обучения."
      />
      <div className="tp-tabbar">
        {tabs.map((tab) => (
          <button
            key={tab.to}
            type="button"
            className={cn(location.pathname === tab.to && (isTeacher ? "on-purple" : "on"))}
            onClick={() => navigate(tab.to)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <Outlet />
    </div>
  )
}

export function SettingsProfileTab() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)

  if (!user) return null

  return (
    <form
      className="max-w-[640px] rounded-lg border border-border bg-surface p-[22px] shadow-card"
      onSubmit={(event) => {
        event.preventDefault()
        setSaved(true)
        window.setTimeout(() => setSaved(false), 2000)
      }}
    >
      <b className="mb-3.5 block text-sm">Профиль</b>
      <div className="mb-4 space-y-2">
        <label className="block text-[13px] font-semibold text-ink-muted">Имя</label>
        <input
          className="h-[42px] w-full rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm"
          defaultValue={user.name}
        />
      </div>
      <div className="mb-4 space-y-2">
        <label className="block text-[13px] font-semibold text-ink-muted">Email</label>
        <input
          className="h-[42px] w-full rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm"
          type="email"
          defaultValue={user.email}
        />
      </div>
      <div className="mb-4 space-y-2">
        <label className="block text-[13px] font-semibold text-ink-muted">О себе</label>
        <textarea
          className="min-h-20 w-full rounded-md border border-[#333d4f] bg-bg-2 px-3 py-2.5 text-sm"
          defaultValue="Студент, учусь алгоритмам и структурам данных."
        />
      </div>
      <div className="mb-4 space-y-2">
        <label className="block text-[13px] font-semibold text-ink-muted">Роли (только для чтения)</label>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">{labelUserRole(user.role)}</Badge>
          {user.role !== "student" ? <Badge variant="default">Студент</Badge> : null}
        </div>
      </div>
      <div className="flex justify-end gap-2.5">
        <Button type="button" variant="ghost" size="sm">
          Отмена
        </Button>
        <Button type="submit" size="sm">
          {saved ? "Сохранено" : "Сохранить"}
        </Button>
      </div>
    </form>
  )
}

export function SettingsSecurityTab() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="grid max-w-[640px] gap-4">
      <form
        className="rounded-lg border border-border bg-surface p-[22px] shadow-card"
        onSubmit={(event) => event.preventDefault()}
      >
        <b className="mb-3.5 block text-sm">Смена пароля</b>
        <div className="mb-4 space-y-2">
          <label className="block text-[13px] font-semibold text-ink-muted">Текущий пароль</label>
          <input
            className="h-[42px] w-full rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm"
            type="password"
          />
        </div>
        <div className="mb-4 space-y-2">
          <label className="block text-[13px] font-semibold text-ink-muted">Новый пароль</label>
          <input
            className="h-[42px] w-full rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm"
            type="password"
          />
          <p className="text-xs text-ink-faint">Минимум 8 символов.</p>
        </div>
        <div className="mb-4 space-y-2">
          <label className="block text-[13px] font-semibold text-ink-muted">Подтверждение</label>
          <input
            className="h-[42px] w-full rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm"
            type="password"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm">
            Сменить пароль
          </Button>
        </div>
      </form>
      <div className="rounded-lg border border-border bg-surface p-[22px] shadow-card">
        <b className="mb-1.5 block text-sm">Сессии</b>
        <p className="mb-3.5 text-[13.5px] text-ink-muted">
          Завершайте сессии на устройствах, которыми больше не пользуетесь.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" size="sm">
            Завершить текущую
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              void logout()
              navigate("/login")
            }}
          >
            Выйти со всех устройств
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SettingsLearningTab() {
  const [difficulty, setDifficulty] = useState("medium")
  const options = [
    { id: "easy", label: "Лёгкая" },
    { id: "medium", label: "Средняя" },
    { id: "hard", label: "Сложная" },
  ]

  return (
    <form
      className="max-w-[640px] rounded-lg border border-border bg-surface p-[22px] shadow-card"
      onSubmit={(event) => event.preventDefault()}
    >
      <b className="mb-3.5 block text-sm">Обучение</b>
      <p className="mb-[18px] text-[13.5px] text-ink-muted">
        Уровень сложности задач, которые вам будут рекомендоваться по умолчанию.
      </p>
      <label className="mb-2 block text-[13px] font-semibold text-ink-muted">Стартовая сложность</label>
      <div className="mb-5 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={cn("tp-chip", difficulty === option.id && "on")}
            onClick={() => setDifficulty(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex justify-end gap-2.5">
        <Button type="button" variant="ghost" size="sm">
          Отмена
        </Button>
        <Button type="submit" size="sm">
          Сохранить
        </Button>
      </div>
    </form>
  )
}

export function SettingsTeacherTab() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    displayName: "Алексей Петров",
    bio: "Преподаватель кафедры алгоритмов. 8 лет опыта.",
    expertise: ["Алгоритмы", "DP", "Графы"] as string[],
  })
  const patterns = ["Алгоритмы", "DP", "Графы", "Строки", "Жадные", "Бинарный поиск"]

  const toggleExpertise = (value: string) => {
    setForm((current) => ({
      ...current,
      expertise: current.expertise.includes(value)
        ? current.expertise.filter((item) => item !== value)
        : [...current.expertise, value],
    }))
  }

  return (
    <div className="grid max-w-[720px] gap-4">
      <form
        className="rounded-lg border border-border bg-surface p-[22px] shadow-card"
        onSubmit={(event) => {
          event.preventDefault()
          setSaved(true)
          window.setTimeout(() => setSaved(false), 2000)
        }}
      >
        <b className="mb-3.5 block text-sm">Профиль преподавателя</b>
        <div className="mb-4 space-y-2">
          <label className="block text-[13px] font-semibold text-ink-muted">Отображаемое имя</label>
          <input
            className="h-[42px] w-full rounded-md border border-[#333d4f] bg-bg-2 px-3 text-sm"
            value={form.displayName}
            onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))}
          />
        </div>
        <div className="mb-4 space-y-2">
          <label className="block text-[13px] font-semibold text-ink-muted">Био / о себе</label>
          <textarea
            className="min-h-20 w-full rounded-md border border-[#333d4f] bg-bg-2 px-3 py-2.5 text-sm"
            value={form.bio}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
          />
        </div>
        <label className="mb-2 block text-[13px] font-semibold text-ink-muted">Экспертные темы</label>
        <div className="mb-2 flex flex-wrap gap-2">
          {patterns.map((pattern, index) => (
            <button
              key={pattern}
              type="button"
              className={cn(
                "tp-chip",
                form.expertise.includes(pattern) && (index % 2 === 1 ? "on-purple" : "on"),
              )}
              onClick={() => toggleExpertise(pattern)}
            >
              {pattern}
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm">
            {saved ? "Сохранено" : "Сохранить"}
          </Button>
        </div>
      </form>
      <div className="tp-cards3">
        <StatCard label="Моих задач" value={42} badge="+3 за неделю" badgeKind="lime" />
        <StatCard label="Моих каталогов" value={4} badge="2 группам" badgeKind="purple" />
        <StatCard label="Студентов" value={36} badge="+4" badgeKind="lime" />
      </div>
    </div>
  )
}
