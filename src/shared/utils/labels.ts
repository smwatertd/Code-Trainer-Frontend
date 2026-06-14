const DEFAULT_UNKNOWN = "—"

export const TASK_TYPE_LABELS: Record<string, string> = {
  translation: "Перевод программы",
  task_write_from_description: "Программа по условию",
  algorithm: "Программа по условию",
  task_build_from_blocks: "Сборка из блоков",
  task_flowchart_to_code: "Блок-схема",
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Лёгкая",
  medium: "Средняя",
  hard: "Сложная",
}

export const PROGRESS_STATUS_LABELS: Record<string, string> = {
  not_started: "Не начато",
  failed: "Не решено",
  passed: "Решено",
}

export const USER_ROLE_LABELS: Record<string, string> = {
  student: "Студент",
  teacher: "Преподаватель",
  admin: "Администратор",
}

export const FLOW_BLOCK_TYPE_LABELS: Record<string, string> = {
  start: "Начало",
  end: "Конец",
  input: "Ввод",
  output: "Вывод",
  decision: "Условие",
  process: "Действие",
  loop: "Цикл",
}

export const LEARNING_CONCEPT_LABELS: Record<string, string> = {
  loops: "Циклы",
  conditions: "Условия",
  functions: "Функции",
}

export const TECHNICAL_CONCEPT_LABELS: Record<string, string> = {
  for_loop: "Цикл for",
  while_loop: "Цикл while",
  if_else: "Условие if / elif / else",
  nested_branch: "Вложенные условия",
  function_definition: "Определение функции",
  function_call: "Вызов функции",
  return_value: "Возврат значения",
}

export const LANGUAGE_LABELS: Record<string, string> = {
  python: "Python",
  pascal: "Pascal",
  java: "Java",
  cpp: "C++",
  csharp: "C#",
}

export const TOPIC_LABELS: Record<string, string> = {
  basics: "Основы",
  io: "Ввод-вывод",
  flowchart: "Блок-схема",
  custom: "Свои задачи",
  ...LEARNING_CONCEPT_LABELS,
  ...LANGUAGE_LABELS,
}

export const JOB_STATUS_LABELS: Record<string, string> = {
  QUEUED: "В очереди",
  RUNNING: "Выполняется",
  SUCCESS: "Готово",
  FAILED: "Сбой",
  queued: "В очереди",
  running: "Выполняется",
  success: "Пройдено",
  failed: "Неудача",
}

function labelFromMap(map: Record<string, string>, value: string): string {
  const normalized = value.trim()
  if (!normalized) return DEFAULT_UNKNOWN
  return map[normalized] ?? map[normalized.toLowerCase()] ?? normalized
}

export function labelTaskType(value: string): string {
  return labelFromMap(TASK_TYPE_LABELS, value)
}

export function labelDifficulty(value: string): string {
  return labelFromMap(DIFFICULTY_LABELS, value)
}

export function labelProgressStatus(value: string): string {
  return labelFromMap(PROGRESS_STATUS_LABELS, value)
}

export function labelUserRole(value: string): string {
  return labelFromMap(USER_ROLE_LABELS, value)
}

export function labelFlowBlockType(value: string): string {
  return labelFromMap(FLOW_BLOCK_TYPE_LABELS, value)
}

export function labelLearningConcept(value: string): string {
  return labelFromMap(LEARNING_CONCEPT_LABELS, value)
}

export function labelTechnicalConcept(value: string): string {
  return labelFromMap(TECHNICAL_CONCEPT_LABELS, value)
}

export function labelLanguage(value: string): string {
  return labelFromMap(LANGUAGE_LABELS, value)
}

export function labelTopic(value: string): string {
  return labelFromMap(TOPIC_LABELS, value)
}

export function labelJobStatus(value: string): string {
  return labelFromMap(JOB_STATUS_LABELS, value)
}

export function labelSubmissionOutcome(success: boolean | null | undefined): string {
  if (success === true) return "Успех"
  if (success === false) return "Неудача"
  return "—"
}

export function findNextIncompleteTaskId(
  byTaskId: Record<string, { progress_status?: string }> = {},
): number | null {
  const entries = Object.entries(byTaskId)
    .map(([taskId, item]) => ({
      taskId: Number(taskId),
      status: String(item.progress_status ?? "not_started"),
    }))
    .filter((item) => Number.isFinite(item.taskId))
    .sort((left, right) => left.taskId - right.taskId)

  const next = entries.find((item) => item.status !== "passed")
  return next?.taskId ?? null
}

export function findNextIncompleteTechnicalConcept(
  byTechnicalConcept: Record<string, { passed_tasks?: number; total_tasks?: number }> = {},
): string | null {
  const entries = Object.entries(byTechnicalConcept).sort(([left], [right]) => left.localeCompare(right))
  const next = entries.find(([, item]) => (item.passed_tasks ?? 0) < (item.total_tasks ?? 0))
  return next?.[0] ?? null
}
