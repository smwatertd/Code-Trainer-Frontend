import type { TaskBlock } from "@/shared/types/api"
import type { TaskDetail } from "@/shared/types/api"
import { isStructuralProgramBlocks } from "@/features/task-solving/model/blockReorderLanguage"
import { countTemplateSlots, isFragmentAssemblyTemplate } from "@/features/task-solving/model/blockReorderAssembly"

/** Сборка фрагмента: inline-слоты {0}, {1} в template. */
export type BlockAssemblyKind = "fragment" | "program_lines" | "program_reorder"

export function getBlockAssemblyTemplate(
  task: TaskDetail | null,
  language?: string,
): string {
  if (!task) return ""
  const payload = task.payload
  const variants = payload.language_variants
  if (
    language &&
    variants &&
    typeof variants === "object" &&
    !Array.isArray(variants)
  ) {
    const variant = (variants as Record<string, Record<string, unknown>>)[language]
    const fromVariant = variant?.template
    if (typeof fromVariant === "string" && fromVariant.trim()) {
      return fromVariant
    }
  }
  return String(payload.template ?? "")
}

export function resolveBlockAssemblyKind(
  blocks: TaskBlock[],
  template: string,
): BlockAssemblyKind {
  if (isFragmentAssemblyTemplate(template)) {
    return "fragment"
  }
  if (!blocks.length) {
    return "program_reorder"
  }
  if (isStructuralProgramBlocks(blocks.map((block) => block.content))) {
    return "program_reorder"
  }
  // Statement blocks (e.g. Python from code_examples): show the reorder list, not an empty free-assembly canvas.
  return "program_reorder"
}

export function initialBlockAssemblyOrder(
  blocks: TaskBlock[],
  template: string,
): number[] {
  if (isFragmentAssemblyTemplate(template)) {
    return Array(countTemplateSlots(template)).fill(-1)
  }
  return blocks.map((block) => block.id)
}

/** @deprecated use resolveBlockAssemblyKind(... ) === "program_lines" */
export function shouldUseFreeBlockAssembly(blocks: TaskBlock[]): boolean {
  return resolveBlockAssemblyKind(blocks, "") === "program_lines"
}
