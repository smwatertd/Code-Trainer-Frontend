import { Link, useParams } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { useLanguageTrack } from "@/features/curriculum"
import { trackDescription } from "@/features/curriculum/lib/trackMeta"
import ChapterCard from "@/features/curriculum/ui/ChapterCard"
import LangMini, { TRACK_LANGUAGE_OPTIONS } from "@/features/curriculum/ui/LangMini"
import { labelLanguage } from "@/shared/utils/labels"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"

export default function LearnTrackPage() {
  const { language = "python" } = useParams()
  const label = labelLanguage(language)
  const trackOption = TRACK_LANGUAGE_OPTIONS.find((option) => option.id === language)
  const { isAuthenticated } = useAuth()
  const { data: track, isLoading, error, refetch } = useLanguageTrack(language)

  const agg = track?.progress
  const aggPercent = agg && agg.total_tasks ? Math.round((agg.passed_tasks / agg.total_tasks) * 100) : 0
  const nextChapter =
    track?.collections.find((chapter) => !chapter.completed && chapter.next_task) ?? null
  const complete = Boolean(agg && agg.total_tasks > 0 && agg.passed_tasks >= agg.total_tasks)
  const description = trackDescription(language)

  return (
    <div className="mx-auto max-w-[920px] py-6">
      <Link to="/learn" className="mb-4 inline-flex text-sm font-medium text-ink-muted hover:text-lime">
        ← Все учебные треки
      </Link>
      {isLoading ? (
        <p className="text-sm text-ink-muted">Загрузка трека…</p>
      ) : error || !track ? (
        <div className="rounded-lg border border-border bg-surface p-6 text-center">
          <p className="mb-4 text-sm text-ink-muted">Не удалось загрузить учебный трек.</p>
          <Button size="sm" onClick={() => void refetch()}>
            Повторить
          </Button>
        </div>
      ) : (
        <>
          <div className="track-hero mb-6">
            <div className="flex flex-wrap items-start gap-[18px]">
              <div className="track-glyph">{trackOption?.glyph ?? label.slice(0, 3)}</div>
              <div className="min-w-0 flex-[1_1_280px]">
                <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                  <Badge variant="secondary">Учебный трек</Badge>
                  {complete ? <Badge variant="default">✓ Трек пройден</Badge> : null}
                  <LangMini language={language} />
                </div>
                <h1 className="mb-1.5 text-[30px] font-extrabold tracking-[-0.8px]">{label}</h1>
                <p className="max-w-[440px] text-[14.5px] text-ink-muted">{description}</p>
              </div>
              <div className="min-w-[140px] text-right">
                <div className="text-[34px] font-extrabold tracking-[-0.5px] text-lime">{aggPercent}%</div>
                <div
                  className="mb-2.5 font-mono text-[12.5px] text-ink-faint"
                  data-testid="track-progress"
                >
                  {agg?.passed_tasks ?? 0}/{agg?.total_tasks ?? 0} задач
                </div>
                <div className="tp-progress">
                  <i style={{ width: `${aggPercent}%` }} />
                </div>
              </div>
            </div>

            {nextChapter?.next_task ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                <div>
                  <div className="mb-0.5 text-xs uppercase tracking-wider text-ink-faint">
                    Продолжить с
                  </div>
                  <b className="text-[15px]">
                    {nextChapter.order}. {nextChapter.title_ru}
                  </b>
                </div>
                <Button asChild>
                  <Link
                    to={`/tasks/${nextChapter.next_task.task_id}`}
                    state={{ returnTo: nextChapter.route_path }}
                  >
                    ▸ Продолжить обучение
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Сборники</h2>
            <span className="text-sm text-ink-faint">{track.collections.length} глав</span>
          </div>

          {track.collections.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-12 text-center">
              <p className="mb-1 text-base font-semibold text-ink">Сборников пока нет</p>
              <p className="mx-auto max-w-sm text-sm text-ink-muted">
                Материалы появятся здесь, когда преподаватель их добавит.
              </p>
            </div>
          ) : (
            <div className="roadmap grid gap-3.5">
              {track.collections.map((chapter, index) => (
                <ChapterCard
                  key={chapter.collection_id}
                  chapter={chapter}
                  isCurrent={nextChapter?.collection_id === chapter.collection_id}
                  isLast={index === track.collections.length - 1}
                />
              ))}
            </div>
          )}

          {!isAuthenticated ? (
            <p className="mt-4 text-sm text-ink-muted">
              Войдите в аккаунт, чтобы сохранять прогресс по сборникам.
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
