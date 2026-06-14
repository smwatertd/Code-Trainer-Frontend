import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert"
import { getApiErrorCode, getApiErrorMessage } from "@/shared/utils/apiErrors"

const ERROR_TITLES: Record<string, string> = {
  VALIDATION_ERROR: "Проверьте данные",
  UNAUTHORIZED: "Нужна авторизация",
  FORBIDDEN: "Недостаточно прав",
  NOT_FOUND: "Не найдено",
  CONFLICT: "Конфликт данных",
  RATE_LIMIT_EXCEEDED: "Слишком много запросов",
}

type ApiErrorAlertProps = {
  error: unknown
  fallback?: string
  title?: string
  className?: string
}

export default function ApiErrorAlert({
  error,
  fallback = "Что-то пошло не так",
  title,
  className,
}: ApiErrorAlertProps) {
  const code = getApiErrorCode(error)
  const message = getApiErrorMessage(error, fallback)
  const resolvedTitle = title ?? (code ? ERROR_TITLES[code] : undefined)

  return (
    <Alert variant="destructive" className={className} data-testid="api-error-alert">
      {resolvedTitle ? <AlertTitle>{resolvedTitle}</AlertTitle> : null}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
