import { createPlacementId, getBaseLine, normalizeCodeColumn } from "@/domain/blockAssembly/utils"
import type { BlockPlacement } from "@/domain/blockAssembly/types"

export function normalizePlacements(
  placements: BlockPlacement[],
  baseCode = "",
): BlockPlacement[] {
  return placements
    .filter((placement) => placement && typeof placement.blockIndex === "number" && placement.blockIndex >= 0)
    .map((placement) => {
      const line = Math.max(1, Math.floor(placement.line))
      const baseLine = baseCode ? getBaseLine(baseCode, line) : ""
      const column = baseCode
        ? normalizeCodeColumn(baseLine, placement.column)
        : Math.max(1, Math.floor(placement.column))
      return {
        id: placement.id || createPlacementId(),
        blockIndex: placement.blockIndex,
        line,
        column,
        slot: Math.max(0, Math.floor(placement.slot)),
        ...(typeof placement.templateSlot === "number" && placement.templateSlot >= 0
          ? { templateSlot: placement.templateSlot }
          : {}),
      }
    })
    .sort((left, right) => left.line - right.line || left.slot - right.slot || left.column - right.column)
}

export function isAssemblyComplete(placements: BlockPlacement[], blockCount: number): boolean {
  if (blockCount <= 0) return false
  const used = new Set(normalizePlacements(placements).map((placement) => placement.blockIndex))
  return used.size === blockCount
}
