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

export function isStructuralProgramBlocks(lines: string[]): boolean {
  const joined = lines.join("\n").toLowerCase()
  if (
    /\bprogram\b/.test(joined) ||
    joined.trimStart().startsWith("begin") ||
    joined.includes("#include") ||
    joined.includes("public class") ||
    joined.includes("using system")
  ) {
    return true
  }
  // TC42 Pascal fragments: var ... begin ... end.
  return joined.includes("begin") && (joined.includes("end.") || joined.includes("end;"))
}

/** Whether block lines fit the target language (e.g. Pascal skeleton vs Python statements). */
export function blocksMatchLanguageParadigm(lines: string[], language: string): boolean {
  const lang = String(language || "python").toLowerCase()
  const structural = isStructuralProgramBlocks(lines)
  const joined = lines.join("\n").toLowerCase()

  if (lang === "python") {
    return !structural
  }
  if (lang === "pascal") {
    return structural && (/\bprogram\b/.test(joined) || joined.trimStart().startsWith("begin"))
  }
  if (lang === "cpp") {
    return structural ? joined.includes("#include") : true
  }
  if (lang === "java") {
    return structural ? joined.includes("public class") : true
  }
  if (lang === "csharp") {
    return structural ? joined.includes("using system") : true
  }
  return true
}

export function normalizeProgramCode(text: string): string {
  return text
    .trim()
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
}

export function assembleBlockReorderCodeFromLines(lines: string[], language: string): string {
  const filtered = lines.filter(Boolean)
  if (isStructuralProgramBlocks(filtered)) {
    return normalizeProgramCode(filtered.join("\n"))
  }
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
