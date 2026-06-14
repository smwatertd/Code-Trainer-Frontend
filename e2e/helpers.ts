import { expect, type Page } from "@playwright/test"

/** Swap block reorder task to correct order [1, 0] from default [0, 1]. */
export async function solveBlockReorderTask2(page: Page): Promise<void> {
  await page.getByTestId("block-move-down-0").click()
  await clickCheckAndExpectSuccess(page)
}

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}@e2e.example.com`
}

export async function loginAs(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/login")
  if (await page.getByTestId("logout-btn").isVisible()) {
    await page.getByTestId("logout-btn").click()
    await expect(page.getByRole("banner").getByRole("link", { name: "Войти" })).toBeVisible()
    await page.goto("/login")
  }
  await expect(page.getByLabel("Email")).toBeVisible({ timeout: 8_000 })
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Пароль").fill(password)
  await page.getByRole("main").getByRole("button", { name: "Войти" }).click()
  await expect(page.getByTestId("user-info")).toBeVisible({ timeout: 8_000 })
}

export async function selectLanguage(page: Page, language: string): Promise<void> {
  await page.getByTestId("language-select").click()
  await page.getByRole("option", { name: new RegExp(language, "i") }).click()
}

export async function fillCodeEditor(page: Page, code: string): Promise<void> {
  const editor = page.locator(".monaco-editor").first()
  await editor.click()
  await page.keyboard.press("ControlOrMeta+A")
  await page.keyboard.insertText(code)
}

export async function clearFlowchart(page: Page): Promise<void> {
  await page.getByTestId("flowchart-template-clear").click()
}

export async function clickCheckAndExpectSuccess(page: Page): Promise<void> {
  await page.getByTestId("task-check-btn").click()
  await expect(page.getByTestId("result-success-badge")).toHaveText("Успех", {
    timeout: 8_000,
  })
}

export async function openTask(page: Page, taskId: number): Promise<void> {
  await page.goto(`/tasks/${taskId}`)
  await expect(page.getByTestId("task-check-btn")).toBeVisible({ timeout: 8_000 })
}
