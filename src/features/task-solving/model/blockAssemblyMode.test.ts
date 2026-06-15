import { describe, expect, it } from "vitest"
import {
  getBlockAssemblyTemplate,
  initialBlockAssemblyOrder,
  resolveBlockAssemblyKind,
} from "@/features/task-solving/model/blockAssemblyMode"

describe("blockAssemblyMode", () => {
  it("detects fragment assembly by {N} slots in template", () => {
    expect(resolveBlockAssemblyKind([], "x {0} 1\n{1}(y)")).toBe("fragment")
  })

  it("uses program_reorder for python statement blocks without template slots", () => {
    expect(
      resolveBlockAssemblyKind(
        [
          { id: 0, content: "total=135" },
          { id: 1, content: "h=total//60" },
        ],
        "",
      ),
    ).toBe("program_reorder")
  })

  it("uses program_reorder for pascal program blocks", () => {
    expect(
      resolveBlockAssemblyKind(
        [
          { id: 0, content: "program Main;" },
          { id: 1, content: "begin" },
          { id: 2, content: "end." },
        ],
        "",
      ),
    ).toBe("program_reorder")
  })

  it("initializes fragment slot order with -1 placeholders", () => {
    expect(initialBlockAssemblyOrder([], "x {0} 1\n{1}(y)")).toEqual([-1, -1])
  })

  it("reads template from task payload", () => {
    const task = {
      payload: {
        template: "x {0} 1",
        language_variants: { cpp: { template: "int x {0} 1;" } },
      },
    }
    expect(getBlockAssemblyTemplate(task, "cpp")).toBe("int x {0} 1;")
    expect(getBlockAssemblyTemplate(task, "python")).toBe("x {0} 1")
  })
})
