import { toast } from "sonner"
import { getApiErrorCode, getApiErrorMessage } from "@/shared/utils/apiErrors"

export function showError(error: unknown, fallback = "Что-то пошло не так"): void {
  const message = getApiErrorMessage(error, fallback)
  const code = getApiErrorCode(error)
  toast.error(code ? `${message} (${code})` : message)
}

export function showSuccess(message: string): void {
  toast.success(message)
}
