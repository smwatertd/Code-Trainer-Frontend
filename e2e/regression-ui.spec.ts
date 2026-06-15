import { test, expect } from "./fixtures/playwright"
import { DEV_USERS } from "./fixtures"
import { loginAs } from "./helpers"

test.describe("Regression: учебный трек", () => {
  test("пункт меню открывает каталог всех треков", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Учебные треки" }).click()
    await expect(page).toHaveURL(/\/learn$/)
    await expect(page.getByTestId("tracks-hub")).toBeVisible()
    await expect(page.getByTestId("track-card-python")).toBeVisible()
    await expect(page.getByTestId("track-card-pascal")).toBeVisible()
    await expect(page.getByTestId("track-card-cpp")).toBeVisible()
    await expect(page.getByTestId("track-card-java")).toBeVisible()
    await expect(page.getByTestId("track-card-csharp")).toBeVisible()
  })

  test("переключатель LangMini меняет Python ↔ Pascal", async ({ page }) => {
    await page.goto("/learn/pascal")
    await expect(page.getByRole("heading", { name: "Pascal", exact: true })).toBeVisible()

    await page.getByTestId("track-language-toggle").click()
    await page.getByTestId("track-language-python").click()

    await expect(page).toHaveURL(/\/learn\/python$/)
    await expect(page.getByRole("heading", { name: "Python", exact: true })).toBeVisible()
  })

  test("сборники показывают задачи, а не 0/0", async ({ page }) => {
    await page.goto("/learn/python")

    const progress = page.getByTestId("track-progress")
    await expect(progress).toBeVisible()
    await expect(progress).not.toHaveText("0/0")
    await expect(progress).toContainText("24")

    const firstChapter = page.locator(".chapter-card").first()
    await expect(firstChapter).toContainText(/\d+\/\d+/)
    await expect(firstChapter.getByText("Нет задач")).toHaveCount(0)
    await expect(firstChapter.getByRole("link", { name: "Открыть сборник" })).toBeVisible()
  })

  test("трек C++ доступен и содержит задачи", async ({ page }) => {
    await page.goto("/learn/cpp")
    await expect(page.getByRole("heading", { name: "C++", exact: true })).toBeVisible()
    await expect(page.getByTestId("track-progress")).toContainText("24")
    await expect(page.locator(".chapter-card").first().getByText("Нет задач")).toHaveCount(0)
  })
})

test.describe("Regression: группы преподавателя", () => {
  test("sidebar «Мои группы» ведёт в кабинет преподавателя", async ({ page }) => {
    await loginAs(page, DEV_USERS.teacher.email, DEV_USERS.teacher.password)
    await page.goto("/teacher/cabinet")

    await page.getByRole("link", { name: "Мои группы" }).first().click()
    await expect(page).toHaveURL(/\/teacher\/groups$/)
  })

  test("клик по карточке группы открывает дашборд с учениками", async ({ page }) => {
    await loginAs(page, DEV_USERS.teacher.email, DEV_USERS.teacher.password)

    await page.goto("/teacher/groups")
    await page.getByTestId("group-name-input").fill("Regression Group")
    await page.getByTestId("group-create-btn").click()

    const groupCard = page.getByTestId(/^teacher-group-/).first()
    const groupId = (await groupCard.getAttribute("data-testid"))?.replace("teacher-group-", "") ?? ""

    await page.getByTestId(`group-invite-btn-${groupId}`).click()
    const inviteText = await page.getByTestId("invite-code-alert").innerText()
    const code = inviteText.match(/[A-Z0-9]{6,}/)?.[0]
    expect(code).toBeTruthy()

    await page.getByTestId("logout-btn").click()
    await loginAs(page, DEV_USERS.student.email, DEV_USERS.student.password)
    await page.goto("/groups/join")
    await page.getByTestId("join-group-code-input").fill(code!)
    await page.getByTestId("join-group-btn").click()

    await page.getByTestId("logout-btn").click()
    await loginAs(page, DEV_USERS.teacher.email, DEV_USERS.teacher.password)
    await page.goto("/teacher/groups")

    await groupCard.click()
    await expect(page).toHaveURL(new RegExp(`/teacher/groups/${groupId}/dashboard`))
    await expect(page.getByTestId("group-dashboard")).toBeVisible()
    await expect(page.getByTestId(`dashboard-member-1`)).toContainText(DEV_USERS.student.name)
  })
})

test.describe("Regression: подсказки по конструкциям", () => {
  test("чип конструкции открывает popover с описанием", async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 })
    await page.goto("/tasks/1")

    await page.getByTestId("construction-chip-program_entry").click()
    const popover = page.getByTestId("construction-popover")
    await expect(popover).toBeVisible()
    await expect(popover).toContainText("Точка входа")
    await expect(popover).toContainText("program Hello")
  })
})

test.describe("Regression: языковая панель задачи", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 })
  })

  test("select отображает несколько языков для выбора", async ({ page }) => {
    await page.goto("/tasks/1")
    const knownOptions = page.getByTestId("known-language-select").locator("option")
    const learningOptions = page.getByTestId("learning-language-select").locator("option")

    await expect(knownOptions).toHaveCount(2)
    await expect(learningOptions.count()).resolves.toBeGreaterThanOrEqual(2)
  })

  test("кнопка swap меняет «Я знаю» и «Учу» местами", async ({ page }) => {
    await page.goto("/tasks/1")
    await expect(page.getByText(/Эталон · python/i)).toBeVisible()
    await expect(page.getByText("Учу · pascal")).toBeVisible()

    await page.getByTestId("language-swap-btn").click()

    await expect(page.getByText(/Эталон · pascal/i)).toBeVisible()
    await expect(page.getByText("Учу · python")).toBeVisible()
  })

  test("кнопка swap активна когда языки разные", async ({ page }) => {
    await page.goto("/tasks/1")
    await expect(page.getByTestId("language-swap-btn")).toBeEnabled()
  })

  test("swap обновляет код в «Учу» для debug translation (task 2)", async ({ page }) => {
    await page.goto("/tasks/2")
    await page.getByTestId("known-language-select").selectOption("python")
    await expect(page.getByText(/Эталон · python/i)).toBeVisible()
    await expect(page.getByText("Учу · pascal")).toBeVisible()

    const editor = page.getByTestId("task-learning-editor")
    await expect(editor).toContainText("writeln")

    await page.getByTestId("language-swap-btn").click()
    await expect(page.getByText("Учу · python")).toBeVisible()
    await expect(editor).toContainText("input()")
    await expect(editor).not.toContainText("writeln(age)")

    await page.getByTestId("language-swap-btn").click()
    await expect(page.getByText("Учу · pascal")).toBeVisible()
    await expect(editor).toContainText("writeln")
  })

  test("swap на task 6 оставляет пустой редактор для чистого перевода", async ({ page }) => {
    await page.goto("/tasks/6")
    await expect(page.getByText(/Эталон · python/i)).toBeVisible()
    await expect(page.getByText("Учу · pascal")).toBeVisible()
    await expect(page.getByText("Перевод программы")).toBeVisible()

    const editor = page.getByTestId("task-learning-editor")
    await expect(editor).toBeVisible()
    await expect(editor.getByText("a = int(input())")).toHaveCount(0)

    await page.getByTestId("language-swap-btn").click()
    await expect(page.getByText(/Эталон · pascal/i)).toBeVisible()
    await expect(page.getByText("Учу · python")).toBeVisible()
    await expect(editor.getByText("a = int(input())")).toHaveCount(0)
    await expect(editor.getByText("print(a, b)")).toHaveCount(0)

    await page.getByTestId("language-swap-btn").click()
    await expect(page.getByText("Учу · pascal")).toBeVisible()
    await expect(editor.getByText("writeln")).toHaveCount(0)
  })

  test("swap на task 4 показывает python-блоки, а не пустой редактор", async ({ page }) => {
    await page.goto("/tasks/4")
    await expect(page.getByTestId("block-reorder-row-0")).toBeVisible()
    await expect(page.getByTestId("block-reorder-row-6")).toBeVisible()

    await page.getByTestId("language-swap-btn").click()
    await expect(page.getByText(/Эталон · pascal/i)).toBeVisible()
    await expect(page.getByText("Учу · python")).toBeVisible()
    await expect(page.getByTestId("task-learning-code-editor")).toHaveCount(0)
    await expect(page.getByTestId("block-task-editor")).toBeVisible()
    await expect(page.getByTestId("block-reorder-row-0")).toBeVisible()
    await expect(page.getByTestId("block-reorder-row-2")).toBeVisible()
    await expect(page.getByTestId("block-task-editor")).toContainText("input")

    await page.getByTestId("language-swap-btn").click()
    await expect(page.getByText("Учу · pascal")).toBeVisible()
    await expect(page.getByTestId("block-reorder-row-0")).toBeVisible()
    await expect(page.getByTestId("block-reorder-row-6")).toBeVisible()
  })

  test("swap на task 1 сохраняет блоки pascal после обратного swap", async ({ page }) => {
    await page.goto("/tasks/1")
    await expect(page.getByTestId("block-reorder-row-0")).toBeVisible()
    await expect(page.getByTestId("block-reorder-row-3")).toBeVisible()

    await page.getByTestId("language-swap-btn").click()
    await expect(page.getByText("Учу · python")).toBeVisible()
    await expect(page.getByTestId("block-task-editor")).toBeVisible()
    await expect(page.getByTestId("block-reorder-row-0")).toBeVisible()
    await expect(page.getByTestId("block-task-editor")).toContainText("print")

    await page.getByTestId("language-swap-btn").click()
    await expect(page.getByText("Учу · pascal")).toBeVisible()
    await expect(page.getByTestId("block-reorder-row-0")).toBeVisible()
    await expect(page.getByTestId("block-reorder-row-3")).toBeVisible()
  })
})
