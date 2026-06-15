import { test, expect } from "./fixtures/playwright"
import { DEV_USERS } from "./fixtures"
import { loginAs, solveFixTask2Age } from "./helpers"

test("teacher can create and edit own task", async ({ page }) => {
  await loginAs(page, DEV_USERS.teacher.email, DEV_USERS.teacher.password)
  await page.goto("/teacher/cabinet")
  await expect(page.getByRole("heading", { name: "Кабинет преподавателя" })).toBeVisible()

  await page.getByTestId("teacher-create-task").click()
  await expect(page.getByRole("heading", { name: "Создать задачу" })).toBeVisible()

  await page.getByLabel("Название").fill("E2E teacher task")
  await page.getByLabel("Условие").fill("Выведите hello")
  await page.getByLabel("Ожидаемый вывод (тест)").fill("hello")
  await page.getByRole("button", { name: "Создать" }).click()

  await expect(page.getByRole("heading", { name: "Кабинет преподавателя" })).toBeVisible()
  await expect(page.getByRole("link", { name: "E2E teacher task" })).toBeVisible()

  await page.getByRole("link", { name: "E2E teacher task" }).click()
  await expect(page.getByRole("heading", { name: "Редактировать задачу" })).toBeVisible()
  await page.getByLabel("Название").fill("E2E teacher task updated")
  await page.getByRole("button", { name: "Сохранить" }).click()
  await expect(page.getByRole("link", { name: "E2E teacher task updated" })).toBeVisible()
})

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
  await solveFixTask2Age(page)
  await expect(page.getByTestId("task-progress")).toContainText("Решено", { timeout: 15_000 })
})
