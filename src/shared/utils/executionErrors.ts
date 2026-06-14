type ExecutionIssueLike = Record<string, unknown>

export type FormattedExecutionIssue = {
  summary: string
  detail?: string
}

const IGNORABLE_MESSAGES = [
  /^all checks passed!?$/i,
  /^found \d+ errors?\.?$/i,
  /^no issues found\.?$/i,
  /^\[\*\]\s+\d+\s+fixable with the [`']--fix[`'] option\.?$/i,
  /^Free Pascal Compiler version\b/i,
  /^Copyright \(c\)/i,
  /^Fatal: Compilation aborted\b/i,
  /^Fatal: There were \d+ errors compiling module\b/i,
  /\.pas\(\d+(?:,\d+)?\)\s*Fatal: There were \d+ errors compiling module\b/i,
  /^Error: \/usr\/bin\/\w+ returned an error exitcode\b/i,
]

const INFRASTRUCTURE_PATTERNS = [
  /docker command failed/i,
  /command failed with exit code/i,
  /docker is not available/i,
  /^Command '\[/i,
  /timed out after \d+ seconds?/i,
  /\/usr\/bin\/docker/i,
  /CT_WORKSPACE/i,
  /base64 -d/i,
  /runner_[a-z0-9_]+/i,
]

export function isInfrastructureMessage(text: string): boolean {
  const normalized = text.trim()
  if (!normalized) return false
  return INFRASTRUCTURE_PATTERNS.some((pattern) => pattern.test(normalized))
}

function localizeKnownStudentMessage(message: string): string | null {
  const normalized = message.trim()
  if (!normalized) return null

  const direct = STUDENT_ERROR_MESSAGES[normalized]
  if (direct) return direct

  const lower = normalized.toLowerCase()
  for (const [source, translated] of Object.entries(STUDENT_ERROR_MESSAGES)) {
    if (source.toLowerCase() === lower) return translated
  }

  const timeLimitMatch = normalized.match(/^time limit exceeded \((\d+(?:\.\d+)?)s\)$/i)
  if (timeLimitMatch) {
    return `Превышен лимит времени выполнения (${timeLimitMatch[1]} с).`
  }

  return null
}

function studentSafeDetail(detail?: string): string | undefined {
  if (!detail) return undefined
  const sanitized = sanitizeExecutionPaths(detail)
  if (isInfrastructureMessage(sanitized)) return undefined
  return sanitized
}

const CATEGORY_FALLBACK: Record<string, string> = {
  COMPILER: "Не удалось скомпилировать программу.",
  LINTER: "Код не прошёл проверку линтера.",
  CONSTRUCTION: "В решении не хватает требуемых конструкций.",
  PATTERN: "В решении не хватает требуемых конструкций.",
  VALIDATION: "Решение не прошло проверку.",
  SEMANTIC: "Программа не прошла проверку на тестах.",
  EXECUTION: "Не удалось выполнить проверку.",
  INTERNAL_ERROR: "Не удалось выполнить проверку.",
}

const STUDENT_ERROR_MESSAGES: Record<string, string> = {
  "Blocks are in the wrong order": "Блоки расставлены в неверном порядке.",
  "Block order cannot be empty": "Укажите порядок блоков.",
  "Block indices must be non-negative": "Индексы блоков не могут быть отрицательными.",
  "Block order length does not match blocks count": "Число блоков не совпадает с заданием.",
  "Block index is out of range": "Индекс блока выходит за пределы списка.",
  "Assembled code is required": "Соберите программу из блоков.",
  "Assembled code does not match expected result":
    "Собранный код не совпадает с выбранным порядком блоков.",
  "Incorrect output": "Неверный вывод программы.",
  "Incorrect output for expected test cases": "Программа не прошла проверку на тестах.",
  "Compilation failed": "Ошибка компиляции.",
  "Compiled binary was not produced": "Исполняемый файл не был создан после компиляции.",
  "Test output markers were not found": "Не удалось прочитать результат выполнения теста.",
}

const FLOW_STUDENT_MESSAGES: Record<string, string> = {
  FLOW_SEQUENCE_MISMATCH:
    "Проверьте общий порядок схемы: выполнение должно идти от начала к завершению без пропусков.",
  FLOW_TEXT_MISMATCH:
    "Некоторые блоки не соответствуют операциям в коде. Сравните текст блоков с программой.",
  FLOW_SOURCE_MISMATCH:
    "Текст одного или нескольких блоков не совпадает с программой слева.",
  FLOW_CONSTRUCTION_MISSING: "В коде есть конструкция, которую нужно отразить на схеме.",
  FLOW_LOOP_BACK_EDGE:
    "Для цикла нужна связь, которая возвращает выполнение к следующей итерации.",
  FLOW_EMPTY: "Схема пуста. Добавьте блоки и соедините их.",
  FLOW_START_MISSING: "Схема должна содержать блок «Начало».",
  FLOW_END_MISSING: "Схема должна содержать блок «Конец».",
  FLOW_DISCONNECTED: "На схеме есть блоки, не связанные с основным потоком выполнения.",
  FLOW_END_UNREACHABLE: "Блок «Конец» недостижим из блока «Начало».",
  FLOW_DECISION_BRANCHES: "У блока условия должны быть обе ветви: «да» и «нет».",
  FLOW_DEAD_END: "На схеме есть тупиковая ветка без выхода к завершению.",
}

const LINTER_HINTS: Record<string, string> = {
  "single quotes found but double quotes preferred":
    "используйте двойные кавычки вместо одинарных",
  "no newline at end of file": "добавьте пустую строку в конец файла",
}

const COMPILER_MESSAGE_RULES: Array<{
  pattern: RegExp
  format: (match: RegExpMatchArray) => string
}> = [
  {
    pattern: /['"](.+?)['"] is not a member of ['"](.+?)['"]/i,
    format: ([, name, scope]) => `«${name}» не является членом ${scope}`,
  },
  {
    pattern: /was not declared in this scope/i,
    format: () => "имя не объявлено в этой области видимости",
  },
  {
    pattern: /expected ['"];['"] before/i,
    format: () => "ожидается точка с запятой",
  },
  {
    pattern: /expected ['"];['"]/i,
    format: () => "ожидается точка с запятой",
  },
  {
    pattern: /no matching function for call/i,
    format: () => "нет подходящей функции для этого вызова",
  },
  {
    pattern: /cannot convert/i,
    format: () => "невозможно преобразовать типы",
  },
  {
    pattern: /undefined reference to [`'](.+?)[`']/i,
    format: ([, symbol]) => `не найдено определение «${symbol}»`,
  },
  {
    pattern: /incompatible types/i,
    format: () => "несовместимые типы",
  },
  {
    pattern: /redefinition of/i,
    format: () => "повторное объявление",
  },
  {
    pattern: /invalid operands/i,
    format: () => "недопустимые операнды для оператора",
  },
  {
    pattern: /identifier not found ["'](.+?)["']/i,
    format: ([, name]) => `не найден идентификатор «${name}»`,
  },
  {
    pattern: /syntax error,\s*["'](.+?)["']\s+expected but\s+["'](.+?)["']\s+found/i,
    format: ([, expected, actual]) => `ожидалось «${expected}», но найдено «${actual}»`,
  },
  {
    pattern: /wrong number of parameters/i,
    format: () => "неверное число параметров",
  },
  {
    pattern: /incompatible types:\s*(.+)$/i,
    format: ([, detail]) => `несовместимые типы: ${detail}`,
  },
  {
    pattern: /duplicate identifier\s+["'](.+?)["']/i,
    format: ([, name]) => `повторное объявление «${name}»`,
  },
  {
    pattern: /cannot find symbol/i,
    format: () => "не найден символ",
  },
  {
    pattern: /class .+ is public, should be declared in a file named/i,
    format: () => "имя класса должно совпадать с именем файла",
  },
  {
    pattern: /unclosed delimiter/i,
    format: () => "не закрыта скобка или кавычка",
  },
  {
    pattern: /invalid syntax/i,
    format: () => "синтаксическая ошибка",
  },
  {
    pattern: /indentationerror/i,
    format: () => "ошибка отступов",
  },
  {
    pattern: /nameerror: name ['"](.+?)['"] is not defined/i,
    format: ([, name]) => `имя «${name}» не определено`,
  },
  {
    pattern: /typeerror:/i,
    format: () => "ошибка типов",
  },
  {
    pattern: /incorrect output/i,
    format: () => "программа выдала неверный результат",
  },
  {
    pattern: /local compile is not configured for language/i,
    format: () => "компилятор для этого языка не настроен на сервере",
  },
  {
    pattern: /компилятор ['"](.+?)['"] не установлен на сервере/i,
    format: ([, name]) => `компилятор ${name} не установлен на сервере`,
  },
  {
    pattern: /time limit exceeded/i,
    format: () => "превышен лимит времени выполнения",
  },
  {
    pattern: /timed out after \d+ seconds?/i,
    format: () => "превышен лимит времени выполнения",
  },
]

const SOLUTION_PATH = String.raw`/(?:.*\/)?solution\.[a-z0-9]+`

const PRIMARY_ERROR_LINE = new RegExp(
  String.raw`^${SOLUTION_PATH}:\d+(?::\d+)?:\s*(?:fatal error|error):`,
  "i",
)
const PRIMARY_JAVA_ERROR = new RegExp(String.raw`^${SOLUTION_PATH}:\d+:\s*error:`, "i")
const PRIMARY_PASCAL_ERROR =
  /^(?:(?:.*\/)?(?:solution|source)\.pas|код)\(\d+(?:,\d+)?\)\s*(?:Fatal:\s*)?Error:/i
const PRIMARY_PYTHON_ERROR = /^File ".*?solution\.py", line \d+/i
const PRIMARY_PYTHON_EXCEPTION = /^(SyntaxError|IndentationError|NameError|TypeError|ValueError):/i

function isIgnorableMessage(text: string): boolean {
  const line = text.trim()
  if (!line) return true
  return IGNORABLE_MESSAGES.some((pattern) => pattern.test(line))
}

export function sanitizeExecutionPaths(text: string): string {
  return text
    .replace(/\/(?:.*\/)?solution\.[a-z0-9]+/gi, "код")
    .replace(/\/(?:.*\/)?source\.[a-z0-9]+/gi, "код")
    .replace(/(?:\/tmp\/[^\s/]+\/)?solution\.[a-z0-9]+/gi, "код")
    .replace(/(?:\/tmp\/[^\s/]+\/)?source\.[a-z0-9]+/gi, "код")
    .replace(/\/tmp\/[^\s/]+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
}

function localizeLinterHint(message: string): string {
  const normalized = message.trim().replace(/\s+/g, " ")
  const translated = LINTER_HINTS[normalized.toLowerCase()]
  return translated ?? normalized
}

export function humanizeCompilerMessage(message: string): string {
  const normalized = message.trim().replace(/\s+/g, " ")
  for (const rule of COMPILER_MESSAGE_RULES) {
    const match = normalized.match(rule.pattern)
    if (match) return rule.format(match)
  }
  return normalized
}

function extractIncludeHint(noteLine: string): string | null {
  const includeMatch = noteLine.match(/adding ['"]#include\s*<([^>]+)>['"]/i)
  if (includeMatch) {
    return `Подсказка: добавьте строку #include <${includeMatch[1]}>`
  }
  const importMatch = noteLine.match(/adding ['"]import\s+([^'"]+)['"]/i)
  if (importMatch) {
    return `Подсказка: добавьте import ${importMatch[1]}`
  }
  return null
}

type ParsedCompilerError = {
  line?: string
  column?: string
  message: string
}

function parseCompilerPrimary(line: string): ParsedCompilerError | null {
  const gccMatch = line.match(
    new RegExp(
      String.raw`^${SOLUTION_PATH}:(\d+):(\d+):\s*(?:fatal error|error|warning):\s*(.+)$`,
      "i",
    ),
  )
  if (gccMatch) {
    return { line: gccMatch[1], column: gccMatch[2], message: gccMatch[3] }
  }

  const gccNoColumn = line.match(
    new RegExp(String.raw`^${SOLUTION_PATH}:(\d+):\s*(?:fatal error|error|warning):\s*(.+)$`, "i"),
  )
  if (gccNoColumn) {
    return { line: gccNoColumn[1], message: gccNoColumn[2] }
  }

  const javaMatch = line.match(
    new RegExp(String.raw`^${SOLUTION_PATH}:(\d+):\s*error:\s*(.+)$`, "i"),
  )
  if (javaMatch) {
    return { line: javaMatch[1], message: javaMatch[2] }
  }

  const pythonFileMatch = line.match(/^File ".*?solution\.py", line (\d+)/i)
  if (pythonFileMatch) {
    return { line: pythonFileMatch[1], message: "синтаксическая ошибка" }
  }

  const pythonException = line.match(/^(SyntaxError|IndentationError|NameError|TypeError|ValueError):\s*(.*)$/i)
  if (pythonException) {
    return { message: `${pythonException[1]}: ${pythonException[2]}`.trim() }
  }

  const pascalMatch = line.match(
    /^(?:код|(?:solution|source)\.pas)\((\d+)(?:,(\d+))?\)\s*(?:Fatal:\s*)?Error:\s*(.+)$/i,
  )
  if (pascalMatch) {
    return { line: pascalMatch[1], column: pascalMatch[2], message: pascalMatch[3] }
  }

  const pascalRawMatch = line.match(
    /^(?:(?:.*\/)?(?:solution|source)\.pas)\((\d+)(?:,(\d+))?\)\s*(?:Fatal:\s*)?Error:\s*(.+)$/i,
  )
  if (pascalRawMatch) {
    return { line: pascalRawMatch[1], column: pascalRawMatch[2], message: pascalRawMatch[3] }
  }

  return null
}

function normalizeDiagnosticLine(text: string): string {
  return text.replace(/\s+$/, "")
}

function isContinuationLine(line: string): boolean {
  return (
    /^\d+\s+\|/.test(line) ||
    /^\s*\|\s+[~^]+/.test(line) ||
    /^\+\+\+/.test(line) ||
    new RegExp(String.raw`^${SOLUTION_PATH}:\d+(?::\d+)?:\s*note:`, "i").test(line) ||
    new RegExp(String.raw`^${SOLUTION_PATH}: In function`, "i").test(line) ||
    /^compilation terminated\./i.test(line)
  )
}

function isPrimaryErrorLine(line: string): boolean {
  return (
    PRIMARY_ERROR_LINE.test(line) ||
    PRIMARY_JAVA_ERROR.test(line) ||
    PRIMARY_PASCAL_ERROR.test(line) ||
    PRIMARY_PYTHON_ERROR.test(line) ||
    PRIMARY_PYTHON_EXCEPTION.test(line)
  )
}

function groupCompilerLines(lines: string[]): string[][] {
  const groups: string[][] = []
  let current: string[] = []
  let pendingContext: string[] = []

  for (const line of lines) {
    if (new RegExp(String.raw`^${SOLUTION_PATH}: In function`, "i").test(line)) {
      pendingContext = [line]
      continue
    }

    if (isPrimaryErrorLine(line)) {
      if (current.length) groups.push(current)
      current = [...pendingContext, line]
      pendingContext = []
      continue
    }

    if (current.length && isContinuationLine(line)) {
      current.push(line)
      continue
    }

    if (current.length) {
      groups.push(current)
      current = []
    }

    if (!isIgnorableMessage(line)) {
      groups.push([line])
    }
  }

  if (current.length) groups.push(current)
  return groups
}

function formatLocation(parsed: ParsedCompilerError): string {
  if (!parsed.line) return ""
  const columnPart = parsed.column ? `, колонка ${parsed.column}` : ""
  return `Строка ${parsed.line}${columnPart}: `
}

function formatCompilerGroup(lines: string[], category: string): FormattedExecutionIssue {
  const primary =
    lines.find(
      (line) =>
        /:\s*error:/i.test(line) ||
        PRIMARY_PASCAL_ERROR.test(line) ||
        PRIMARY_PYTHON_EXCEPTION.test(line),
    ) ?? lines[0]
  const parsed = parseCompilerPrimary(primary)
  const noteLine = lines.find((line) => /:\s*note:/i.test(line))
  const includeHint = noteLine ? extractIncludeHint(noteLine) : null

  if (parsed) {
    const humanized = humanizeCompilerMessage(parsed.message)
    let summary = `${formatLocation(parsed)}${humanizeCompilerMessage(parsed.message)}`
    if (includeHint) {
      summary = `${summary}. ${includeHint}`
    }

    const detailLines = lines.filter((line) => line !== primary && line !== noteLine)
    const detail = detailLines.length ? studentSafeDetail(detailLines.join("\n")) : undefined

    if (humanized === parsed.message && !includeHint && lines.length > 1) {
      return {
        summary: CATEGORY_FALLBACK[category] ?? CATEGORY_FALLBACK.COMPILER,
        detail: studentSafeDetail(sanitizeExecutionPaths(lines.join("\n"))),
      }
    }

    return detail ? { summary, detail } : { summary }
  }

  const sanitized = sanitizeExecutionPaths(lines.join("\n"))
  if (isStudentFriendlyText(sanitized)) {
    return { summary: sanitized }
  }

  const humanizedSingle = humanizeCompilerMessage(sanitized)
  if (humanizedSingle !== sanitized && lines.length === 1) {
    return { summary: humanizedSingle }
  }

  if (isInfrastructureMessage(sanitized)) {
    return { summary: CATEGORY_FALLBACK[category] ?? CATEGORY_FALLBACK.COMPILER }
  }

  return {
    summary: CATEGORY_FALLBACK[category] ?? "Обнаружена ошибка при проверке решения.",
    detail: studentSafeDetail(sanitized),
  }
}

function isStudentFriendlyText(text: string): boolean {
  if (/[а-яё]/i.test(text)) return true
  return (
    text.startsWith("Отсутствует конструкция:") ||
    text.startsWith("Блок #") ||
    text.startsWith("Схема ") ||
    text.startsWith("Не удалось разобрать код")
  )
}

function formatStructuredIssue(item: ExecutionIssueLike): FormattedExecutionIssue | null {
  const type = String(item.type ?? "").toUpperCase()
  const raw = String(item.text ?? item.message ?? "").trim()
  if (!raw || isIgnorableMessage(raw)) return null

  if (isInfrastructureMessage(raw)) {
    return {
      summary: CATEGORY_FALLBACK[type] ?? CATEGORY_FALLBACK.COMPILER,
    }
  }

  if (FLOW_STUDENT_MESSAGES[type]) {
    const summary = raw && raw !== type ? raw : FLOW_STUDENT_MESSAGES[type]
    const detailRaw = item.detail ?? item.hint
    const detail =
      typeof detailRaw === "string" && detailRaw.trim() ? studentSafeDetail(detailRaw.trim()) : undefined
    return { summary, detail }
  }

  if (isStudentFriendlyText(raw)) {
    return { summary: raw }
  }

  const knownMessage = localizeKnownStudentMessage(raw)
  if (knownMessage) {
    return { summary: knownMessage }
  }

  if (type === "LINTER") {
    const formatted = humanizeDiagnosticLine(raw)
    if (formatted !== sanitizeExecutionPaths(raw)) {
      return { summary: formatted }
    }
    return {
      summary: CATEGORY_FALLBACK.LINTER,
      detail: sanitizeExecutionPaths(raw),
    }
  }

  if (type === "CONSTRUCTION" || type === "PATTERN") {
    return { summary: raw }
  }

  if (type === "VALIDATION" || type === "SEMANTIC" || type === "EXECUTION" || type === "INTERNAL_ERROR") {
    if (raw.includes("\n") || /^traceback/i.test(raw)) {
      return {
        summary: CATEGORY_FALLBACK[type] ?? CATEGORY_FALLBACK.EXECUTION,
        detail: studentSafeDetail(raw),
      }
    }
    const humanized = humanizeCompilerMessage(raw)
    if (humanized !== raw) {
      return { summary: humanized }
    }
    return {
      summary: CATEGORY_FALLBACK[type] ?? CATEGORY_FALLBACK.EXECUTION,
      detail: studentSafeDetail(raw),
    }
  }

  const humanized = humanizeCompilerMessage(raw)
  if (humanized !== raw) {
    return { summary: humanized }
  }

  return {
    summary: CATEGORY_FALLBACK[type] ?? CATEGORY_FALLBACK.COMPILER,
    detail: studentSafeDetail(raw),
  }
}

function humanizeDiagnosticLine(raw: string): string {
  const trimmed = raw.trim()

  const ruffMatch = trimmed.match(
    /^(?:\/tmp\/[^\s/]+\/)?solution\.py:(\d+):(\d+):\s*(?:[A-Z]\d+\s+)?(?:\[\*\]\s*)?(.+)$/i,
  )
  if (ruffMatch) {
    const [, line, column, message] = ruffMatch
    return `Строка ${line}, колонка ${column}: ${localizeLinterHint(message)}`
  }

  const locationMatch = trimmed.match(/^(?:\/tmp\/[^\s/]+\/)?solution\.py:(\d+)(?::(\d+))?:\s*(.+)$/i)
  if (locationMatch) {
    const [, line, column, message] = locationMatch
    const columnPart = column ? `, колонка ${column}` : ""
    return `Строка ${line}${columnPart}: ${localizeLinterHint(message)}`
  }

  return sanitizeExecutionPaths(trimmed)
}

function formatCompilerIssues(
  items: ExecutionIssueLike[],
  category: string,
): FormattedExecutionIssue[] {
  const lines = items
    .map((item) => normalizeDiagnosticLine(String(item.text ?? item.message ?? "")))
    .filter((line) => line && !isIgnorableMessage(line))

  const groups = groupCompilerLines(lines)
  if (!groups.length) return []

  const formatted = groups.map((group) => formatCompilerGroup(group, category))
  const seen = new Set<string>()
  return formatted.filter((issue) => {
    const key = `${issue.summary}\n${issue.detail ?? ""}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function formatExecutionIssue(item: ExecutionIssueLike): FormattedExecutionIssue | null {
  const type = String(item.type ?? "").toUpperCase()
  if (type === "COMPILER") {
    const [first] = formatCompilerIssues([item], type)
    return first ?? null
  }
  return formatStructuredIssue(item)
}

export function resolveCheckErrorsSectionTitle(items: ExecutionIssueLike[] = []): string {
  if (!items.length) return "Ошибки проверки"

  const types = new Set(items.map((item) => String(item.type ?? "").toUpperCase()))
  if (types.size === 1) {
    const [only] = types
    if (only === "COMPILER") return "Ошибки компиляции"
    if (only === "VALIDATION") return "Ошибки проверки"
    if (only === "SEMANTIC") return "Ошибки тестов"
    if (only === "EXECUTION" || only === "INTERNAL_ERROR") return "Ошибки выполнения"
  }

  if (types.has("COMPILER") && !types.has("VALIDATION") && !types.has("SEMANTIC")) {
    return "Ошибки компиляции"
  }

  return "Ошибки проверки"
}

export function formatExecutionIssues(items: ExecutionIssueLike[] = []): FormattedExecutionIssue[] {
  if (!items.length) return []

  const category = String(items[0]?.type ?? "").toUpperCase()
  if (category === "COMPILER" || category === "SEMANTIC" || category === "EXECUTION" || category === "INTERNAL_ERROR") {
    return formatCompilerIssues(items, category)
  }

  const seen = new Set<string>()
  const formatted: FormattedExecutionIssue[] = []

  for (const item of items) {
    const issue = formatStructuredIssue(item)
    if (!issue) continue
    const key = `${issue.summary}\n${issue.detail ?? ""}`
    if (seen.has(key)) continue
    seen.add(key)
    formatted.push(issue)
  }

  return formatted
}
