import type { FlowPayload } from "@/shared/types/api"

/** Пустая схема — только «Начало», без готового решения. */
export const EMPTY_FLOWCHART: FlowPayload = {
  nodes: [{ id: "1", type: "start", x: 80, y: 40, text: "" }],
  edges: [],
  flow: [{ id: "1", type: "start", text: "" }],
}

export const FLOWCHART_TEMPLATES = [
  { id: "clear", label: "Очистить схему", payload: EMPTY_FLOWCHART },
] as const
