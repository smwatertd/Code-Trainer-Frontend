import { test, expect } from "./fixtures/playwright"
import { DEV_USERS } from "./fixtures"
import { loginAs, openTask, solveTranslationTask3Sum, expectLoggedOut } from "./helpers"

test("submit task 3 updates loops progress on home", async ({ page }) => {
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)

  await solveTranslationTask3Sum(page)

  await page.goto("/")
  await expect(page.getByTestId("learning-language-python")).toBeVisible()
  await expect(page.getByTestId("learning-language-python-stats")).toContainText("1/1")
})

test("logout returns guest access to catalog and tasks", async ({ page }) => {
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)
  await expect(page.getByTestId("user-info")).toBeVisible()

  await page.getByTestId("logout-btn").click()
  await expectLoggedOut(page)

  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Список задач" })).toBeVisible()
  await expect(page.getByTestId("guest-banner")).toBeVisible()

  await openTask(page, 1)
  await expect(page.getByRole("heading", { name: "Вывести приветствие" })).toBeVisible()
})
