import type { Page, Route } from "@playwright/test"
import { mockApiStore } from "./store"

export function resetMockApi() {
  mockApiStore.reset()
}

async function fulfillJson(route: Route, status: number, body: unknown) {
  if (status === 204 || body == null) {
    await route.fulfill({ status, body: "" })
    return
  }
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  })
}

function isApiRequest(url: string): boolean {
  const pathname = new URL(url).pathname
  return pathname === "/api" || pathname.startsWith("/api/")
}

export async function installMockApi(page: Page) {
  await page.route(isApiRequest, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const apiPath = `${url.pathname.replace(/^\/api/, "") || "/"}${url.search}`
    const authorization = request.headers().authorization ?? null

    let body: unknown = null
    if (request.method() !== "GET" && request.postData()) {
      try {
        body = JSON.parse(request.postData() ?? "{}")
      } catch {
        body = null
      }
    }

    const response = mockApiStore.handle(request.method(), apiPath, authorization, body)
    await fulfillJson(route, response.status, response.body)
  })
}
