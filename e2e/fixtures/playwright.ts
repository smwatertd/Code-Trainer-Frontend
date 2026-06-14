import { test as base, expect } from "@playwright/test"
import { installMockApi, resetMockApi } from "../mock-api/install"

export const test = base.extend({
  page: async ({ page }, use) => {
    resetMockApi()
    await installMockApi(page)
    await use(page)
  },
})

export { expect }
