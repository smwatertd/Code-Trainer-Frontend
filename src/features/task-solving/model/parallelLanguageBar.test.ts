import { describe, expect, it } from "vitest"
import {
  resolveKnownLanguageBarOptions,
  resolveLearningLanguageBarOptions,
  canSwapParallelLanguages,
  getKnownLanguages,
} from "@/features/task-solving/model/studentUiUtils"
import type { TaskDetail } from "@/shared/types/api"

const TRANSLATION_WITH_EXAMPLES: TaskDetail = {
  id: 3,
  title: "Sum",
  description: "Translate",
  difficulty: "hard",
  task_type: "translation",
  payload: {
    source_language: "python",
    source_code: "print(1)",
    target_language: "pascal",
    code_examples: {
      python: "print(1)",
      pascal: "WriteLn(1);",
    },
    test_cases: [{ inputs: "", output: "1" }],
  },
}

describe("parallel language bar options", () => {
  it("includes both example languages in known and learning lists", () => {
    const known = resolveKnownLanguageBarOptions(TRANSLATION_WITH_EXAMPLES)
    const learning = resolveLearningLanguageBarOptions(TRANSLATION_WITH_EXAMPLES, [
      "python",
      "pascal",
      "cpp",
    ])

    expect(known).toEqual(expect.arrayContaining(["python", "pascal"]))
    expect(learning).toEqual(expect.arrayContaining(["python", "pascal", "cpp"]))
  })

  it("allows swap when both languages are present in both role lists", () => {
    const known = resolveKnownLanguageBarOptions(TRANSLATION_WITH_EXAMPLES)
    const learning = resolveLearningLanguageBarOptions(TRANSLATION_WITH_EXAMPLES, [
      "python",
      "pascal",
    ])

    expect(
      canSwapParallelLanguages("python", "pascal", known, learning),
    ).toBe(true)
    expect(
      canSwapParallelLanguages("pascal", "python", known, learning),
    ).toBe(true)
  })

  it("blocks swap when target language is missing from opposite list", () => {
    expect(
      canSwapParallelLanguages("python", "cpp", ["python"], ["cpp"]),
    ).toBe(false)
  })

  it("includes all code example languages in known list for translation tasks", () => {
    const translationTask: TaskDetail = {
      id: 5,
      title: "Perimeter",
      description: "Translate",
      difficulty: "medium",
      task_type: "translation",
      payload: {
        source_language: "python",
        source_code: "w = int(input())\nh = int(input())\nprint(2 * (w + h))",
        target_language: "pascal",
        code_examples: {
          python: "w = int(input())\nh = int(input())\nprint(2 * (w + h))",
          pascal: "var w,h,p: integer;\nbegin\n  readln(w,h);\n  p:=2*(w+h);\n  writeln(p);\nend.",
          cpp: "int w,h,p;\nstd::cin>>w>>h;\np=2*(w+h);\nstd::cout<<p;",
          csharp:
            "var p=Console.ReadLine().Split();\nint w=int.Parse(p[0]),h=int.Parse(p[1]);\nConsole.WriteLine(2*(w+h));",
          java:
            "Scanner sc=new Scanner(System.in);\nint w=sc.nextInt(),h=sc.nextInt();\nSystem.out.println(2*(w+h));",
        },
      },
    }

    expect(resolveKnownLanguageBarOptions(translationTask)).toEqual([
      "python",
      "pascal",
      "cpp",
      "csharp",
      "java",
    ])
  })

  it("resolves known languages from code_examples for block tasks", () => {
    const blockTask: TaskDetail = {
      id: 1,
      title: "Hello",
      description: "Blocks",
      difficulty: "easy",
      task_type: "task_build_from_blocks",
      payload: {
        language: "pascal",
        code_examples: {
          python: "print('Hello')",
          pascal: "program Main;",
        },
      },
    }

    expect(getKnownLanguages(blockTask)).toEqual(
      expect.arrayContaining(["python", "pascal"]),
    )
  })

  it("allows swap on pascal debug tasks via source language in learning list", () => {
    const debugTask: TaskDetail = {
      id: 2,
      title: "Age",
      description: "Fix bugs",
      difficulty: "medium",
      task_type: "translation",
      payload: {
        kind: "debug",
        source_language: "python",
        source_code: "age = int(input())\nprint(age)",
        target_language: "pascal",
        template: "var age: integer;\nbegin\n  age := 18;\n  writeln(age);\nend.",
        code_examples: {
          python: "age = int(input())\nprint(age)",
          pascal: "var age: integer;\nbegin\n  readln(age);\n  writeln(age);\nend.",
        },
      },
    }

    const known = resolveKnownLanguageBarOptions(debugTask)
    const learning = resolveLearningLanguageBarOptions(debugTask, ["python", "pascal", "cpp"])

    expect(learning).toEqual(expect.arrayContaining(["python", "pascal"]))
    expect(canSwapParallelLanguages("python", "pascal", known, learning)).toBe(true)
  })
})
