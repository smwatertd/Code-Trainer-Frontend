import { test, expect } from "./fixtures/playwright"
import { DEV_USERS } from "./fixtures"
import { loginAs } from "./helpers"

test("student profile loads API data and switches tabs", async ({ page }) => {
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)
  await page.goto("/student/profile")

  await expect(page.getByRole("heading", { name: "Мой профиль" })).toBeVisible()
  await expect(page.getByTestId("contrib-graph")).toBeVisible()
  await expect(page.getByText("Уровень ·")).toBeVisible()
  await expect(page.getByText("Навыки")).toBeVisible()

  await page.getByRole("button", { name: "Мои решения" }).click()
  await expect(page).toHaveURL(/tab=solutions/)
  await expect(page.getByPlaceholder("Поиск по решениям…")).toBeVisible()

  await page.getByRole("button", { name: "Группы" }).click()
  await expect(page).toHaveURL(/tab=groups/)
  await expect(page.getByRole("button", { name: "Вступить по коду" })).toBeVisible()
})

test("teacher public profile is available via /users and /teachers alias", async ({ page }) => {
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)

  await page.goto("/users/2")
  await expect(page.getByRole("heading", { name: DEV_USERS.teacher.name })).toBeVisible()
  await expect(page.getByText("О преподавателе")).toBeVisible()
  await expect(page.locator(".tpp-section").filter({ hasText: "Группы" }).first()).toBeVisible()

  await page.goto("/teachers/2")
  await expect(page).toHaveURL("/users/2")
  await expect(page.getByRole("heading", { name: DEV_USERS.teacher.name })).toBeVisible()
})

test("teacher can open student public profile with teacherId scope", async ({ page }) => {
  await loginAs(page, DEV_USERS.teacher.email, DEV_USERS.teacher.password)

  await page.goto(`/users/1?teacherId=2`)
  await expect(page.getByRole("heading", { name: DEV_USERS.student.name })).toBeVisible()
  await expect(page.getByText("Решено задач")).toBeVisible()
  await expect(page.getByRole("button", { name: "✉ Написать студенту" })).toBeVisible()

  await page.goto("/students/1")
  await expect(page).toHaveURL(/\/users\/1\?teacherId=2/)
})

test("teacher settings tab shows profile form and stat cards", async ({ page }) => {
  await loginAs(page, DEV_USERS.teacher.email, DEV_USERS.teacher.password)

  await page.goto("/settings/teacher")
  await expect(page.getByRole("heading", { name: "Настройки" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Преподаватель" })).toBeVisible()
  await expect(page.getByText("Профиль преподавателя")).toBeVisible()
  await expect(page.getByText("Моих задач")).toBeVisible()
  await expect(page.getByText("Студентов")).toBeVisible()
})

test("group dashboard links student name to public profile", async ({ page }) => {
  await loginAs(page, DEV_USERS.teacher.email, DEV_USERS.teacher.password)

  await page.goto("/teacher/groups")
  await page.getByTestId("group-name-input").fill("Profile Link Group")
  await page.getByTestId("group-create-btn").click()

  const groupCard = page.getByTestId(/^teacher-group-/).first()
  const groupId = (await groupCard.getAttribute("data-testid"))?.replace("teacher-group-", "") ?? ""
  await page.getByTestId(`group-invite-btn-${groupId}`).click()
  const inviteCode = await page.getByTestId("invite-code-alert").innerText()
  const code = inviteCode.match(/[A-Z0-9]{6,}/)?.[0]
  expect(code).toBeTruthy()

  await page.getByTestId("logout-btn").click()
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)
  await page.goto("/groups/join")
  await page.getByTestId("join-group-code-input").fill(code!)
  await page.getByTestId("join-group-btn").click()

  await page.getByTestId("logout-btn").click()
  await loginAs(page, DEV_USERS.teacher.email, DEV_USERS.teacher.password)
  await page.goto(`/teacher/groups/${groupId}/dashboard`)

  await page.getByRole("link", { name: DEV_USERS.student.name }).click()
  await expect(page).toHaveURL(/\/users\/1\?teacherId=2/)
  await expect(page.getByRole("heading", { name: DEV_USERS.student.name })).toBeVisible()
})
