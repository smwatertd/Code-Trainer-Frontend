import { describe, expect, it } from "vitest"
import { detectConstructions } from "@/features/task-solving/model/constructionDetector"

describe("detectConstructions", () => {
  it("detects basic python constructs", () => {
    const code = "age = int(input())\nprint(age)"
    const { detected } = detectConstructions(code, "python", [
      "typed_declaration",
      "assignment",
      "stdin_read",
      "stdout_write",
      "program_entry",
    ])

    expect(detected.has("assignment")).toBe(true)
    expect(detected.has("stdin_read")).toBe(true)
    expect(detected.has("stdout_write")).toBe(true)
    expect(detected.has("program_entry")).toBe(true)
  })

  it("detects missing program entry in cpp snippet", () => {
    const code = "int w=4,h=6;\nint p=2*(w+h);\nstd::cout << p;"
    const { detected } = detectConstructions(code, "cpp", [
      "program_entry",
      "stdout_write",
      "arithmetic_ops",
    ])

    expect(detected.has("program_entry")).toBe(false)
    expect(detected.has("stdout_write")).toBe(true)
    expect(detected.has("arithmetic_ops")).toBe(true)
  })

  it("detects pascal program entry", () => {
    const code = "program Main;\nbegin\n  writeln('Hello');\nend."
    const { detected, ranges } = detectConstructions(code, "pascal", [
      "program_entry",
      "stdout_write",
    ])

    expect(detected.has("program_entry")).toBe(true)
    expect(detected.has("stdout_write")).toBe(true)
    expect(ranges.length).toBeGreaterThan(0)
  })

  it("detects if statement in placeholder assembly", () => {
    const code = [
      "name = input()",
      "price = float(input())",
      "count = int(input())",
      "total = price * count",
      "if total >= 0:",
      "    print(name, total)",
      "else:",
      "    print(name, 0)",
    ].join("\n")

    const { detected } = detectConstructions(code, "python", [
      "if_statement",
      "stdin_read",
      "stdout_write",
    ])

    expect(detected.has("if_statement")).toBe(true)
    expect(detected.has("stdin_read")).toBe(true)
    expect(detected.has("stdout_write")).toBe(true)
  })

  it("returns ranges for monaco highlighting", () => {
    const { ranges } = detectConstructions("print('Hello')", "python", ["stdout_write"])
    expect(ranges.length).toBeGreaterThan(0)
    expect(ranges[0]?.pattern).toBe("stdout_write")
  })

  it("detects constructions in assembled pascal hello program", () => {
    const code = "program Main;\nbegin\n  writeln('Hello');\nend."
    const { detected } = detectConstructions(code, "pascal", [
      "program_entry",
      "stdout_write",
    ])

    expect(detected.has("program_entry")).toBe(true)
    expect(detected.has("stdout_write")).toBe(true)
  })

  it("detects program entry in pascal begin/end snippet without program header", () => {
    const code = [
      "var age: integer;",
      "begin",
      "  readln(age);",
      "  writeln(age);",
      "end.",
    ].join("\n")

    const { detected } = detectConstructions(code, "pascal", [
      "program_entry",
      "typed_declaration",
      "stdin_read",
      "stdout_write",
    ])

    expect(detected.has("program_entry")).toBe(true)
    expect(detected.has("typed_declaration")).toBe(true)
    expect(detected.has("stdin_read")).toBe(true)
    expect(detected.has("stdout_write")).toBe(true)
  })

  it("detects counted_loop in python range loop", () => {
    const code = [
      "n = int(input())",
      "count = 0",
      "for i in range(n):",
      "    count += 1",
      "print(count)",
    ].join("\n")

    const { detected } = detectConstructions(code, "python", ["counted_loop", "program_entry"])
    expect(detected.has("counted_loop")).toBe(true)
    expect(detected.has("program_entry")).toBe(true)
  })
})
