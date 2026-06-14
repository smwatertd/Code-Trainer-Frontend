import { test, expect } from "./fixtures/playwright"
import { SOLUTIONS } from "./fixtures"
import { clickCheckAndExpectSuccess, fillCodeEditor, uniqueEmail } from "./helpers"

test("register, login and submit task 2", async ({ page }) => {
  const email = uniqueEmail("student")
  const password = "password123"

  await page.goto("/register")
  await page.getByLabel("Имя").fill("E2E Student")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Пароль").fill(password)
  await page.getByRole("button", { name: "Зарегистрироваться" }).click()

  await expect(page).toHaveURL("/")
  await expect(page.getByRole("heading", { name: "Список задач" })).toBeVisible()

  await page.goto("/tasks/2")
  await expect(page.getByRole("heading", { name: "Сохранить возраст" })).toBeVisible()
  await fillCodeEditor(page, SOLUTIONS.task2AgeFix)
  await clickCheckAndExpectSuccess(page)
})

test("guest can open task catalog without login", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: "Список задач" })).toBeVisible()
  await expect(page.getByTestId("guest-banner")).toBeVisible()
  await expect(page.getByTestId("catalog-task-1")).toBeVisible()
})

test("guest can solve task without saving progress", async ({ page }) => {
  await page.goto("/tasks/2")
  await expect(page.getByTestId("guest-banner")).toBeVisible()
  await expect(page.getByTestId("task-check-btn")).toBeVisible()
})
