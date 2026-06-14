import { describe, expect, it } from "vitest"

import {
  getFlowchartReferenceCode,
  localizeFlowchartSource,
} from "./flowchartReferenceCode"
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

describe("localizeFlowchartSource", () => {
  it("returns python unchanged", () => {
    const source = "print('hello')"
    expect(localizeFlowchartSource(source, "python")).toBe(source)
  })

  it("wraps for loop in cpp main", () => {
    const result = localizeFlowchartSource("for i in range(3):\n    print(i)", "cpp")
    expect(result).toContain("for (int i = 0; i < 3; i++)")
    expect(result).toContain("int main()")
  })

  it("wraps if/else in java", () => {
    const result = localizeFlowchartSource(
      "n = int(input())\nif n > 0:\n    print('pos')\nelse:\n    print('nonpos')",
      "java",
    )
    expect(result).toContain("if (n > 0)")
    expect(result).toContain("Scanner scanner")
  })

  it("localizes simple print to pascal", () => {
    const result = localizeFlowchartSource("print('Hi')", "pascal")
    expect(result).toContain("WriteLn")
    expect(result).toContain("program Solution")
  })
})

describe("getFlowchartReferenceCode", () => {
  it("returns python source by default", () => {
    expect(getFlowchartReferenceCode(FLOWCHART_TASK, "python")).toContain("range(3)")
  })

  it("uses explicit variants from payload", () => {
    const task: TaskDetail = {
      ...FLOWCHART_TASK,
      payload: {
        ...FLOWCHART_TASK.payload,
        source_code_by_language: {
          python: "for i in range(3):\n    print(i)",
          cpp: "int main() { return 0; }",
        },
      },
    }
    expect(getFlowchartReferenceCode(task, "cpp")).toBe("int main() { return 0; }")
  })

  it("localizes when variant missing", () => {
    const result = getFlowchartReferenceCode(FLOWCHART_TASK, "csharp")
    expect(result).toContain("static void Main()")
    expect(result).toContain("for (int i = 0; i < 3; i++)")
  })

  it("returns empty string without task", () => {
    expect(getFlowchartReferenceCode(null, "python")).toBe("")
  })
})
