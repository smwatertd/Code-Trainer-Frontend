export const FLOWCHART_LANGUAGES = ["python", "cpp", "pascal", "java", "csharp"] as const

import type { TaskDetail } from "@/shared/types/api"
import {
  BLOCK_REORDER_TEMPLATES,
  localizeBlockStatement,
} from "@/features/task-solving/model/blockReorderLanguage"

const FOR_RANGE = /^for\s+(\w+)\s+in\s+range\((\d+)\):\s*$/
const FOR_RANGE_START = /^for\s+(\w+)\s+in\s+range\((\d+),\s*(\d+)\):\s*$/
const WHILE = /^while\s+(.+):\s*$/
const IF = /^if\s+(.+):\s*$/
const ELSE = /^else:\s*$/
const ASSIGN_INPUT = /^(\w+)\s*=\s*input\(\)\s*$/
const ASSIGN_INT_INPUT = /^(\w+)\s*=\s*int\(input\(\)\)\s*$/
const ASSIGN = /^(\w+)\s*=\s*(.+)$/
const PRINT = /^print\((.+)\)\s*$/
const DEF = /^def\s+(\w+)\(\):\s*$/
const RETURN = /^return\s+(.+)$/
const AUG_SUB = /^(\w+)\s*-=\s*(\d+)\s*$/

function pad(line: string, depth: number, languageId: string): string {
  if (languageId === "pascal") return `${"  ".repeat(depth)}${line}`
  return `${"    ".repeat(depth)}${line}`
}

function closeBlock(depth: number, languageId: string): string {
  if (languageId === "pascal") return pad("end;", depth - 1, languageId)
  return pad("}", depth - 1, languageId)
}

function quoteExpr(expr: string, languageId: string): string {
  const trimmed = expr.trim()
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    const inner = trimmed.slice(1, -1)
    if (languageId === "pascal") return `'${inner}'`
    return `"${inner}"`
  }
  return trimmed
}

function printLine(expr: string, languageId: string): string {
  const value = quoteExpr(expr, languageId)
  if (languageId === "cpp") return `cout << ${value} << endl;`
  if (languageId === "pascal") return `WriteLn(${value});`
  if (languageId === "java") return `System.out.println(${value});`
  if (languageId === "csharp") return `Console.WriteLine(${value});`
  return `print(${expr})`
}

function inputLine(name: string, languageId: string, asInt = false): string {
  if (languageId === "cpp") {
    return asInt ? `int ${name}; cin >> ${name};` : `string ${name}; cin >> ${name};`
  }
  if (languageId === "pascal") return `ReadLn(${name});`
  if (languageId === "java") {
    return asInt ? `int ${name} = scanner.nextInt();` : `String ${name} = scanner.nextLine();`
  }
  if (languageId === "csharp") {
    return asInt
      ? `int ${name} = int.Parse(Console.ReadLine());`
      : `string ${name} = Console.ReadLine();`
  }
  return asInt ? `${name} = int(input())` : `${name} = input()`
}

function translateStatement(line: string, languageId: string): [string, boolean] {
  if (languageId === "python") return [line, line.endsWith(":")]

  let match = DEF.exec(line)
  if (match) {
    const name = match[1]
    if (languageId === "cpp") return [`string ${name}() {`, true]
    if (languageId === "pascal") return [`function ${name}: string; begin`, true]
    if (languageId === "java") return [`static String ${name}() {`, true]
    if (languageId === "csharp") return [`static string ${name}() {`, true]
  }

  match = RETURN.exec(line)
  if (match) {
    const value = quoteExpr(match[1], languageId)
    if (languageId === "pascal") return [`Result := ${value};`, false]
    if (languageId === "cpp" || languageId === "java" || languageId === "csharp") {
      return [`return ${value};`, false]
    }
  }

  match = FOR_RANGE.exec(line)
  if (match) {
    const [, varName, upper] = match
    if (languageId === "cpp") return [`for (int ${varName} = 0; ${varName} < ${upper}; ${varName}++) {`, true]
    if (languageId === "pascal") return [`for ${varName} := 0 to ${Number(upper) - 1} do begin`, true]
    if (languageId === "java") return [`for (int ${varName} = 0; ${varName} < ${upper}; ${varName}++) {`, true]
    if (languageId === "csharp") return [`for (int ${varName} = 0; ${varName} < ${upper}; ${varName}++) {`, true]
  }

  match = FOR_RANGE_START.exec(line)
  if (match) {
    const [, varName, start, end] = match
    if (languageId === "cpp") return [`for (int ${varName} = ${start}; ${varName} < ${end}; ${varName}++) {`, true]
    if (languageId === "pascal") return [`for ${varName} := ${start} to ${Number(end) - 1} do begin`, true]
    if (languageId === "java") {
      return [`for (int ${varName} = ${Number(start)}; ${varName} < ${end}; ${varName}++) {`, true]
    }
    if (languageId === "csharp") {
      return [`for (int ${varName} = ${Number(start)}; ${varName} < ${end}; ${varName}++) {`, true]
    }
  }

  match = WHILE.exec(line)
  if (match) {
    const cond = match[1]
    if (languageId === "cpp") return [`while (${cond}) {`, true]
    if (languageId === "pascal") return [`while ${cond} do begin`, true]
    if (languageId === "java") return [`while (${cond}) {`, true]
    if (languageId === "csharp") return [`while (${cond}) {`, true]
  }

  match = IF.exec(line)
  if (match) {
    const cond = match[1]
    if (languageId === "cpp") return [`if (${cond}) {`, true]
    if (languageId === "pascal") return [`if ${cond} then begin`, true]
    if (languageId === "java") return [`if (${cond}) {`, true]
    if (languageId === "csharp") return [`if (${cond}) {`, true]
  }

  if (ELSE.test(line)) {
    if (languageId === "cpp") return ["} else {", true]
    if (languageId === "pascal") return ["end else begin", true]
    if (languageId === "java") return ["} else {", true]
    if (languageId === "csharp") return ["} else {", true]
  }

  match = ASSIGN_INT_INPUT.exec(line)
  if (match) return [inputLine(match[1], languageId, true), false]

  match = ASSIGN_INPUT.exec(line)
  if (match) return [inputLine(match[1], languageId), false]

  match = PRINT.exec(line)
  if (match) return [printLine(match[1], languageId), false]

  match = AUG_SUB.exec(line)
  if (match) {
    const [, name, value] = match
    if (languageId === "cpp") return [`${name} -= ${value};`, false]
    if (languageId === "pascal") return [`${name} := ${name} - ${value};`, false]
    if (languageId === "java") return [`${name} -= ${value};`, false]
    if (languageId === "csharp") return [`${name} -= ${value};`, false]
  }

  match = ASSIGN.exec(line)
  if (match) {
    const [, name, expr] = match
    if (languageId === "cpp") return [`${name} = ${expr};`, false]
    if (languageId === "pascal") return [`${name} := ${expr};`, false]
    if (languageId === "java") return [`${name} = ${expr};`, false]
    if (languageId === "csharp") return [`${name} = ${expr};`, false]
  }

  return [line, false]
}

export function localizeFlowchartSource(source: string, languageId: string): string {
  if (languageId === "python") return source

  const template = BLOCK_REORDER_TEMPLATES[languageId] ?? BLOCK_REORDER_TEMPLATES.python
  const lines = source.split("\n").filter((line) => line.trim())
  const body: string[] = []
  const indentStack = [0]

  for (const raw of lines) {
    const stripped = raw.trim()
    const indent = raw.length - stripped.length

    while (indent < indentStack[indentStack.length - 1]) {
      indentStack.pop()
      body.push(closeBlock(indentStack.length, languageId))
    }

    const [converted, opens] = translateStatement(stripped, languageId)
    body.push(pad(converted, indentStack.length, languageId))
    if (opens) indentStack.push(indent + 4)
  }

  while (indentStack.length > 1) {
    indentStack.pop()
    body.push(closeBlock(indentStack.length, languageId))
  }

  if (languageId === "java" && body.some((line) => line.includes("scanner."))) {
    body.unshift(pad("Scanner scanner = new Scanner(System.in);", 0, languageId))
  }

  const header =
    languageId === "java" && body.some((line) => line.includes("scanner."))
      ? `import java.util.Scanner;\n\n${template.header}`
      : template.header

  return `${header}${body.join("\n")}${template.footer}`
}

export function getFlowchartReferenceCode(task: TaskDetail | null, language: string): string {
  if (!task) return ""

  const payload = task.payload
  const variants = payload.source_code_by_language
  if (variants && typeof variants === "object" && !Array.isArray(variants)) {
    const raw = (variants as Record<string, unknown>)[language]
    if (typeof raw === "string" && raw.trim()) return raw
  }

  const base = String(payload.source_code ?? "")
  if (!base.trim()) return ""

  if (language === "python") return base

  const simplePrintOnly = base.split("\n").every((line) => {
    const trimmed = line.trim()
    return !trimmed || /^print\(/.test(trimmed)
  })
  if (simplePrintOnly) {
    return localizeFlowchartSource(
      base
        .split("\n")
        .map((line) => localizeBlockStatement(line, language))
        .join("\n"),
      language,
    )
  }

  return localizeFlowchartSource(base, language)
}
