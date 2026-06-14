import { test } from "./fixtures/playwright"
import { SOLUTIONS } from "./fixtures"
import {
  clickCheckAndExpectSuccess,
  fillCodeEditor,
  openTask,
  selectLanguage,
  solveBlockReorderTask2,
} from "./helpers"

test("demo task 1 translation (python)", async ({ page }) => {
  await openTask(page, 1)
  await selectLanguage(page, "python")
  await fillCodeEditor(page, SOLUTIONS.task1Python)
  await clickCheckAndExpectSuccess(page)
})

test("demo task 2 block reorder", async ({ page }) => {
  await openTask(page, 2)
  await solveBlockReorderTask2(page)
})

test("demo task 3 flowchart if/else", async ({ page }) => {
  await openTask(page, 3)
  await clickCheckAndExpectSuccess(page)
})

test("demo task 4 translation with for-loop", async ({ page }) => {
  await openTask(page, 4)
  await fillCodeEditor(page, SOLUTIONS.task4ForLoop)
  await clickCheckAndExpectSuccess(page)
})

test("demo task 5 block reorder with runtime check", async ({ page }) => {
  await openTask(page, 5)
  await clickCheckAndExpectSuccess(page)
})

test("demo task 6 flowchart hello with runtime check", async ({ page }) => {
  await openTask(page, 6)
  await clickCheckAndExpectSuccess(page)
})

test("demo task 7 C++ for-loop snippet", async ({ page }) => {
  await openTask(page, 7)
  await fillCodeEditor(page, SOLUTIONS.task7CppSnippet)
  await clickCheckAndExpectSuccess(page)
})

test("demo task 8 Pascal for-loop snippet", async ({ page }) => {
  await openTask(page, 8)
  await fillCodeEditor(page, SOLUTIONS.task8PascalSnippet)
  await clickCheckAndExpectSuccess(page)
})

test("demo task 9 C++ compile and run", async ({ page }) => {
  await openTask(page, 9)
  await fillCodeEditor(page, SOLUTIONS.task9CppCompiled)
  await clickCheckAndExpectSuccess(page)
})

test("demo task 10 Pascal compile and run", async ({ page }) => {
  await openTask(page, 10)
  await fillCodeEditor(page, SOLUTIONS.task10PascalCompiled)
  await clickCheckAndExpectSuccess(page)
})
