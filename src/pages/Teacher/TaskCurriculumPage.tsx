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
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import {
  labelLanguage,
  labelLearningConcept,
  labelTechnicalConcept,
} from "@/shared/utils/labels"

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
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Связи с учебным планом</h1>
          <p className="text-sm text-muted-foreground">
            {task ? `Задача #${task.id}: ${task.title}` : `Задача #${id}`}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to={taskId ? `/tasks/${taskId}` : "/"}>К задаче</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Проверить и создать связь</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onValidate}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lang">Язык</Label>
                <Input id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technical">Техническая тема</Label>
                <Input
                  id="technical"
                  value={technicalConceptId}
                  onChange={(e) => setTechnicalConceptId(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="pattern">Шаблон упражнения</Label>
                <Input
                  id="pattern"
                  value={exercisePatternId}
                  onChange={(e) => setExercisePatternId(e.target.value)}
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
              <Button type="submit" variant="outline" disabled={validateMutation.isPending} data-testid="curriculum-validate-btn">
                {validateMutation.isPending ? "Проверка…" : "Проверить связь"}
              </Button>
              <Button type="button" onClick={() => void onCreate()} disabled={createMutation.isPending} data-testid="curriculum-create-btn">
                {createMutation.isPending ? "Создание…" : "Создать основную связь"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Текущие связи</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {linksQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Загрузка…</p>
          ) : !metadata?.links?.length ? (
            <p className="text-sm text-muted-foreground">Связей нет</p>
          ) : (
            metadata.links.map((link) => (
              <div
                key={link.id}
                data-testid={`curriculum-link-${link.id}`}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3"
              >
                <div className="space-y-1 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{labelLanguage(link.language)}</Badge>
                    {link.is_primary ? <Badge variant="default">Основная</Badge> : null}
                  </div>
                  <p>
                    <span className="text-muted-foreground">Тема:</span>{" "}
                    {labelLearningConcept(link.learning_concept_id)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Техническая тема:</span>{" "}
                    {labelTechnicalConcept(link.technical_concept_id)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Шаблон:</span> {link.exercise_pattern_id}
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
        </CardContent>
      </Card>
    </div>
  )
}
