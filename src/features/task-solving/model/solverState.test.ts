import { describe, expect, it } from "vitest"

import { buildCodeFromBlocks, getTaskBlocks } from "./solverState"
import type { TaskDetail } from "@/shared/types/api"

const TASK: TaskDetail = {
  id: 2,
  title: "Reorder",
  description: "desc",
  difficulty: "easy",
  task_type: "task_build_from_blocks",
  payload: {
    language: "python",
    blocks: [
      { id: 0, content: "print('a')" },
      { id: 1, content: "print('b')" },
    ],
    blocks_by_language: {
      python: [
        { id: 0, content: "print('a')" },
        { id: 1, content: "print('b')" },
      ],
      cpp: [
        { id: 0, content: 'cout << "a" << endl;' },
        { id: 1, content: 'cout << "b" << endl;' },
      ],
    },
    blocks_count: 2,
  },
}

describe("getTaskBlocks", () => {
  it("returns language-specific blocks when available", () => {
    const blocks = getTaskBlocks(TASK, "cpp")
    expect(blocks.map((block) => block.content)).toEqual([
      'cout << "a" << endl;',
      'cout << "b" << endl;',
    ])
  })

  it("localizes python blocks when language variant is missing", () => {
    const task: TaskDetail = {
      ...TASK,
      payload: {
        language: "python",
        blocks: [
          { id: 0, content: "print('a')" },
          { id: 1, content: "print('b')" },
        ],
        blocks_count: 2,
      },
    }

    expect(getTaskBlocks(task, "cpp").map((block) => block.content)).toEqual([
      'cout << "a" << endl;',
      'cout << "b" << endl;',
    ])
  })
})

describe("buildCodeFromBlocks", () => {
  it("wraps non-python code with language template", () => {
    const blocks = getTaskBlocks(TASK, "cpp")
    const code = buildCodeFromBlocks(blocks, [1, 0], "cpp")

    expect(code).toContain("#include <iostream>")
    expect(code.indexOf('cout << "b"')).toBeLessThan(code.indexOf('cout << "a"'))
  })
})
