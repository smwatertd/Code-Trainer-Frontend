import type { ConstructionDetail } from "@/features/task-solving/model/constructionCatalog.types"
import { GENERATED_CONSTRUCTION_CATALOG } from "@/features/task-solving/model/constructionCatalog.generated"

export type { ConstructionDetail, ConstructionExample } from "@/features/task-solving/model/constructionCatalog.types"

export const CONSTRUCTION_CATALOG: Record<string, ConstructionDetail> = GENERATED_CONSTRUCTION_CATALOG

export function getConstructionDetail(pattern: string): ConstructionDetail | null {
  return CONSTRUCTION_CATALOG[pattern] ?? null
}

export function getConstructionCatalogSize(): number {
  return Object.keys(CONSTRUCTION_CATALOG).length
}
