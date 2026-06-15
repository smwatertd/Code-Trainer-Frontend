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

  it("uses code_examples when catalog blocks are for another language paradigm", () => {
    const task: TaskDetail = {
      id: 1,
      title: "Hello",
      description: "desc",
      difficulty: "easy",
      task_type: "task_build_from_blocks",
      payload: {
        language: "pascal",
        blocks: [
          { id: 0, content: "program Main;" },
          { id: 1, content: "begin" },
          { id: 2, content: "writeln('Hello');" },
          { id: 3, content: "end." },
        ],
        blocks_by_language: {
          pascal: [
            { id: 0, content: "program Main;" },
            { id: 1, content: "begin" },
            { id: 2, content: "writeln('Hello');" },
            { id: 3, content: "end." },
          ],
          python: [
            { id: 0, content: "program Main;" },
            { id: 1, content: "begin" },
            { id: 2, content: "writeln('Hello');" },
            { id: 3, content: "end." },
          ],
        },
        code_examples: {
          python: "print('Hello')",
          pascal: "program Main;\nbegin\n  writeln('Hello');\nend.",
        },
      },
    }

    expect(getTaskBlocks(task, "python").map((block) => block.content)).toEqual(["print('Hello')"])
    expect(getTaskBlocks(task, "pascal").map((block) => block.content)).toEqual([
      "program Main;",
      "begin",
      "writeln('Hello');",
      "end.",
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
