import { Navigate, useLocation } from "react-router-dom"
import type { ReactNode } from "react"
import type { CurrentUser } from "@/shared/types/api"
import { normalizeRole, type NormalizedRole } from "@/shared/types/user"

type ProtectedRouteProps = {
  isAuthenticated: boolean
  isCheckingAuth: boolean
  user: CurrentUser | null
  allowedRoles?: NormalizedRole[]
  children: ReactNode
}

export default function ProtectedRoute({
  isAuthenticated,
  isCheckingAuth,
  user,
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const location = useLocation()

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-muted">
        Загрузка…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles?.length) {
    const role = normalizeRole(user?.role)
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />
    }
  }

  return children
}
