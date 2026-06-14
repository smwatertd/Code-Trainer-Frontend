import { useState, type FormEvent } from "react"
import { Link, useParams } from "react-router-dom"
import { useTaskDetail } from "@/features/catalog"
import {
  useCreateCurriculumLink,
  useDeleteCurriculumLink,
  useTaskCurriculumLinks,
  useValidateCurriculumLink,
} from "@/features/curriculum"
import ApiErrorAlert from "@/shared/ui/ApiErrorAlert"
import ShellPage from "@/shared/ui/ShellPage"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import {
  labelLanguage,
  labelLearningConcept,
  labelTechnicalConcept,
} from "@/shared/utils/labels"
import { showError, showSuccess } from "@/shared/utils/toast"

export default function TaskCurriculumPage() {
  const { id } = useParams()
  const taskId = id ? Number(id) : null
  const taskQuery = useTaskDetail(taskId)
  const linksQuery = useTaskCurriculumLinks(taskId)
  const validateMutation = useValidateCurriculumLink()
  const createMutation = useCreateCurriculumLink(taskId ?? 0)
  const deleteMutation = useDeleteCurriculumLink(taskId ?? 0)

  const [language, setLanguage] = useState("python")
  const [technicalConceptId, setTechnicalConceptId] = useState("for_loop")
  const [exercisePatternId, setExercisePatternId] = useState("tr_pattern_translation")
  const [preview, setPreview] = useState<string | null>(null)
  const [formError, setFormError] = useState<unknown>(null)

  const onValidate = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    setPreview(null)
    try {
      const result = await validateMutation.mutateAsync({
        language,
        technical_concept_id: technicalConceptId,
        exercise_pattern_id: exercisePatternId,
      })
      setPreview(
        `Тема: ${labelLearningConcept(result.learning_concept_id)}, действие: ${result.action}`,
      )
      showSuccess("Связь валидна")
    } catch (error) {
      setFormError(error)
      showError(error)
    }
  }

  const onCreate = async () => {
    if (!taskId) return
    setFormError(null)
    try {
      await createMutation.mutateAsync({
        language,
        technical_concept_id: technicalConceptId,
        exercise_pattern_id: exercisePatternId,
        is_primary: true,
      })
      showSuccess("Связь создана")
      setPreview(null)
    } catch (error) {
      setFormError(error)
      showError(error)
    }
  }

  const onDelete = async (linkId: number) => {
    try {
      await deleteMutation.mutateAsync(linkId)
      showSuccess("Связь удалена")
    } catch (error) {
      showError(error)
    }
  }

  const task = taskQuery.data
  const metadata = linksQuery.data

  return (
    <ShellPage
      title="Связи с учебным планом"
      subtitle={task ? `Задача #${task.id}: ${task.title}` : `Задача #${id}`}
      right={
        <Button variant="outline" size="sm" asChild>
          <Link to={taskId ? `/tasks/${taskId}` : "/"}>К задаче</Link>
        </Button>
      }
    >
      <div className="grid gap-[18px]">
        <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <b className="mb-4 block text-[15px]">Проверить и создать связь</b>
          <form className="space-y-4" onSubmit={onValidate}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lang">Язык</Label>
                <Input
                  id="lang"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-[42px] border-[#333d4f] bg-bg-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technical">Техническая тема</Label>
                <Input
                  id="technical"
                  value={technicalConceptId}
                  onChange={(e) => setTechnicalConceptId(e.target.value)}
                  className="h-[42px] border-[#333d4f] bg-bg-2"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="pattern">Шаблон упражнения</Label>
                <Input
                  id="pattern"
                  value={exercisePatternId}
                  onChange={(e) => setExercisePatternId(e.target.value)}
                  className="h-[42px] border-[#333d4f] bg-bg-2"
                />
              </div>
            </div>
            {formError ? <ApiErrorAlert error={formError} /> : null}
            {preview ? (
              <Alert>
                <AlertDescription>{preview}</AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                type="submit"
                variant="outline"
                disabled={validateMutation.isPending}
                data-testid="curriculum-validate-btn"
              >
                {validateMutation.isPending ? "Проверка…" : "Проверить связь"}
              </Button>
              <Button
                type="button"
                onClick={() => void onCreate()}
                disabled={createMutation.isPending}
                data-testid="curriculum-create-btn"
              >
                {createMutation.isPending ? "Создание…" : "Создать основную связь"}
              </Button>
            </div>
          </form>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <b className="mb-4 block text-[15px]">Текущие связи</b>
          <div className="space-y-3">
            {linksQuery.isLoading ? (
              <p className="text-sm text-ink-muted">Загрузка…</p>
            ) : !metadata?.links?.length ? (
              <p className="text-sm text-ink-muted">Связей нет</p>
            ) : (
              metadata.links.map((link) => (
                <div
                  key={link.id}
                  data-testid={`curriculum-link-${link.id}`}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-surface-2 p-3"
                >
                  <div className="space-y-1 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Badge>{labelLanguage(link.language)}</Badge>
                      {link.is_primary ? <Badge variant="default">Основная</Badge> : null}
                    </div>
                    <p>
                      <span className="text-ink-muted">Тема:</span>{" "}
                      {labelLearningConcept(link.learning_concept_id)}
                    </p>
                    <p>
                      <span className="text-ink-muted">Техническая тема:</span>{" "}
                      {labelTechnicalConcept(link.technical_concept_id)}
                    </p>
                    <p>
                      <span className="text-ink-muted">Шаблон:</span> {link.exercise_pattern_id}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => void onDelete(link.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Удалить
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ShellPage>
  )
}
