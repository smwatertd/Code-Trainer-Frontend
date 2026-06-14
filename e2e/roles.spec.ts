import { test, expect } from "./fixtures/playwright"
import { DEV_USERS } from "./fixtures"
import { loginAs } from "./helpers"

test("teacher can validate and create curriculum link", async ({ page }) => {
  await loginAs(page, DEV_USERS.teacher.email, DEV_USERS.teacher.password)
  await expect(page.getByTestId("user-info")).toContainText("Преподаватель")

  await page.goto("/teacher/tasks/5/curriculum")
  await expect(page.getByRole("heading", { name: "Связи с учебным планом" })).toBeVisible()

  const deleteButtons = page.getByRole("button", { name: "Удалить" })
  for (let remaining = await deleteButtons.count(); remaining > 0; remaining -= 1) {
    await deleteButtons.first().click()
  }

  await page.getByTestId("curriculum-validate-btn").click()
  await expect(page.getByText(/Тема:/)).toBeVisible()

  await page.getByTestId("curriculum-create-btn").click()
  await expect(page.getByTestId(/^curriculum-link-/)).toBeVisible()
  await expect(page.getByText("Цикл for")).toBeVisible()
})

test("admin can view curriculum validation", async ({ page }) => {
  await loginAs(page, DEV_USERS.admin.email, DEV_USERS.admin.password)
  await expect(page.getByTestId("user-info")).toContainText("Администратор")

  await page.goto("/admin/curriculum/python")
  await expect(page.getByRole("heading", { name: "Отладка учебного плана" })).toBeVisible()
  await expect(page.getByTestId("curriculum-validate-title")).toBeVisible()
  await expect(page.getByText("Корректно", { exact: true })).toBeVisible()
})

test("student submission updates task progress", async ({ page }) => {
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)

  await page.goto("/tasks/2")
  await expect(page.getByRole("heading", { name: "Упорядочить вывод" })).toBeVisible()
  await page.getByTestId("block-move-down-0").click()
  await page.getByTestId("task-check-btn").click()
  await expect(page.getByTestId("result-success-badge")).toHaveText("Успех")

  await expect(page.getByTestId("task-progress")).toBeVisible()
  await expect(page.getByTestId("task-progress")).toContainText("Решено")
})
