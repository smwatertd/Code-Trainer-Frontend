import { useState } from "react"
import { useParams } from "react-router-dom"
import { useCurriculumDebug, useCurriculumValidation } from "@/features/curriculum"
import ShellPage from "@/shared/ui/ShellPage"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

const DEFAULT_LANGUAGES = ["python", "pascal"] as const

export default function CurriculumAdminPage() {
  const { lang } = useParams()
  const [language, setLanguage] = useState(lang ?? "python")
  const validationQuery = useCurriculumValidation(language)
  const debugQuery = useCurriculumDebug(language)

  return (
    <ShellPage
      title="Отладка учебного плана"
      subtitle="Проверка и диагностика YAML учебного плана"
    >
      <div className="grid gap-[18px]">
        <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-2">
              <Label htmlFor="admin-lang">Язык</Label>
              <Input
                id="admin-lang"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                list="curriculum-languages"
                className="h-[42px] border-[#333d4f] bg-bg-2"
              />
              <datalist id="curriculum-languages">
                {DEFAULT_LANGUAGES.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                void validationQuery.refetch()
                void debugQuery.refetch()
              }}
            >
              Обновить
            </Button>
          </div>
        </div>

        {validationQuery.data ? (
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
            <div
              className="mb-4 flex items-center gap-2 text-lg font-semibold"
              data-testid="curriculum-validate-title"
            >
              Проверка
              <Badge variant={validationQuery.data.valid ? "default" : "destructive"}>
                {validationQuery.data.valid ? "Корректно" : "Есть ошибки"}
              </Badge>
            </div>
            <div className="space-y-3">
              {validationQuery.data.errors?.length ? (
                <Alert variant="destructive">
                  <AlertTitle>Ошибки</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4">
                      {validationQuery.data.errors.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              ) : (
                <p className="text-sm text-ink-muted">Ошибок нет</p>
              )}
              <pre className="overflow-auto rounded-lg border border-border bg-bg-2 p-3 text-xs text-ink">
                {JSON.stringify(validationQuery.data.stats, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}

        {debugQuery.data ? (
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
            <b className="mb-4 block text-[15px]">Диагностика</b>
            <div className="space-y-3">
              <pre className="overflow-auto rounded-lg border border-border bg-bg-2 p-3 text-xs text-ink">
                {JSON.stringify(debugQuery.data.summary, null, 2)}
              </pre>
              <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-bg-2 p-3 text-xs text-ink">
                {JSON.stringify(debugQuery.data.chapters, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}

        {(validationQuery.isError || debugQuery.isError) && (
          <Alert variant="destructive">
            <AlertDescription>
              Недостаточно прав или ошибка загрузки (нужна роль admin)
            </AlertDescription>
          </Alert>
        )}
      </div>
    </ShellPage>
  )
}
