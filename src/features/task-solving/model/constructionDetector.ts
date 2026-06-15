export type ConstructionRange = {
  pattern: string
  startLine: number
  startColumn: number
  endLine: number
  endColumn: number
}

type LanguageRules = Record<string, RegExp[]>

const CONSTRUCTION_RULES: Record<string, LanguageRules> = {
  program_entry: {
    python: [/\bdef\s+main\s*\(/, /\bif\s+__name__\s*==/],
    pascal: [/\bprogram\b/i, /\bbegin\b[\s\S]*\bend\./i],
    cpp: [/\bint\s+main\s*\(/, /\bmain\s*\(/],
    java: [/\bpublic\s+static\s+void\s+main\s*\(/],
    csharp: [/\bstatic\s+void\s+Main\s*\(/],
  },
  typed_declaration: {
    python: [/\b\w+\s*:\s*\w+/, /\b\w+\s*=\s*(?:int|float|str)\(/],
    pascal: [/\bvar\b/i],
    cpp: [/\b(?:int|float|double|char|bool|long|string|auto)\s+\w+/],
    java: [/\b(?:int|float|double|char|boolean|long|String)\s+\w+/],
    csharp: [/\b(?:int|float|double|char|bool|long|string|var)\s+\w+/],
  },
  assignment: {
    python: [/\b\w+\s*=(?!=)/],
    pascal: [/\b\w+\s*:=/, /\breadln\s*\(/i],
    cpp: [/\b\w+\s*=(?!=)/],
    java: [/\b\w+\s*=(?!=)/],
    csharp: [/\b\w+\s*=(?!=)/],
  },
  arithmetic_ops: {
    python: [/[+\-*/%](?!=)/],
    pascal: [/[+\-*/](?!=)/],
    cpp: [/[+\-*/%](?!=)/],
    java: [/[+\-*/%](?!=)/],
    csharp: [/[+\-*/%](?!=)/],
  },
  stdout_write: {
    python: [/\bprint\s*\(/],
    pascal: [/\bwriteln\b/i, /\bwrite\b/i],
    cpp: [/\bcout\b/, /\bprintf\s*\(/],
    java: [/\bSystem\.out\.(?:print|println)\b/],
    csharp: [/\bConsole\.(?:Write|WriteLine)\b/],
  },
  stdin_read: {
    python: [/\binput\s*\(/],
    pascal: [/\breadln\b/i, /\bread\b/i],
    cpp: [/\bcin\s*>>/],
    java: [/\bnext(?:Int|Line|Double)?\s*\(/, /\bScanner\b/],
    csharp: [/\bConsole\.ReadLine\s*\(/],
  },
  if_statement: {
    python: [/\bif\b/],
    pascal: [/\bif\b/i],
    cpp: [/\bif\b/],
    java: [/\bif\b/],
    csharp: [/\bif\b/],
  },
  simple_branch: {
    python: [/\bif\b/, /\belif\b/, /\belse\b/],
    pascal: [/\bif\b/i, /\bthen\b/i, /\belse\b/i],
    cpp: [/\bif\b/, /\belse\b/],
    java: [/\bif\b/, /\belse\b/],
    csharp: [/\bif\b/, /\belse\b/],
  },
  for_loop: {
    python: [/\bfor\b/],
    pascal: [/\bfor\b/i],
    cpp: [/\bfor\b/],
    java: [/\bfor\b/],
    csharp: [/\bfor\b/],
  },
  while_loop: {
    python: [/\bwhile\b/],
    pascal: [/\bwhile\b/i],
    cpp: [/\bwhile\b/],
    java: [/\bwhile\b/],
    csharp: [/\bwhile\b/],
  },
  counted_loop: {
    python: [/\bfor\s+\w+\s+in\s+range\s*\(/],
    pascal: [/\bfor\s+\w+\s*:=\s*\d+\s+to\b/i, /\bfor\s+\w+\s*:=\s*\w+\s+downto\b/i],
    cpp: [/\bfor\s*\(\s*int\s+\w+\s*=\s*\d+/],
    java: [/\bfor\s*\(\s*int\s+\w+\s*=\s*\d+/],
    csharp: [/\bfor\s*\(\s*int\s+\w+\s*=\s*\d+/],
  },
}

function normalizeLanguage(language: string): string {
  const lang = language.trim().toLowerCase()
  if (lang === "javascript" || lang === "js") return "python"
  return lang
}

function indexToPosition(code: string, index: number): { line: number; column: number } {
  const before = code.slice(0, index)
  const lines = before.split("\n")
  return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 }
}

function collectRegexMatches(
  code: string,
  pattern: string,
  regex: RegExp,
): ConstructionRange[] {
  const flags = regex.flags.includes("g") ? regex.flags : `${regex.flags}g`
  const matcher = new RegExp(regex.source, flags)
  const ranges: ConstructionRange[] = []

  for (const match of code.matchAll(matcher)) {
    const text = match[0]
    if (!text) continue
    const startIndex = match.index ?? 0
    const endIndex = startIndex + text.length
    const start = indexToPosition(code, startIndex)
    const end = indexToPosition(code, endIndex)
    ranges.push({
      pattern,
      startLine: start.line,
      startColumn: start.column,
      endLine: end.line,
      endColumn: end.column,
    })
  }

  return ranges
}

export function detectConstructions(
  code: string,
  language: string,
  patterns: string[],
): { detected: Set<string>; ranges: ConstructionRange[] } {
  const detected = new Set<string>()
  const ranges: ConstructionRange[] = []
  if (!code.trim() || patterns.length === 0) {
    return { detected, ranges }
  }

  const lang = normalizeLanguage(language)

  for (const pattern of patterns) {
    const rules = CONSTRUCTION_RULES[pattern]
    if (!rules) continue

    const regexes = rules[lang] ?? rules.python ?? []
    let found = false
    for (const regex of regexes) {
      const matches = collectRegexMatches(code, pattern, regex)
      if (matches.length > 0) {
        found = true
        ranges.push(...matches)
      }
    }
    if (found) detected.add(pattern)
  }

  // Python scripts without explicit main still have an entry point when they execute code.
  if (
    patterns.includes("program_entry") &&
    !detected.has("program_entry") &&
    lang === "python" &&
    /^\s*(?:print|input|def|class|\w+\s*=)/m.test(code)
  ) {
    detected.add("program_entry")
  }

  // Pascal snippets often use begin/end without a program header.
  if (
    patterns.includes("program_entry") &&
    !detected.has("program_entry") &&
    lang === "pascal" &&
    /\bbegin\b[\s\S]*\bend\./i.test(code)
  ) {
    detected.add("program_entry")
  }

  return { detected, ranges }
}
