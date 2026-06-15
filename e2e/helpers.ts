import { expect, type Page } from "@playwright/test"
import { SOLUTIONS } from "./fixtures"

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}@e2e.example.com`
}

/** После logout: ссылка «Войти» видна, профиль скрыт. */
export async function expectLoggedOut(page: Page): Promise<void> {
  await expect(page.getByTestId("user-info")).toHaveCount(0)
  await expect(page.getByRole("link", { name: "Войти" }).first()).toBeVisible()
}

export async function loginAs(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/login")
  if (await page.getByTestId("logout-btn").isVisible()) {
    await page.getByTestId("logout-btn").click()
    await page.goto("/login")
  }
  await expect(page.getByLabel("Email")).toBeVisible({ timeout: 8_000 })
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Пароль").fill(password)
  await page.getByRole("button", { name: "Войти" }).click()
  await expect(page.getByTestId("user-info")).toBeVisible({ timeout: 8_000 })
}

export async function fillCodeEditor(page: Page, code: string): Promise<void> {
  await page.setViewportSize({ width: 1400, height: 900 })
  const editorRoot = page.getByTestId("task-learning-editor")
  await expect(editorRoot).toBeVisible({ timeout: 10_000 })
  await expect(editorRoot.getByText("Загрузка редактора…")).toHaveCount(0, { timeout: 20_000 })

  const editor = editorRoot.locator(".monaco-editor .view-lines")
  await editor.waitFor({ state: "visible", timeout: 20_000 })
  await editor.click()
  await page.keyboard.press("ControlOrMeta+A")
  await page.keyboard.insertText(code)
}

export async function clickCheckAndExpectSuccess(page: Page): Promise<void> {
  await page.getByTestId("task-check-btn").click()
  await expect
    .poll(async () => {
      const texts = await page.getByText(/Пройдено \d+ из \d+/).allTextContents()
      return texts.some((text) => {
        const match = text.match(/Пройдено (\d+) из (\d+)/)
        return Boolean(match && match[1] === match[2] && match[1] !== "0")
      })
    })
    .toBe(true)
}

export async function openTask(page: Page, taskId: number): Promise<void> {
  await page.setViewportSize({ width: 1400, height: 900 })
  await page.goto(`/tasks/${taskId}`)
  await expect(page.getByTestId("task-check-btn")).toBeVisible({ timeout: 15_000 })
}

/** Задача 1 — блоки Hello, порядок по умолчанию верный. */
export async function solveBlockTask1Hello(page: Page): Promise<void> {
  await openTask(page, 1)
  await clickCheckAndExpectSuccess(page)
}

/** Задача 2 — починить чтение возраста. */
export async function solveFixTask2Age(page: Page): Promise<void> {
  await openTask(page, 2)
  await fillCodeEditor(page, SOLUTIONS.task2AgeFix)
  await clickCheckAndExpectSuccess(page)
}

/** Задача 3 — перевод суммы двух чисел на Pascal. */
export async function solveTranslationTask3Sum(page: Page): Promise<void> {
  await openTask(page, 3)
  await fillCodeEditor(page, SOLUTIONS.task3SumPascal)
  await clickCheckAndExpectSuccess(page)
}

/** Задача 4 — блоки площади, порядок по умолчанию верный. */
export async function solveBlockTask4Area(page: Page): Promise<void> {
  await openTask(page, 4)
  await clickCheckAndExpectSuccess(page)
}

/** Задача 5 — починить формулу периметра. */
export async function solveFixTask5Perimeter(page: Page): Promise<void> {
  await openTask(page, 5)
  await fillCodeEditor(page, SOLUTIONS.task5PerimeterFix)
  await clickCheckAndExpectSuccess(page)
}

/** Задача 6 — перевод swap на Pascal. */
export async function solveTranslationTask6Swap(page: Page): Promise<void> {
  await openTask(page, 6)
  await fillCodeEditor(page, SOLUTIONS.task6SwapPascal)
  await clickCheckAndExpectSuccess(page)
}

/** Задача 7 — блоки среднего, порядок по умолчанию верный. */
export async function solveBlockTask7Average(page: Page): Promise<void> {
  await openTask(page, 7)
  await clickCheckAndExpectSuccess(page)
}

/** Задача 8 — починить last digit. */
export async function solveFixTask8LastDigit(page: Page): Promise<void> {
  await openTask(page, 8)
  await fillCodeEditor(page, SOLUTIONS.task8LastDigitFix)
  await clickCheckAndExpectSuccess(page)
}

/** Задача 9 — перевод суммы цифр на Pascal. */
export async function solveTranslationTask9DigitSum(page: Page): Promise<void> {
  await openTask(page, 9)
  await fillCodeEditor(page, SOLUTIONS.task9DigitSumPascal)
  await clickCheckAndExpectSuccess(page)
}

/** Задача 10 — блоки минут→часы, порядок по умолчанию верный. */
export async function solveBlockTask10Minutes(page: Page): Promise<void> {
  await openTask(page, 10)
  await clickCheckAndExpectSuccess(page)
}
