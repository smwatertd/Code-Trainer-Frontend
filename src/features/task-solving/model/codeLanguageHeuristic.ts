/** Best-effort syntax guess for starter / checker language selection. */
export function inferCodeLanguage(code: string): string | null {
  const text = code.trim()
  if (!text) return null

  if (/\bbegin\b[\s\S]*\bend\.?/i.test(text) || /:=|writeln|readln|program\s+\w+/i.test(text)) {
    return "pascal"
  }
  if (/#include|std::|int\s+main\s*\(/i.test(text)) {
    return "cpp"
  }
  if (/\busing\s+System\b|\bConsole\.(?:Write|ReadLine)/i.test(text)) {
    return "csharp"
  }
  if (/\bpublic\s+static\s+void\s+main\b|\bScanner\b/i.test(text)) {
    return "java"
  }
  if (/\bprint\s*\(|\binput\s*\(|for\s+\w+\s+in\s+range\b/i.test(text)) {
    return "python"
  }

  return null
}
