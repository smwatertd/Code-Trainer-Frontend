import { useState } from "react"
import { useParams } from "react-router-dom"
import { useCurriculumDebug, useCurriculumValidation } from "@/features/curriculum"
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

const DEFAULT_LANGUAGES = ["python", "pascal"] as const

export default function CurriculumAdminPage() {
  const { lang } = useParams()
  const [language, setLanguage] = useState(lang ?? "python")
  const validationQuery = useCurriculumValidation(language)
  const debugQuery = useCurriculumDebug(language)

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Отладка учебного плана</h1>
        <p className="text-sm text-muted-foreground">Проверка и диагностика YAML учебного плана</p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="space-y-2">
            <Label htmlFor="admin-lang">Язык</Label>
            <Input
              id="admin-lang"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              list="curriculum-languages"
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
        </CardContent>
      </Card>

      {validationQuery.data ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg" data-testid="curriculum-validate-title">
              Проверка
              <Badge variant={validationQuery.data.valid ? "default" : "destructive"}>
                {validationQuery.data.valid ? "Корректно" : "Есть ошибки"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {validationQuery.data.errors.length ? (
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
              <p className="text-sm text-muted-foreground">Ошибок нет</p>
            )}
            <pre className="overflow-auto rounded-lg border bg-muted/40 p-3 text-xs">
              {JSON.stringify(validationQuery.data.stats, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : null}

      {debugQuery.data ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Диагностика</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <pre className="overflow-auto rounded-lg border bg-muted/40 p-3 text-xs">
              {JSON.stringify(debugQuery.data.summary, null, 2)}
            </pre>
            <pre className="max-h-96 overflow-auto rounded-lg border bg-muted/40 p-3 text-xs">
              {JSON.stringify(debugQuery.data.chapters, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : null}

      {(validationQuery.isError || debugQuery.isError) && (
        <Alert variant="destructive">
          <AlertDescription>Недостаточно прав или ошибка загрузки (нужна роль admin)</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
