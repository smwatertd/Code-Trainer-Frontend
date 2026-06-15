import { Link } from "react-router-dom"
import type { LanguageTrack } from "@/features/curriculum/types"
import { trackDescription, trackChapterHint } from "@/features/curriculum/lib/trackMeta"
import type { TrackLanguageOption } from "@/features/curriculum/ui/LangMini"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/ui/cn"

type TrackLanguageCardProps = {
  option: TrackLanguageOption
  track?: LanguageTrack
  isLoading?: boolean
  error?: boolean
}

export default function TrackLanguageCard({
  option,
  track,
  isLoading = false,
  error = false,
}: TrackLanguageCardProps) {
  const progress = track?.progress
  const total = progress?.total_tasks ?? 0
  const passed = progress?.passed_tasks ?? 0
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0
  const complete = total > 0 && passed >= total
  const chapterCount = track?.collections.length ?? 0
  const nextChapter = track?.collections.find((chapter) => !chapter.completed && chapter.next_task)

  return (
    <article
      className={cn(
        "track-lang-card flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition",
        "hover:border-lime/35 hover:shadow-[0_18px_44px_-28px_rgba(142,255,1,0.45)]",
        complete && "border-lime/25",
      )}
      data-testid={`track-card-${option.id}`}
    >
      <div className="mb-4 flex items-start gap-3.5">
        <div className="track-glyph text-base">{option.glyph}</div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-ink">{option.label}</h2>
            {complete ? <Badge variant="default">Пройден</Badge> : null}
          </div>
          <p className="text-sm leading-relaxed text-ink-muted">{trackDescription(option.id)}</p>
          {trackChapterHint(option.id) ? (
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-faint">
              {trackChapterHint(option.id)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mb-4 mt-auto">
        {isLoading ? (
          <p className="text-sm text-ink-muted">Загрузка прогресса…</p>
        ) : error || !track || total === 0 ? (
          <p className="text-sm text-ink-muted">
            {error ? "Не удалось загрузить трек" : "Задачи скоро появятся"}
          </p>
        ) : (
          <>
            <div className="mb-1.5 flex items-end justify-between gap-2">
              <span className="font-mono text-xs text-ink-faint" data-testid={`track-card-progress-${option.id}`}>
                {passed}/{total} задач · {chapterCount} {chapterCount === 1 ? "глава" : chapterCount < 5 ? "главы" : "глав"}
              </span>
              <span className="text-sm font-bold text-lime">{percent}%</span>
            </div>
            <div className="tp-progress">
              <i style={{ width: `${percent}%` }} />
            </div>
            {nextChapter ? (
              <p className="mt-2 text-xs text-ink-faint">
                Продолжить: {nextChapter.order}. {nextChapter.title_ru}
              </p>
            ) : null}
          </>
        )}
      </div>

      <Button asChild size="sm" variant="secondary">
        <Link to={option.route}>Подробнее</Link>
      </Button>
    </article>
  )
}
