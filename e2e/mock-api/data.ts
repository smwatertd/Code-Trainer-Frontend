type TaskSeed = {
  id: number
  title: string
  description: string
  difficulty: string
  task_type: string
  payload: Record<string, unknown>
}

function blockPayload(
  lines: string[],
  correctOrder: number[],
  extra: Record<string, unknown> = {},
) {
  const variants = {
    python: lines,
    cpp: lines.map((line) =>
      line.replace(/print\((.*)\)/, 'cout << $1 << endl;').replace(/print\((\d+)\)/, "cout << $1 << endl;"),
    ),
    pascal: lines.map((line) =>
      line.replace(/print\((.*)\)/, "WriteLn($1);").replace(/print\((\d+)\)/, "WriteLn($1);"),
    ),
    java: lines.map((line) =>
      line.replace(/print\((.*)\)/, "System.out.println($1);").replace(/print\((\d+)\)/, "System.out.println($1);"),
    ),
    csharp: lines.map((line) =>
      line.replace(/print\((.*)\)/, "Console.WriteLine($1);").replace(/print\((\d+)\)/, "Console.WriteLine($1);"),
    ),
  }

  return {
    language: "python",
    blocks: lines.map((content, id) => ({ id, content })),
    blocks_by_language: Object.fromEntries(
      Object.entries(variants).map(([language, contentLines]) => [
        language,
        contentLines.map((content, id) => ({ id, content })),
      ]),
    ),
    blocks_count: lines.length,
    correct_order: correctOrder,
    ...extra,
  }
}

export const MOCK_LANGUAGES = [
  { id: "python", label: "Python", file_extension: ".py", monaco_language: "python" },
  { id: "cpp", label: "C++", file_extension: ".cpp", monaco_language: "cpp" },
  { id: "pascal", label: "Pascal", file_extension: ".pas", monaco_language: "pascal" },
]

export const MOCK_TASKS: TaskSeed[] = [
  {
    id: 1,
    title: "Приветствие",
    description: "Переведите программу приветствия с Python на целевой язык.",
    difficulty: "easy",
    task_type: "translation",
    payload: {
      source_language: "python",
      target_language: "cpp",
      source_code: "print('Hello')",
      template: "",
    },
  },
  {
    id: 2,
    title: "Упорядочить вывод",
    description: "Расставьте блоки кода в правильном порядке.",
    difficulty: "easy",
    task_type: "task_build_from_blocks",
    payload: blockPayload(["print('a')", "print('b')"], [1, 0], {
      expected_code: "print('b')\nprint('a')",
    }),
  },
  {
    id: 3,
    title: "Блок-схема if/else",
    description: "Постройте блок-схему для программы с ветвлением if/else.",
    difficulty: "easy",
    task_type: "task_flowchart_to_code",
    payload: {
      flowchart_mode: "code_to_flowchart",
      source_code:
        "n = int(input())\nif n > 0:\n    print('pos')\nelse:\n    print('nonpos')",
      source_language: "python",
    },
  },
  {
    id: 4,
    title: "Вывод с циклом for",
    description: "Напишите программу с циклом for для вывода чисел 0, 1 и 2 — каждое с новой строки.",
    difficulty: "easy",
    task_type: "task_write_from_description",
    payload: {
      target_language: "python",
    },
  },
  {
    id: 5,
    title: "Упорядочить print",
    description: "Расставьте блоки print в порядке и проверьте вывод программы.",
    difficulty: "easy",
    task_type: "task_build_from_blocks",
    payload: blockPayload(["print(1)", "print(2)"], [0, 1], {
      expected_code: "print(1)\nprint(2)",
      test_cases: [{ inputs: "", output: "1\n2" }],
    }),
  },
  {
    id: 6,
    title: "Блок-схема «Привет»",
    description: "Нарисуйте блок-схему программы приветствия и проверьте вывод.",
    difficulty: "easy",
    task_type: "task_flowchart_to_code",
    payload: {
      flowchart_mode: "code_to_flowchart",
      source_code: "print('hello')",
      source_language: "python",
    },
  },
  {
    id: 7,
    title: "Цикл for на C++",
    description: "Используйте цикл for в фрагменте кода на C++.",
    difficulty: "easy",
    task_type: "translation",
    payload: { kind: "snippet", target_language: "cpp", constructions: ["for_loop"] },
  },
  {
    id: 8,
    title: "Цикл for на Pascal",
    description: "Используйте цикл for в фрагменте кода на Pascal.",
    difficulty: "easy",
    task_type: "translation",
    payload: { kind: "snippet", target_language: "pascal", constructions: ["for_loop"] },
  },
  {
    id: 9,
    title: "Вывод в цикле (C++)",
    description: "Выведите числа от 0 до 2 с помощью цикла for на C++.",
    difficulty: "easy",
    task_type: "translation",
    payload: {
      target_language: "cpp",
      constructions: ["for_loop"],
      test_cases: [{ inputs: "", output: "0\n1\n2" }],
    },
  },
  {
    id: 10,
    title: "Вывод в цикле (Pascal)",
    description: "Выведите числа от 1 до 3 с помощью цикла for на Pascal.",
    difficulty: "easy",
    task_type: "translation",
    payload: {
      target_language: "pascal",
      constructions: ["for_loop"],
      test_cases: [{ inputs: "", output: "1\n2\n3" }],
    },
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
    test_results: [{ passed: true, status: "PASSED" }],
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
    stats: { chapters: 3, concepts: 12, patterns: 24 },
  }
}
