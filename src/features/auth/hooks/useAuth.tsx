import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import * as authClient from "@/shared/api/authClient"
import {
  AUTH_SESSION_EXPIRED_EVENT,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/shared/api/authTokens"
import { isAccessTokenExpiringSoon, refreshAccessToken } from "@/shared/api/tokenRefresh"
import { queryKeys } from "@/shared/config/queryKeys"
import type { CurrentUser } from "@/shared/types/api"
import { isUnauthorizedError } from "@/shared/utils/httpErrors"

type AuthContextValue = {
  user: CurrentUser | null
  isAuthenticated: boolean
  isGuest: boolean
  isCheckingAuth: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [hasToken, setHasToken] = useState(() => Boolean(getAccessToken()))

  const meQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: authClient.getMe,
    enabled: hasToken,
    staleTime: 5 * 60_000,
    retry: (failureCount, error) => !isUnauthorizedError(error) && failureCount < 1,
  })

  useEffect(() => {
    if (!meQuery.isError || !isUnauthorizedError(meQuery.error)) return
    clearAuthTokens()
    setHasToken(false)
    queryClient.removeQueries({ queryKey: queryKeys.me })
  }, [meQuery.isError, meQuery.error, queryClient])

  useEffect(() => {
    if (!hasToken) return

    const ensureFreshAccessToken = async () => {
      const accessToken = getAccessToken()
      if (!accessToken || !isAccessTokenExpiringSoon(accessToken)) return
      const nextAccess = await refreshAccessToken()
      if (nextAccess) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.me })
      }
    }

    void ensureFreshAccessToken()

    const intervalId = window.setInterval(() => {
      void ensureFreshAccessToken()
    }, 60_000)

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void ensureFreshAccessToken()
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [hasToken, queryClient])

  useEffect(() => {
    const onExpired = () => {
      clearAuthTokens()
      setHasToken(false)
      queryClient.removeQueries({ queryKey: queryKeys.me })
    }
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onExpired)
  }, [queryClient])

  const login = useCallback(
    async (email: string, password: string) => {
      const tokens = await authClient.login({ email, password })
      setAuthTokens(tokens.access_token, tokens.refresh_token)
      setHasToken(true)
      await queryClient.invalidateQueries({ queryKey: queryKeys.me })
    },
    [queryClient],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const tokens = await authClient.register({ name, email, password })
      setAuthTokens(tokens.access_token, tokens.refresh_token)
      setHasToken(true)
      await queryClient.invalidateQueries({ queryKey: queryKeys.me })
    },
    [queryClient],
  )

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        await authClient.logout(refreshToken)
      } catch {
        // ignore logout errors
      }
    }
    clearAuthTokens()
    setHasToken(false)
    queryClient.removeQueries({ queryKey: queryKeys.me })
  }, [queryClient])

  const value = useMemo<AuthContextValue>(() => {
    const isAuthenticated = hasToken && Boolean(meQuery.data)
    const isCheckingAuth = hasToken && meQuery.isLoading
    return {
      user: meQuery.data ?? null,
      isAuthenticated,
      isGuest: !isAuthenticated && !isCheckingAuth,
      isCheckingAuth,
      login,
      register,
      logout,
    }
  }, [hasToken, login, logout, meQuery.data, meQuery.isLoading, register])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
