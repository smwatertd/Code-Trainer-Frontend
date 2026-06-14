import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import axios from "axios"
import {
  getAccessTokenExpiresAtMs,
  isAccessTokenExpiringSoon,
  refreshAccessToken,
} from "./tokenRefresh"

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}))

const storage = new Map<string, string>()

vi.mock("./authTokens", () => ({
  getRefreshToken: () => storage.get("refresh") ?? null,
  setAuthTokens: (access: string, refresh: string) => {
    storage.set("access", access)
    storage.set("refresh", refresh)
  },
  clearAuthTokens: () => {
    storage.delete("access")
    storage.delete("refresh")
  },
  notifySessionExpired: vi.fn(),
}))

function makeJwt(exp: number): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = btoa(JSON.stringify({ exp }))
  return `${header}.${payload}.sig`
}

describe("tokenRefresh", () => {
  beforeEach(() => {
    storage.clear()
    vi.mocked(axios.post).mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("parses access token expiry", () => {
    const exp = Math.floor(Date.now() / 1000) + 3600
    expect(getAccessTokenExpiresAtMs(makeJwt(exp))).toBe(exp * 1000)
  })

  it("detects tokens that expire soon", () => {
    const exp = Math.floor(Date.now() / 1000) + 30
    expect(isAccessTokenExpiringSoon(makeJwt(exp))).toBe(true)
  })

  it("deduplicates concurrent refresh requests", async () => {
    storage.set("refresh", "refresh-1")
    vi.mocked(axios.post).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                data: {
                  access_token: "access-2",
                  refresh_token: "refresh-2",
                },
              }),
            20,
          )
        }),
    )

    const [first, second] = await Promise.all([refreshAccessToken(), refreshAccessToken()])

    expect(first).toBe("access-2")
    expect(second).toBe("access-2")
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(storage.get("access")).toBe("access-2")
    expect(storage.get("refresh")).toBe("refresh-2")
  })
})
