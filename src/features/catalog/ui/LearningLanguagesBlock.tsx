import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { useCatalogTasks } from "@/features/catalog"
import { useLanguageTrackProgress } from "@/features/progress/hooks/useLanguageTrackProgress"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/ui/cn"

const LEARNING_LANGUAGES = [
  { id: "python", label: "Python", route: "/learn/python", available: true },
  { id: "cpp", label: "C++", available: false },
  { id: "csharp", label: "C#", available: false },
  { id: "java", label: "Java", available: false },
  { id: "pascal", label: "Pascal", route: "/learn/pascal", available: true },
] as const

type LearningLanguageCardProps = {
  id: string
  label: string
  route?: string
  available: boolean
  totalTasks: number
}

export default function LearningLanguagesBlock() {
  const { data: catalogTasks = [], isLoading: catalogLoading } = useCatalogTasks()
  const loading = catalogLoading
  const fallbackTotal = catalogTasks.length || 0

  return (
    <section
      className="mb-6 rounded-lg border border-border bg-surface p-5 shadow-card"
      data-testid="learning-languages"
    >
      <h2 className="mb-3 text-base font-semibold text-ink">Языки обучения</h2>
      {loading ? (
        <p className="text-sm text-ink-muted">Загрузка…</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {LEARNING_LANGUAGES.map((language) => (
            <LanguageCard
              key={language.id}
              {...language}
              totalTasks={fallbackTotal}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function LanguageCard({
  id,
  label,
  route,
  available,
  totalTasks,
}: LearningLanguageCardProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { passedTasks, totalTasks: trackTotal, progressPercent, isLoading } =
    useLanguageTrackProgress(id, available && isAuthenticated)

  const resolvedTotal = trackTotal || totalTasks
  const resolvedPassed = passedTasks
  const percent = trackTotal ? progressPercent : 0

  return (
    <article
      className={cn(
        "space-y-2 rounded-lg border p-3",
        available ? "border-border bg-surface/80" : "border-border/60 bg-surface/40 opacity-60",
      )}
      data-testid={`learning-language-${id}`}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={!available || !route}
          onClick={() => route && navigate(route)}
          className={cn(
            "text-left font-medium text-ink",
            available && route && "hover:text-lime",
          )}
        >
          {label}
        </button>
        {available ? (
          <Badge variant="secondary" className="border-purple/30 bg-purple-soft text-[#cbb6ff]">
            Доступно
          </Badge>
        ) : (
          <Badge variant="muted">Скоро</Badge>
        )}
      </div>

      {available ? (
        <>
          <p
            className="text-sm text-ink-muted"
            data-testid={`learning-language-${id}-stats`}
          >
            {isLoading ? "…" : `${resolvedPassed}/${resolvedTotal} задач`}
          </p>
          <div className="tp-progress">
            <i style={{ width: `${percent}%` }} />
          </div>
          {route ? (
            <div className="flex flex-wrap gap-2 pt-1">
              <Button variant="ghost" size="sm" asChild>
                <Link to={route}>Открыть сборники</Link>
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-sm text-ink-muted">Темы появятся позже</p>
      )}
    </article>
  )
}
