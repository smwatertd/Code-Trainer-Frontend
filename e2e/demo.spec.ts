import { test, expect } from "./fixtures/playwright"

test("catalog lists seeded tasks", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Список задач" })).toBeVisible()
  await expect(page.getByTestId("catalog-task-1")).toBeVisible()
  await expect(page.getByTestId("catalog-task-12")).toBeVisible()
})
