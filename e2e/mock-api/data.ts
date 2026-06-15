type TaskSeed = {
  id: number
  title: string
  description: string
  difficulty: string
  task_type: string
  payload: Record<string, unknown>
}

function pascalBlocks(
  lines: string[],
  correctOrder: number[],
  extra: Record<string, unknown> = {},
) {
  const items = lines.map((content, id) => ({ id, content }))
  return {
    language: "pascal",
    blocks: items,
    blocks_by_language: {
      pascal: items,
      // API синтезирует «python»-блоки из Pascal-скелета — фронт должен брать code_examples.
      python: items,
    },
    blocks_count: items.length,
    correct_order: correctOrder,
    source_language: "python",
    ...extra,
  }
}

function pascalTranslation(
  sourceCode: string,
  extra: Record<string, unknown> = {},
) {
  return {
    source_language: "python",
    target_language: "pascal",
    source_code: sourceCode,
    ...extra,
  }
}

export const MOCK_LANGUAGES = [
  { id: "python", label: "Python", file_extension: ".py", monaco_language: "python" },
  { id: "cpp", label: "C++", file_extension: ".cpp", monaco_language: "cpp" },
  { id: "pascal", label: "Pascal", file_extension: ".pas", monaco_language: "pascal" },
]

/** Базовая программа — 12 задач (id 1–12). */
export const MOCK_TASKS: TaskSeed[] = [
  {
    id: 1,
    title: "Вывести приветствие",
    description: "Соберите программу из блоков на Pascal.",
    difficulty: "easy",
    task_type: "task_build_from_blocks",
    payload: pascalBlocks(
      ["program Main;", "begin", "writeln('Hello');", "end."],
      [0, 1, 2, 3],
      {
        expected_code: "program Main;\nbegin\n  writeln('Hello');\nend.",
        test_cases: [{ inputs: "", output: "Hello" }],
        code_examples: {
          python: "print('Hello')",
          pascal: "program Main;\nbegin\n  writeln('Hello');\nend.",
        },
        constructions: [
          "program_entry",
          "typed_declaration",
          "assignment",
          "arithmetic_ops",
          "stdout_write",
        ],
      },
    ),
  },
  {
    id: 2,
    title: "Сохранить возраст",
    description: "Исправьте ошибки в программе на Pascal.",
    difficulty: "medium",
    task_type: "translation",
    payload: pascalTranslation("age = int(input())\nprint(age)", {
      kind: "debug",
      template: "var age: integer;\nbegin\n  age := 18;\n  writeln(age);\nend.",
      test_cases: [{ inputs: "18\n", output: "18" }],
      code_examples: {
        python: "age = int(input())\nprint(age)",
        cpp: "int age;\nstd::cin >> age;\nstd::cout << age << \"\\n\";",
        pascal: "var age: integer;\nbegin\n  readln(age);\n  writeln(age);\nend.",
      },
    }),
  },
  {
    id: 3,
    title: "Посчитать сумму двух чисел",
    description: "Переведите программу с Python на Pascal.",
    difficulty: "hard",
    task_type: "translation",
    payload: pascalTranslation("a = int(input())\nb = int(input())\nprint(a + b)", {
      test_cases: [{ inputs: "2\n3\n", output: "5" }],
    }),
  },
  {
    id: 4,
    title: "Посчитать площадь прямоугольника",
    description: "Соберите программу из блоков на Pascal.",
    difficulty: "easy",
    task_type: "task_build_from_blocks",
    payload: pascalBlocks(
      [
        "program Main;",
        "var w,h,area: integer;",
        "begin",
        "readln(w,h);",
        "area:=w*h;",
        "writeln(area);",
        "end.",
      ],
      [0, 1, 2, 3, 4, 5, 6],
      {
        test_cases: [{ inputs: "4\n6\n", output: "24" }],
        code_examples: {
          python: "w=int(input())\nh=int(input())\nprint(w*h)",
          pascal:
            "var w,h,area: integer;\nbegin\n  readln(w,h);\n  area:=w*h;\n  writeln(area);\nend.",
        },
      },
    ),
  },
  {
    id: 5,
    title: "Посчитать периметр прямоугольника",
    description: "Исправьте ошибки в программе на Pascal.",
    difficulty: "medium",
    task_type: "translation",
    payload: pascalTranslation("w = int(input())\nh = int(input())\nprint(2 * (w + h))", {
      template: "var w,h,p: integer;\nbegin\n  readln(w,h);\n  p:=w*h;\n  writeln(p);\nend.",
      test_cases: [{ inputs: "4\n6\n", output: "20" }],
    }),
  },
  {
    id: 6,
    title: "Поменять две переменные местами",
    description: "Переведите программу с Python на Pascal.",
    difficulty: "hard",
    task_type: "translation",
    payload: pascalTranslation(
      "a = int(input())\nb = int(input())\nt = a\na = b\nb = t\nprint(a, b)",
      {
        test_cases: [{ inputs: "3\n8\n", output: "8 3" }],
        code_examples: {
          python: "a = int(input())\nb = int(input())\nt = a\na = b\nb = t\nprint(a, b)",
          pascal:
            "var a,b,t: integer;\nbegin\n  readln(a,b);\n  t:=a; a:=b; b:=t;\n  writeln(a,' ',b);\nend.",
        },
      },
    ),
  },
  {
    id: 7,
    title: "Найти среднее двух чисел",
    description: "Соберите программу из блоков на Pascal.",
    difficulty: "easy",
    task_type: "task_build_from_blocks",
    payload: pascalBlocks(
      [
        "program Main;",
        "var a,b: integer; avg: real;",
        "begin",
        "readln(a,b);",
        "avg:=(a+b)/2;",
        "writeln(avg:0:1);",
        "end.",
      ],
      [0, 1, 2, 3, 4, 5, 6],
      {
        test_cases: [{ inputs: "9\n6\n", output: "7.5" }],
      },
    ),
  },
  {
    id: 8,
    title: "Вывести последнюю цифру числа",
    description: "Исправьте ошибки в программе на Pascal.",
    difficulty: "medium",
    task_type: "translation",
    payload: pascalTranslation("x = int(input())\nprint(x % 10)", {
      template: "var x,last: integer;\nbegin\n  readln(x);\n  last:=x div 10;\n  writeln(last);\nend.",
      test_cases: [{ inputs: "127\n", output: "7" }],
    }),
  },
  {
    id: 9,
    title: "Найти сумму цифр двузначного числа",
    description: "Переведите программу с Python на Pascal.",
    difficulty: "hard",
    task_type: "translation",
    payload: pascalTranslation("x = int(input())\nprint(x // 10 + x % 10)", {
      test_cases: [{ inputs: "47\n", output: "11" }],
    }),
  },
  {
    id: 10,
    title: "Перевести минуты в часы и минуты",
    description: "Соберите программу из блоков на Pascal.",
    difficulty: "easy",
    task_type: "task_build_from_blocks",
    payload: pascalBlocks(
      [
        "program Main;",
        "var total,h,m: integer;",
        "begin",
        "readln(total);",
        "h:=total div 60;",
        "m:=total mod 60;",
        "writeln(h,' ',m);",
        "end.",
      ],
      [0, 1, 2, 3, 4, 5, 6, 7],
      {
        test_cases: [{ inputs: "135\n", output: "2 15" }],
      },
    ),
  },
  {
    id: 11,
    title: "Рассчитать стоимость покупки",
    description: "Исправьте ошибки в программе на Pascal.",
    difficulty: "medium",
    task_type: "translation",
    payload: pascalTranslation("price = int(input())\ncount = int(input())\nprint(price * count)", {
      template: "var price,count,total: integer;\nbegin\n  readln(price,count);\n  total:=price+count;\n  writeln(total);\nend.",
      test_cases: [{ inputs: "120\n3\n", output: "360" }],
    }),
  },
  {
    id: 12,
    title: "Проверочная: чек с налогом и скидкой",
    description: "Переведите программу с Python на Pascal.",
    difficulty: "hard",
    task_type: "translation",
    payload: pascalTranslation(
      "price = float(input())\ntax_pct = float(input())\ndiscount_pct = float(input())\ntotal = price * (1 + tax_pct / 100) * (1 - discount_pct / 100)\nprint(f'{total:.2f}')",
      { test_cases: [{ inputs: "1000\n20\n10\n", output: "1080.00" }] },
    ),
  },
]

export const MOCK_DEV_USERS = [
  {
    id: 1,
    email: "student@code-trainer.dev",
    password: "student123",
    name: "Student Dev",
    role: "student",
  },
  {
    id: 2,
    email: "teacher@code-trainer.dev",
    password: "teacher123",
    name: "Teacher Dev",
    role: "teacher",
  },
  {
    id: 3,
    email: "admin@code-trainer.dev",
    password: "admin123",
    name: "Admin Dev",
    role: "admin",
  },
] as const

export function successCheckResult(extra: Record<string, unknown> = {}) {
  return {
    status: "SUCCESS",
    success: true,
    compiler_errors: [],
    linter_errors: [],
    pattern_errors: [],
    test_results: [{ case: 1, status: "PASSED" }],
    errors: null,
    ...extra,
  }
}

export function emptyLearningProgress(language: string, conceptId: string) {
  return {
    language,
    learning_concept_id: conceptId,
    total_tasks: conceptId === "loops" ? 1 : 0,
    passed_tasks: 0,
    progress_percent: 0,
    by_technical_concept: {},
    by_task_id: {},
  }
}

export function curriculumValidation(language: string) {
  return {
    language,
    valid: true,
    errors: [],
    stats: { chapters: 4, concepts: 14, patterns: 24 },
  }
}

const PYTHON_CHAPTER_META = [
  {
    collection_id: "first_steps",
    title_ru: "Первые программы",
    description_ru: "print, input() и простые вычисления.",
    order: 1,
    taskIds: [1, 2, 3],
  },
  {
    collection_id: "data_expressions",
    title_ru: "Данные и выражения",
    description_ru: "Переменные и арифметика.",
    order: 2,
    taskIds: [4, 5, 6, 9],
  },
  {
    collection_id: "branching",
    title_ru: "Ветвление",
    description_ru: "if / elif / else.",
    order: 3,
    taskIds: [8, 11, 18, 23],
  },
  {
    collection_id: "repetition",
    title_ru: "Циклы",
    description_ru: "for, while, div и mod.",
    order: 4,
    taskIds: [7, 10, 16, 17, 19],
  },
  {
    collection_id: "functions_console",
    title_ru: "Функции и консоль",
    description_ru: "def, return и stdin/stdout.",
    order: 5,
    taskIds: [12, 13, 14, 15, 20, 21, 22, 24],
  },
] as const

const CPP_CHAPTER_META = [
  {
    collection_id: "program_structure",
    title_ru: "Программа и main",
    description_ru: "Каркас консольной программы.",
    order: 1,
    taskIds: [1, 2, 13],
  },
  {
    collection_id: "variables_ops",
    title_ru: "Переменные и операции",
    description_ru: "Типы и арифметика.",
    order: 2,
    taskIds: [3, 4, 5, 6, 7, 9],
  },
  {
    collection_id: "control_if",
    title_ru: "Условный оператор",
    description_ru: "if / else.",
    order: 3,
    taskIds: [8, 11, 18, 20, 23],
  },
  {
    collection_id: "control_loops",
    title_ru: "Циклы",
    description_ru: "for и while.",
    order: 4,
    taskIds: [10, 16, 17, 19, 22],
  },
  {
    collection_id: "functions_streams",
    title_ru: "Функции и потоки",
    description_ru: "Функции и cin/cout.",
    order: 5,
    taskIds: [12, 14, 15, 21, 24],
  },
] as const

const CHAPTER_META_BY_LANGUAGE: Record<string, readonly (typeof PYTHON_CHAPTER_META)[number][]> = {
  python: PYTHON_CHAPTER_META,
  cpp: CPP_CHAPTER_META,
  java: PYTHON_CHAPTER_META,
  csharp: PYTHON_CHAPTER_META,
  pascal: PYTHON_CHAPTER_META,
}

function chapterMetaForLanguage(language: string) {
  return CHAPTER_META_BY_LANGUAGE[language] ?? PYTHON_CHAPTER_META
}

const LANGUAGE_LABELS: Record<string, string> = {
  python: "Python",
  pascal: "Pascal",
  cpp: "C++",
  csharp: "C#",
  java: "Java",
}

function mockTaskProgress(userId: number | null, taskId: number, store?: { taskProgress: Map<string, { progress_status: string }> }) {
  if (!userId || !store) return null
  const row = store.taskProgress.get(`${userId}:${taskId}`)
  return row?.progress_status ?? "not_started"
}

export function buildMockLanguageTrack(
  language: string,
  userId: number | null,
  store?: { taskProgress: Map<string, { progress_status: string }> },
) {
  const collections = chapterMetaForLanguage(language).map((chapter) => {
    const total = chapter.taskIds.length
    const passed = chapter.taskIds.filter(
      (taskId) => mockTaskProgress(userId, taskId, store) === "passed",
    ).length
    const nextTaskId = chapter.taskIds.find(
      (taskId) => mockTaskProgress(userId, taskId, store) !== "passed",
    )
    const nextTask = nextTaskId
      ? MOCK_TASKS.find((task) => task.id === nextTaskId) ?? null
      : null
    return {
      collection_id: chapter.collection_id,
      title_ru: chapter.title_ru,
      description_ru: chapter.description_ru,
      route_path: `/learn/${language}/${chapter.collection_id}`,
      order: chapter.order,
      progress: {
        total_tasks: total,
        passed_tasks: passed,
        progress_percent: total ? Math.round((passed / total) * 100) : 0,
      },
      completed: total > 0 && passed >= total,
      button_label: passed >= total ? "Повторить" : passed > 0 || nextTask ? "Продолжить" : "Начать",
      next_task: nextTask
        ? {
            task_id: nextTask.id,
            title: nextTask.title,
            progress_status: mockTaskProgress(userId, nextTask.id, store),
          }
        : null,
    }
  })

  const aggregatePassed = collections.reduce((sum, item) => sum + item.progress.passed_tasks, 0)
  const aggregateTotal = collections.reduce((sum, item) => sum + item.progress.total_tasks, 0)

  return {
    language,
    language_label: LANGUAGE_LABELS[language] ?? language,
    progress: {
      total_tasks: aggregateTotal,
      passed_tasks: aggregatePassed,
      progress_percent: aggregateTotal ? Math.round((aggregatePassed / aggregateTotal) * 100) : 0,
    },
    collections,
  }
}

export function buildMockCollectionShowcase(
  language: string,
  conceptId: string,
  userId: number | null,
  store?: { taskProgress: Map<string, { progress_status: string }> },
) {
  const chapter = chapterMetaForLanguage(language).find((item) => item.collection_id === conceptId)
  if (!chapter) {
    return null
  }

  const tasks = chapter.taskIds
    .map((taskId) => MOCK_TASKS.find((task) => task.id === taskId))
    .filter(Boolean) as typeof MOCK_TASKS

  const sectionTasks = tasks.map((task) => ({
    task_id: task.id,
    title: task.title,
    action: task.task_type === "translation" ? "translate" : "assemble",
    action_label: task.task_type === "translation" ? "Перенести" : "Собрать",
    action_skill_label: `${task.task_type === "translation" ? "Перенести" : "Собрать"} · ${language === "pascal" ? "Pascal" : "Python"}`,
    action_description_ru: task.description,
    difficulty: task.difficulty === "easy" ? "Лёгкая" : task.difficulty === "medium" ? "Средняя" : "Сложная",
    progress_status: userId ? mockTaskProgress(userId, task.id, store) : null,
    short_instruction: task.description,
    subtopic_name_ru: chapter.title_ru,
  }))

  const passed = sectionTasks.filter((task) => task.progress_status === "passed").length
  const total = sectionTasks.length
  const next = sectionTasks.find((task) => task.progress_status !== "passed")

  return {
    collection_id: conceptId,
    title: chapter.title_ru,
    description: chapter.description_ru,
    total_tasks: total,
    progress: userId
      ? {
          total_tasks: total,
          passed_tasks: passed,
          progress_percent: total ? Math.round((passed / total) * 100) : 0,
        }
      : null,
    sections: [
      {
        id: `${conceptId}_section`,
        name_ru: chapter.title_ru,
        tasks: sectionTasks,
        progress: {
          total_tasks: total,
          passed_tasks: passed,
          progress_percent: total ? Math.round((passed / total) * 100) : 0,
        },
      },
    ],
    next_task: next ? { task_id: next.task_id, title: next.title, progress_status: next.progress_status } : null,
    button_label: passed >= total ? "Повторить" : passed > 0 || next ? "Продолжить" : "Начать",
    completed: total > 0 && passed >= total,
  }
}
