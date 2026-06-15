import { test, expect } from "./fixtures/playwright"
import { DEV_USERS } from "./fixtures"
import { loginAs, openTask, solveTranslationTask3Sum, expectLoggedOut } from "./helpers"

test("submit task 3 updates loops progress on home", async ({ page }) => {
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)

  await solveTranslationTask3Sum(page)

  await page.goto("/")
  await page.getByRole("link", { name: "Учебные треки" }).click()
  await expect(page).toHaveURL(/\/learn$/)
  await page.getByTestId("track-card-python").getByRole("link", { name: "Подробнее" }).click()
  await expect(page).toHaveURL(/\/learn\/python/)
  await expect(page.getByTestId("track-progress")).toContainText("1/24")
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
