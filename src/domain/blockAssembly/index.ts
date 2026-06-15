export type { BlockPlacement } from "@/domain/blockAssembly/types"
export {
  buildCode,
  deriveSubmitPayload,
  getInitialBaseCode,
} from "@/domain/blockAssembly/buildCode"
export { applyDrop, removePlacement } from "@/domain/blockAssembly/drop"
export { normalizePlacements, isAssemblyComplete } from "@/domain/blockAssembly/normalize"
export {
  createPlacementId,
  blockFirstLineWidth,
  decodeTemplateText,
} from "@/domain/blockAssembly/utils"
