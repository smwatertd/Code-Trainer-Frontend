import { test, expect } from "./fixtures/playwright"
import { DEV_USERS } from "./fixtures"
import { clickCheckAndExpectSuccess, loginAs } from "./helpers"

test("profile and settings routes are available", async ({ page }) => {
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)

  await page.goto("/student/profile")
  await expect(page.getByRole("heading", { name: "Мой профиль" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Прогресс" })).toBeVisible()

  await page.goto("/settings/profile")
  await expect(page.getByRole("heading", { name: "Настройки" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Профиль" })).toBeVisible()
})

test("task page shows only condition panel without legacy tabs", async ({ page }) => {
  await page.goto("/tasks/1")

  await expect(page.getByRole("heading", { name: "Вывести приветствие" })).toBeVisible()
  await expect(page.getByText("Ожидаемые конструкции")).toBeVisible()
  await expect(page.getByRole("tab", { name: "Примеры" })).toHaveCount(0)
  await expect(page.getByRole("tab", { name: "Подсказки" })).toHaveCount(0)
  await expect(page.getByRole("tab", { name: "Эталон" })).toHaveCount(0)
})

test("task 1 reference pane shows python while learning pascal blocks", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 })
  await page.goto("/tasks/1")

  await expect(page.getByText(/Эталон · python/i)).toBeVisible()
  await expect(page.getByText("Учу · pascal")).toBeVisible()
})

test("block reorder task 1 passes without assembled-code mismatch", async ({ page }) => {
  await page.goto("/tasks/1")
  await clickCheckAndExpectSuccess(page)
  await expect(page.getByText("Собранный код не совпадает")).toHaveCount(0)
})
