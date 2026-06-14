import { test, expect } from "./fixtures/playwright"

test("catalog lists seeded tasks", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Задачи" })).toBeVisible()
  await expect(page.getByTestId("catalog-task-1")).toBeVisible()
  await expect(page.getByTestId("catalog-task-10")).toBeVisible()
})
