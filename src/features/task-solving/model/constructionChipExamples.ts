import {
  getConstructionDetail,
  type ConstructionDetail,
  type ConstructionExample,
} from "@/features/task-solving/model/constructionCatalog"

export type ConstructionHintPayload = {
  title?: string
  description?: string
  examples?: Record<string, string>
  variants?: Record<string, Array<{ name?: string; code?: string }>>
}

export function pickConstructionExamples(
  pattern: string,
  hint: ConstructionHintPayload | undefined,
  language: string,
): ConstructionExample[] {
  const detail = getConstructionDetail(pattern)
  return pickConstructionExamplesFromDetail(detail, hint, language)
}

export function pickConstructionExamplesFromDetail(
  detail: ConstructionDetail | null,
  hint: ConstructionHintPayload | undefined,
  language: string,
): ConstructionExample[] {
  const lang = language.toLowerCase()

  const variants = hint?.variants?.[lang] ?? hint?.variants?.[language]
  if (Array.isArray(variants) && variants.length > 0) {
    return variants.map((item, index) => ({
      title: item.name?.trim() || `Пример ${index + 1}`,
      code: item.code ?? "",
    }))
  }

  const hintExample =
    hint?.examples?.[lang] ??
    hint?.examples?.[language] ??
    Object.entries(hint?.examples ?? {}).find(([key]) => key.toLowerCase() === lang)?.[1]
  if (typeof hintExample === "string" && hintExample.trim()) {
    return [{ title: "Пример", code: hintExample }]
  }

  if (!detail) return []

  const direct = detail.examples[lang]
  if (direct?.length) return direct

  for (const fallbackLang of ["python", "pascal", "cpp", "csharp", "java"]) {
    const fallback = detail.examples[fallbackLang]
    if (fallback?.length) return fallback
  }

  return []
}
