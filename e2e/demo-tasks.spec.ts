import { test } from "./fixtures/playwright"
import {
  solveBlockTask1Hello,
  solveBlockTask10Minutes,
  solveBlockTask4Area,
  solveBlockTask7Average,
  solveFixTask2Age,
  solveFixTask5Perimeter,
  solveFixTask8LastDigit,
  solveTranslationTask3Sum,
  solveTranslationTask6Swap,
  solveTranslationTask9DigitSum,
} from "./helpers"

test("demo task 1 block hello", async ({ page }) => {
  await solveBlockTask1Hello(page)
})

test("demo task 2 fix age", async ({ page }) => {
  await solveFixTask2Age(page)
})

test("demo task 3 translation sum", async ({ page }) => {
  await solveTranslationTask3Sum(page)
})

test("demo task 4 block area", async ({ page }) => {
  await solveBlockTask4Area(page)
})

test("demo task 5 fix perimeter", async ({ page }) => {
  await solveFixTask5Perimeter(page)
})

test("demo task 6 translation swap", async ({ page }) => {
  await solveTranslationTask6Swap(page)
})

test("demo task 7 block average", async ({ page }) => {
  await solveBlockTask7Average(page)
})

test("demo task 8 fix last digit", async ({ page }) => {
  await solveFixTask8LastDigit(page)
})

test("demo task 9 translation digit sum", async ({ page }) => {
  await solveTranslationTask9DigitSum(page)
})

test("demo task 10 block minutes to hours", async ({ page }) => {
  await solveBlockTask10Minutes(page)
})
