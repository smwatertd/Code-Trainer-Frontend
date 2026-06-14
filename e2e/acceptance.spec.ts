import { test, expect } from "./fixtures/playwright"
import { DEV_USERS, SOLUTIONS } from "./fixtures"
import {
  clickCheckAndExpectSuccess,
  fillCodeEditor,
  loginAs,
  openTask,
} from "./helpers"

test("submit task 4 updates loops progress on home", async ({ page }) => {
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)

  await page.goto("/tasks/4")
  await expect(page.getByRole("heading", { name: "Вывод с циклом for" })).toBeVisible()
  await fillCodeEditor(page, SOLUTIONS.task4ForLoop)
  await clickCheckAndExpectSuccess(page)

  await page.goto("/")
  await expect(page.getByTestId("progress-track-loops")).toBeVisible()
  await expect(page.getByTestId("progress-loops-stats")).toContainText("1 / 1")
  await expect(page.getByTestId("progress-loops-percent")).toContainText("100%")
})

test("logout returns guest access to catalog and tasks", async ({ page }) => {
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)
  await expect(page.getByTestId("user-info")).toBeVisible()

  await page.getByTestId("logout-btn").click()
  await expect(page.getByRole("banner").getByRole("link", { name: "Войти" })).toBeVisible()

  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Задачи" })).toBeVisible()
  await expect(page.getByTestId("guest-banner")).toBeVisible()

  await openTask(page, 2)
  await expect(page.getByRole("heading", { name: "Упорядочить вывод" })).toBeVisible()
})
