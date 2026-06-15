export const TRACK_DESCRIPTIONS: Record<string, string> = {
  python:
    "16 глав TC42: от поиска в массиве до ООП, наследования и финального проекта — 128 задач.",
  pascal:
    "16 глав TC42 на Pascal: те же алгоритмы, блоки, плейсхолдеры, перевод и отладка.",
  cpp:
    "16 глав TC42 на C++: синтаксис через классические алгоритмы и структуры данных.",
  java:
    "16 глав TC42 на Java: от базовых циклов до связных списков, графов и ООП.",
  csharp:
    "16 глав TC42 на C#: консольные алгоритмы, коллекции, файлы и объектная модель.",
}

export const TRACK_CHAPTER_HINTS: Record<string, string> = {
  python: "16 глав · 128 задач · TC42",
  pascal: "16 глав · 128 задач · TC42",
  cpp: "16 глав · 128 задач · TC42",
  java: "16 глав · 128 задач · TC42",
  csharp: "16 глав · 128 задач · TC42",
}

export function trackDescription(language: string): string {
  return (
    TRACK_DESCRIPTIONS[language] ??
    "Проходите сборники по порядку — от базовых конструкций к более сложным задачам."
  )
}

export function trackChapterHint(language: string): string | null {
  return TRACK_CHAPTER_HINTS[language] ?? null
}
