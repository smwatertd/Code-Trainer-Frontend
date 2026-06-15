import { test, expect } from "./fixtures/playwright"
import { DEV_USERS } from "./fixtures"
import { loginAs, expectLoggedOut } from "./helpers"

test("teacher creates group and assignment set with task", async ({ page }) => {
  await loginAs(page, DEV_USERS.teacher.email, DEV_USERS.teacher.password)

  await page.goto("/teacher/groups")
  await page.getByTestId("group-name-input").fill("Playwright Group")
  await page.getByTestId("group-create-btn").click()
  await expect(page.getByTestId(/^teacher-group-/)).toBeVisible()

  const groupCard = page.getByTestId(/^teacher-group-/).first()
  const groupTestId = await groupCard.getAttribute("data-testid")
  const groupId = groupTestId?.replace("teacher-group-", "") ?? ""
  await page.getByTestId(`group-invite-btn-${groupId}`).click()
  await expect(page.getByTestId("invite-code-alert")).toBeVisible()
  const inviteCode = await page.getByTestId("invite-code-alert").innerText()
  const code = inviteCode.match(/[A-Z0-9]{6,}/)?.[0]
  expect(code).toBeTruthy()

  await page.goto("/teacher/assignment-sets")
  await page.getByTestId("assignment-set-name-input").fill("PW Set")
  await page.getByTestId("assignment-set-group-select").click()
  await page.getByRole("option", { name: "Playwright Group" }).click()
  await page.getByTestId("assignment-set-create-btn").click()
  await expect(page.getByTestId(/^teacher-assignment-set-/)).toBeVisible()

  const setCard = page.getByTestId(/^teacher-assignment-set-/).first()
  const setTestId = await setCard.getAttribute("data-testid")
  const setId = setTestId?.replace("teacher-assignment-set-", "") ?? ""
  await page.getByTestId(`assignment-set-add-task-${setId}`).fill("4")
  await page.getByTestId(`assignment-set-add-btn-${setId}`).click()
  await expect(setCard.getByText("Задача 4")).toBeVisible()

  await page.getByTestId("logout-btn").click()
  await expectLoggedOut(page)
  await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)

  await page.goto("/groups/join")
  await page.getByTestId("join-group-code-input").fill(code!)
  await page.getByTestId("join-group-btn").click()
  await expect(page.getByTestId(/^joined-group-/)).toBeVisible()

  await page.goto("/assignment-sets")
  await expect(page.getByTestId(/^assignment-set-/)).toBeVisible()
  await expect(page.getByText("PW Set")).toBeVisible()
  await expect(page.getByRole("link", { name: "Задача 4" })).toBeVisible()

  await page.getByTestId("logout-btn").click()
  await expectLoggedOut(page)
  await loginAs(page, DEV_USERS.teacher.email, DEV_USERS.teacher.password)
  await page.goto("/teacher/groups")
  await expect(page.getByTestId(`teacher-group-${groupId}`)).toBeVisible()
  await page.getByTestId(`group-dashboard-btn-${groupId}`).click()
  await expect(page.getByTestId("group-dashboard")).toBeVisible()
  await expect(page.getByTestId("group-dashboard-title")).toContainText("Playwright Group")
  await expect(page.getByTestId(/^dashboard-member-/)).toBeVisible()
  await expect(page.getByTestId(/^dashboard-student-/)).toBeVisible()
  await expect(page.getByTestId("dashboard-member-1")).toContainText(DEV_USERS.student.name)
})
