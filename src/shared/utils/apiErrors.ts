import axios from "axios"
import type { ApiErrorBody } from "@/shared/types/api"

const API_ERROR_MESSAGES: Record<string, string> = {
  "Invalid email or password": "Неверный email или пароль",
  "Invalid credentials": "Неверный email или пароль",
  "Account is disabled": "Аккаунт отключён",
  "Authentication required": "Нужна авторизация",
  "Token is expired": "Сессия истекла, войдите снова",
  "Token is invalid": "Сессия недействительна, войдите снова",
  "Invalid token type": "Сессия недействительна, войдите снова",
  "Refresh session is invalid": "Сессия истекла, войдите снова",
  "Email already exists": "Этот email уже зарегистрирован",
  "Too many guest checks per minute.": "Слишком много проверок. Подождите минуту и попробуйте снова.",
  "Guest check already in progress.": "Проверка уже выполняется. Дождитесь результата.",
}

function localizeApiErrorMessage(message: string): string {
  return API_ERROR_MESSAGES[message] ?? message
}

export function getApiErrorMessage(error: unknown, fallback = "Что-то пошло не так"): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined
    if (body?.error?.message) return localizeApiErrorMessage(body.error.message)
    if (error.message) return localizeApiErrorMessage(error.message)
  }
  if (error instanceof Error) return localizeApiErrorMessage(error.message)
  return fallback
}

export function getApiErrorCode(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null
  const body = error.response?.data as ApiErrorBody | undefined
  return body?.error?.code ?? null
}
