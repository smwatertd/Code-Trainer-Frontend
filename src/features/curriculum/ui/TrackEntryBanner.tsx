import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguageTrack } from "@/features/curriculum/hooks/useLanguageTrack"
import { TRACK_LANGUAGE_OPTIONS, isTrackLanguageAvailable } from "@/features/curriculum/ui/LangMini"
import { useAuth } from "@/features/auth"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/ui/cn"
import { labelLanguage } from "@/shared/utils/labels"

export default function TrackEntryBanner() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [languageId, setLanguageId] = useState("python")
  const activeTrack =
    TRACK_LANGUAGE_OPTIONS.find((option) => option.id === languageId) ??
    TRACK_LANGUAGE_OPTIONS[0]

  const { data: track, isLoading } = useLanguageTrack(
    languageId,
    isTrackLanguageAvailable(languageId),
  )

  const progress = track?.progress
  const percent =
    progress && progress.total_tasks
      ? Math.round((progress.passed_tasks / progress.total_tasks) * 100)
      : 0
  const nextChapter =
    track?.collections.find((chapter) => !chapter.completed && chapter.next_task) ?? null

  const continueLabel = nextChapter
    ? nextChapter.next_task
      ? `${nextChapter.order}. ${nextChapter.title_ru} · ${nextChapter.next_task.title}`
      : `${nextChapter.order}. ${nextChapter.title_ru}`
    : "Выберите сборник в учебном треке"

  const handleContinue = () => {
    if (nextChapter?.next_task) {
      navigate(`/tasks/${nextChapter.next_task.task_id}`, {
        state: { returnTo: nextChapter.route_path },
      })
      return
    }
    navigate(activeTrack.route)
  }

  if (!isTrackLanguageAvailable(languageId)) {
    return null
  }

  return (
    <button
      type="button"
      className="track-entry mb-[18px] w-full text-left"
      onClick={handleContinue}
      data-testid="track-entry"
    >
      <div className="te-glyph">{activeTrack.glyph}</div>

      <div className="min-w-0 flex-[1_1_auto]">
        <div className="mb-0.5 flex flex-wrap items-center gap-2">
          <b className="text-[15px] text-ink">Учебный трек</b>
          <Badge variant="secondary" className="border-purple/30 bg-purple-soft text-[#b89bff]">
            {labelLanguage(languageId)}
          </Badge>
          {isAuthenticated && !isLoading && progress ? (
            <span className="font-mono text-xs text-ink-faint">
              {progress.passed_tasks}/{progress.total_tasks} · {percent}%
            </span>
          ) : null}
        </div>

        <div className="te-langs mb-1.5">
          {TRACK_LANGUAGE_OPTIONS.map((option) => {
            const available = isTrackLanguageAvailable(option.id)
            return (
            <span
              key={option.id}
              role="button"
              tabIndex={0}
              className={cn(
                "te-lang",
                option.id === languageId && "on",
                !available && "soon",
              )}
              onClick={(event) => {
                event.stopPropagation()
                if (!available) return
                setLanguageId(option.id)
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return
                event.preventDefault()
                event.stopPropagation()
                if (!available) return
                setLanguageId(option.id)
              }}
            >
              {option.glyph}
            </span>
          )})}
        </div>

        <div className="flex min-w-0 items-center gap-1.5 text-[13px] text-ink-faint">
          <span className="text-ink-muted">Продолжаете:</span>
          <span className="truncate font-medium text-ink">
            {isLoading ? "Загрузка…" : continueLabel}
          </span>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        className="pointer-events-none shrink-0"
        tabIndex={-1}
        aria-hidden
      >
        ▸ Продолжить обучение
      </Button>
    </button>
  )
}
