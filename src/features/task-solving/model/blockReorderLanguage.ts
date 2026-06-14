export const BLOCK_REORDER_LANGUAGES = ["python", "cpp", "pascal", "java", "csharp"] as const

const PRINT_NUMBER = /^print\((\d+)\)$/

export function localizeBlockStatement(line: string, language: string): string {
  if (language === "python") return line

  const text = line.trim()
  const quoted = text.match(/^print\(['"](.+?)['"]\)$/)
  if (quoted) {
    const value = quoted[1]
    if (language === "cpp") return `cout << "${value}" << endl;`
    if (language === "pascal") return `WriteLn('${value}');`
    if (language === "java") return `System.out.println("${value}");`
    if (language === "csharp") return `Console.WriteLine("${value}");`
  }

  const numbered = text.match(PRINT_NUMBER)
  if (numbered) {
    const value = numbered[1]
    if (language === "cpp") return `cout << ${value} << endl;`
    if (language === "pascal") return `WriteLn(${value});`
    if (language === "java") return `System.out.println(${value});`
    if (language === "csharp") return `Console.WriteLine(${value});`
  }

  return line
}

export function synthesizeBlocksByLanguage(statements: string[]): Record<string, string[]> {
  return Object.fromEntries(
    BLOCK_REORDER_LANGUAGES.map((language) => [
      language,
      statements.map((line) => localizeBlockStatement(line, language)),
    ]),
  )
}

export const BLOCK_REORDER_TEMPLATES: Record<
  string,
  { header: string; footer: string; joiner: string; linePrefix?: string }
> = {
  python: { header: "", footer: "", joiner: "\n", linePrefix: "" },
  cpp: {
    header: "#include <iostream>\nusing namespace std;\n\nint main() {\n",
    footer: "\n    return 0;\n}",
    joiner: "\n",
    linePrefix: "    ",
  },
  pascal: {
    header: "program Solution;\nbegin\n",
    footer: "\nend.",
    joiner: "\n",
    linePrefix: "  ",
  },
  java: {
    header: "public class Solution {\n  public static void main(String[] args) {\n",
    footer: "\n  }\n}\n",
    joiner: "\n",
    linePrefix: "    ",
  },
  csharp: {
    header: "using System;\n\nclass Solution {\n  static void Main() {\n",
    footer: "\n  }\n}\n",
    joiner: "\n",
    linePrefix: "    ",
  },
}

export function assembleBlockReorderCodeFromLines(lines: string[], language: string): string {
  const template = BLOCK_REORDER_TEMPLATES[language] ?? BLOCK_REORDER_TEMPLATES.python
  const linePrefix = template.linePrefix ?? ""
  const bodyLines = lines
    .filter(Boolean)
    .map((line) => (linePrefix && !line.startsWith(linePrefix) ? `${linePrefix}${line}` : line))

  return `${template.header}${bodyLines.join(template.joiner)}${template.footer}`
}

export function assembleBlockReorderCode(
  blocks: string[],
  order: number[],
  language: string,
): string {
  const lines = order
    .filter((index) => index >= 0 && index < blocks.length)
    .map((index) => blocks[index] ?? "")
    .filter(Boolean)
  return assembleBlockReorderCodeFromLines(lines, language)
}
