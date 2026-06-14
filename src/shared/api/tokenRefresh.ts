import axios from "axios"
import {
  clearAuthTokens,
  getRefreshToken,
  notifySessionExpired,
  setAuthTokens,
} from "@/shared/api/authTokens"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api"

let refreshInFlight: Promise<string | null> | null = null

export function getAccessTokenExpiresAtMs(accessToken: string): number | null {
  try {
    const [, payloadPart] = accessToken.split(".")
    if (!payloadPart) return null
    const payload = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"))) as {
      exp?: unknown
    }
    return typeof payload.exp === "number" ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export function isAccessTokenExpiringSoon(
  accessToken: string,
  withinMs = 2 * 60_000,
): boolean {
  const expiresAt = getAccessTokenExpiresAtMs(accessToken)
  if (!expiresAt) return false
  return expiresAt - Date.now() <= withinMs
}

async function requestRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearAuthTokens()
    notifySessionExpired()
    return null
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken,
    })
    const nextAccess = response.data?.access_token as string | undefined
    const nextRefresh = response.data?.refresh_token as string | undefined
    if (!nextAccess || !nextRefresh) {
      clearAuthTokens()
      notifySessionExpired()
      return null
    }
    setAuthTokens(nextAccess, nextRefresh)
    return nextAccess
  } catch {
    clearAuthTokens()
    notifySessionExpired()
    return null
  }
}

export function refreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = requestRefresh().finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}
