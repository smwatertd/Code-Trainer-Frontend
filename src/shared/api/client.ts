import axios, { type InternalAxiosRequestConfig } from "axios"
import {
  AUTH_SESSION_EXPIRED_EVENT,
  clearAuthTokens,
  getAccessToken,
  notifySessionExpired,
} from "@/shared/api/authTokens"
import { refreshAccessToken } from "@/shared/api/tokenRefresh"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api"

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableConfig | undefined
    const status = error?.response?.status
    const url = originalRequest?.url ?? ""

    if (
      originalRequest &&
      !originalRequest._retry &&
      status === 401 &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/refresh") &&
      !url.includes("/auth/logout") &&
      !url.includes("/demo/check")
    ) {
      originalRequest._retry = true
      const nextAccess = await refreshAccessToken()
      if (nextAccess) {
        originalRequest.headers.Authorization = `Bearer ${nextAccess}`
        return api(originalRequest)
      }
    }

    if (status === 401 && !url.includes("/auth/login") && !url.includes("/auth/register")) {
      clearAuthTokens()
      notifySessionExpired()
    }

    return Promise.reject(error)
  },
)

export { API_BASE_URL, AUTH_SESSION_EXPIRED_EVENT }
