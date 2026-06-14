import { test, expect } from "./fixtures/playwright"
import { DEV_USERS } from "./fixtures"
import {
  clickCheckAndExpectSuccess,
  loginAs,
  solveFixTask2Age,
} from "./helpers"

test("guest cannot open teacher groups page", async ({ page }) => {
  await page.goto("/teacher/groups")
  await expect(page).toHaveURL("/login")
})

test("guest cannot open student assignment sets page", async ({ page }) => {
  await page.goto("/assignment-sets")
  await expect(page).toHaveURL("/login")
})

test("guest task page has no progress card", async ({ page }) => {
  await page.goto("/tasks/1")
  await expect(page.getByTestId("guest-banner")).toBeVisible()
  await expect(page.getByTestId("task-progress")).toHaveCount(0)
  await clickCheckAndExpectSuccess(page)
  await expect(page.getByTestId("task-progress")).toHaveCount(0)
})

test("guest successful check suggests registration", async ({ page }) => {
  await page.goto("/tasks/1")
  await clickCheckAndExpectSuccess(page)
  await expect(page.getByTestId("guest-banner")).toBeVisible()
  await expect(page.getByRole("link", { name: "зарегистрироваться" })).toBeVisible()
})

test("student task page shows progress after submit", async ({ page }) => {
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)
  await page.goto("/tasks/2")
  await expect(page.getByTestId("guest-banner")).toHaveCount(0)
  await solveFixTask2Age(page)
  await expect(page.getByTestId("task-progress")).toBeVisible()
})

test("login shows russian error for invalid credentials", async ({ page }) => {
  await page.goto("/login")
  await page.getByLabel("Email").fill(DEV_USERS.student.email)
  await page.getByLabel("Пароль").fill("wrong-password")
  await page.getByRole("button", { name: "Войти" }).click()
  await expect(page.getByText("Неверный email или пароль")).toBeVisible()
})
