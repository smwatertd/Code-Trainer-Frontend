export type ResultTone = "success" | "warning" | "error" | "info"

export const RESULT_TONE_STYLES: Record<
  ResultTone,
  {
    title: string
    card: string
    detail: string
    badge: string
  }
> = {
  success: {
    title: "text-primary",
    card: "border-primary/40 bg-primary/10",
    detail: "text-primary/80",
    badge: "border-primary/30 bg-primary/15 text-primary",
  },
  warning: {
    title: "text-amber-400",
    card: "border-amber-500/40 bg-amber-500/10",
    detail: "text-amber-300/80",
    badge: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  },
  error: {
    title: "text-destructive",
    card: "border-destructive/40 bg-destructive/10",
    detail: "text-destructive/80",
    badge: "border-destructive/30 bg-destructive/15 text-destructive",
  },
  info: {
    title: "text-secondary",
    card: "border-secondary/40 bg-secondary/10",
    detail: "text-secondary/80",
    badge: "border-secondary/30 bg-secondary/15 text-secondary",
  },
}

export const ISSUE_SECTION_TONES = {
  compiler: "error",
  linter: "warning",
  pattern: "info",
  tests: "warning",
} as const satisfies Record<string, ResultTone>

export function toneForTestStatus(status: string): ResultTone {
  const normalized = status.toUpperCase()
  if (normalized === "PASSED") return "success"
  if (normalized === "ERROR") return "error"
  return "warning"
}
