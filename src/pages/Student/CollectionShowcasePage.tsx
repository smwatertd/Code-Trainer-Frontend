import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { useCollectionShowcase } from "@/features/curriculum"
import type { CurriculumNavState } from "@/features/curriculum/types"
import ShowcaseTaskCard from "@/features/curriculum/ui/ShowcaseTaskCard"
import { labelLearningConcept, labelLanguage } from "@/shared/utils/labels"
import ShellPage from "@/shared/ui/ShellPage"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"

export default function CollectionShowcasePage() {
  const navigate = useNavigate()
  const { language = "python", conceptId = "loops" } = useParams()
  const { isAuthenticated } = useAuth()
  const { data, isLoading, error, refetch } = useCollectionShowcase(language, conceptId)

  const languageLabel = labelLanguage(language)
  const conceptLabel = labelLearningConcept(conceptId)
  const hubPath = `/learn/${language}`
  const returnTo = `/learn/${language}/${conceptId}`

  const openTask = (taskId: number) => {
    const state: CurriculumNavState = {
      returnTo,
      navigationMode: "curriculum",
      collectionId: conceptId,
      collectionTitle: data?.title ?? conceptLabel,
    }
    navigate(`/tasks/${taskId}`, { state })
  }

  if (isLoading) {
    return (
      <ShellPage title="Сборник" subtitle="Загрузка…">
        <p className="text-sm text-ink-muted">Загрузка сборника…</p>
      </ShellPage>
    )
  }

  if (error || !data) {
    return (
      <ShellPage title="Сборник" subtitle="Ошибка загрузки">
        <div className="rounded-lg border border-border bg-surface p-6 text-center">
          <p className="mb-4 text-sm text-ink-muted">Не удалось загрузить сборник.</p>
          <Button size="sm" onClick={() => void refetch()}>
            Повторить
          </Button>
        </div>
      </ShellPage>
    )
  }

  const progress = data.progress
  const percent =
    progress && progress.total_tasks
      ? Math.round((progress.passed_tasks / progress.total_tasks) * 100)
      : 0

  return (
    <ShellPage
      title=""
      subtitle=""
      right={
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghost" asChild>
            <Link to={hubPath}>← Все сборники</Link>
          </Button>
          <Button size="sm" disabled={!data.next_task} onClick={() => data.next_task && openTask(data.next_task.task_id)}>
            ▸ {data.button_label}
          </Button>
        </div>
      }
    >
      <Button variant="ghost" size="sm" className="mb-3.5 -ml-2" asChild>
        <Link to={hubPath}>← Все сборники</Link>
      </Button>

      <div className="mb-1 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Сборник «{data.title}»</Badge>
            <span className="text-sm text-ink-faint">{data.total_tasks} задач</span>
          </div>
          <h1 className="mb-1 text-[26px] font-extrabold tracking-[-0.6px] text-ink">
            <span className="text-lg font-semibold text-ink-faint">{languageLabel} / </span>
            {data.title}
          </h1>
          <p className="text-sm text-ink-muted">{data.description}</p>
        </div>
      </div>

      {progress ? (
        <div className="my-6 rounded-2xl border border-border bg-surface p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
            <b className="text-sm text-ink">Прогресс сборника</b>
            <span className="font-mono text-sm text-ink-faint">
              {progress.passed_tasks}/{progress.total_tasks} · {percent}%
            </span>
          </div>
          <div className="tp-progress">
            <i style={{ width: `${percent}%` }} />
          </div>
        </div>
      ) : (
        <div className="my-6 rounded-xl border border-purple/30 bg-purple-soft p-4 text-sm text-[#cbb6ff]">
          <b className="text-ink">Вы не авторизованы.</b> Войдите, чтобы отслеживать прогресс по задачам
          этого сборника.
        </div>
      )}

      <div className="grid gap-[30px]">
        {data.sections.map((section, index) => (
          <section key={section.id}>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-surface-2 text-xs font-bold text-ink-muted">
                {index + 1}
              </span>
              <h2 className="text-base font-semibold text-ink">{section.name_ru}</h2>
              {isAuthenticated ? (
                <span className="font-mono text-xs text-ink-faint">
                  {section.progress.passed_tasks}/{section.progress.total_tasks}
                </span>
              ) : null}
            </div>
            <div className="grid gap-3">
              {section.tasks.map((task) => (
                <ShowcaseTaskCard
                  key={task.task_id}
                  task={task}
                  isGuest={!isAuthenticated}
                  returnTo={returnTo}
                  onOpen={(taskId) => openTask(taskId)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </ShellPage>
  )
}
