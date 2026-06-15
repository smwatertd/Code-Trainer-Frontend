const DEFAULT_UNKNOWN = "—"

export const TASK_TYPE_LABELS: Record<string, string> = {
  translation: "Перевод программы",
  translation_debug: "Исправление программы",
  task_write_from_description: "Программа по условию",
  algorithm: "Программа по условию",
  task_build_from_blocks: "Сборка из блоков",
  task_fill_placeholders: "Заполнить пропуски",
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
  program_entry: "Точка входа программы",
  typed_declaration: "Объявление переменной",
  assignment: "Присваивание",
  arithmetic_ops: "Арифметические операции",
  stdout_write: "Вывод в консоль",
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
  // Общие / каталог
  basics: "Основы",
  program: "Структура программы",
  io: "Ввод-вывод",
  flowchart: "Блок-схема",
  custom: "Свои задачи",

  // Разделы курса (learning concepts)
  branching: "Ветвление",
  arrays: "Массивы",
  strings: "Строки",
  data: "Данные",
  modules: "Модули",
  oop: "ООП",
  algorithms: "Алгоритмы",
  data_structures: "Структуры данных",
  idioms: "Идиомы Python",
  ...LEARNING_CONCEPT_LABELS,

  // Подтемы / technical concepts (используются как topics в задачах)
  simple_branch: "If then else",
  multi_branch: "Цепочка if else",
  counted_loop: "For to/downto",
  nested_iteration: "Вложенные циклы",
  indexed_sequence: "Массив array",
  dynamic_array: "Динамический массив",
  string_sequence: "Строка string",
  function_definition: "Procedure / Function",
  recursion: "Рекурсия",
  sort_order: "Сортировка",
  search_find: "Линейный поиск",
  filter_select: "Отбор по условию",
  fold_aggregate: "Сумма / агрегация",
  key_value_map: "Запись record",
  stdin_read: "Readln",
  file_read: "Чтение файла",
  file_write: "Запись файла",
  import_dependency: "Uses / unit",
  stack_queue: "Стек / очередь",
  linked_node: "Связный список",
  tree_hierarchy: "Дерево",
  graph_edges: "Граф",
  class_type: "Class / object",
  object_instance: "Создание экземпляра",
  inheritance_hierarchy: "Наследование",
  map: "Преобразование (map)",
  filter: "Отбор (filter)",
  reduce: "Агрегация (reduce)",

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

export function labelTaskDetailType(task: {
  task_type: string
  payload?: Record<string, unknown>
} | null): string {
  if (!task) return DEFAULT_UNKNOWN
  const payload = task.payload ?? {}
  if (task.task_type === "translation") {
    if (String(payload.kind ?? "").trim().toLowerCase() === "debug") {
      return TASK_TYPE_LABELS.translation_debug
    }
    if (String(payload.template ?? "").trim()) {
      return TASK_TYPE_LABELS.translation_debug
    }
    return TASK_TYPE_LABELS.translation
  }
  return labelTaskType(task.task_type)
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
  const normalized = value.trim()
  if (!normalized) return DEFAULT_UNKNOWN
  const topic =
    TOPIC_LABELS[normalized] ??
    TOPIC_LABELS[normalized.toLowerCase()] ??
    TECHNICAL_CONCEPT_LABELS[normalized] ??
    TECHNICAL_CONCEPT_LABELS[normalized.toLowerCase()]
  return topic ?? normalized
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
