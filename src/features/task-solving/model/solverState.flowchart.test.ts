import { describe, expect, it } from "vitest"

import {
  createInitialSolverState,
  flowFromApiPayload,
  flowToApiPayload,
} from "./solverState"
import { getFlowchartReferenceCode } from "./flowchartReferenceCode"
import type { TaskDetail } from "@/shared/types/api"

const FLOWCHART_TASK: TaskDetail = {
  id: 40,
  title: "For loop",
  description: "desc",
  difficulty: "medium",
  task_type: "task_flowchart_to_code",
  payload: {
    flowchart_mode: "code_to_flowchart",
    source_code: "for i in range(3):\n    print(i)",
    source_language: "python",
  },
}

describe("createInitialSolverState flowchart", () => {
  it("loads reference code for code_to_flowchart tasks", () => {
    const state = createInitialSolverState(FLOWCHART_TASK)
    expect(state.code).toContain("range(3)")
    expect(state.flow).toEqual({ flow: [], nodes: [], edges: [] })
  })
})

describe("flowToApiPayload / flowFromApiPayload", () => {
  it("roundtrips nodes and edges", () => {
    const flow = {
      flow: [{ id: "1", type: "start" }],
      nodes: [{ id: "1", type: "start", x: 0, y: 0, text: "" }],
      edges: [{ source: "1", target: "2" }],
    }
    const api = flowToApiPayload(flow)
    expect(api.nodes).toHaveLength(1)
    expect(api.edges).toHaveLength(1)

    const restored = flowFromApiPayload({
      nodes: api.nodes as Array<Record<string, unknown>>,
      edges: api.edges as Array<Record<string, unknown>>,
      flow: api.flow as Array<Record<string, unknown>>,
    })
    expect(restored.nodes[0]?.id).toBe("1")
    expect(restored.edges[0]?.source).toBe("1")
  })

  it("serializes edges for api payload", () => {
    const flow = {
      flow: [],
      nodes: [],
      edges: [{ source: "a", target: "b", sourceHandle: "body", targetHandle: "back" }],
    }
    const api = flowToApiPayload(flow)
    expect(api.edges[0]).toEqual({ source: "a", target: "b" })
  })
})

describe("getFlowchartReferenceCode import", () => {
  it("is re-exported through solverState usage path", () => {
    expect(getFlowchartReferenceCode(FLOWCHART_TASK, "python")).toContain("print(i)")
  })
})
