import type { CurrentUser } from "@/shared/types/api"

export type NormalizedRole = "student" | "teacher" | "admin"

export function normalizeRole(raw: unknown): NormalizedRole {
  const value = String(raw ?? "student").trim().toLowerCase()
  if (value === "admin") return "admin"
  if (value === "teacher") return "teacher"
  return "student"
}

export function userHasRole(user: CurrentUser | null, roles: NormalizedRole[]): boolean {
  if (!user) return false
  return roles.includes(normalizeRole(user.role))
}

export function canAccessTeacherWorkspace(user: CurrentUser | null): boolean {
  return userHasRole(user, ["teacher", "admin"])
}

export function canAccessAdminWorkspace(user: CurrentUser | null): boolean {
  return userHasRole(user, ["admin"])
}
