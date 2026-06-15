export const PLACEHOLDER_TOKEN = "___"

export function isStubCodeExample(value: string): boolean {
  const text = value.trim().toLowerCase()
  return !text || text === "# placeholder task" || text === "pass"
}

export function countPlaceholderSlots(template: string, token = PLACEHOLDER_TOKEN): number {
  if (!template) return 0
  return template.split(token).length - 1
}

export function assemblePlaceholderCode(
  template: string,
  fills: string[],
  token = PLACEHOLDER_TOKEN,
): string {
  const parts = template.split(token)
  if (parts.length <= 1) return template
  let result = parts[0] ?? ""
  for (let index = 0; index < parts.length - 1; index += 1) {
    result += (fills[index] ?? token) + (parts[index + 1] ?? "")
  }
  return result
}

export function getPlaceholderTemplate(task: { payload: Record<string, unknown> } | null): string {
  if (!task) return ""
  const payload = task.payload
  return String(payload.placeholder_template ?? payload.template_code ?? "")
}

export function getPlaceholderBank(task: { payload: Record<string, unknown> } | null): string[] {
  if (!task) return []
  const raw = task.payload.placeholder_bank ?? task.payload.bank_blocks
  if (!Array.isArray(raw)) return []
  return raw.map((item) => String(item)).filter(Boolean)
}
