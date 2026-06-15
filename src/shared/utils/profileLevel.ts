export function levelLabelFromSolved(solved: number): string {
  if (solved >= 80) return "Middle"
  if (solved >= 30) return "Junior"
  if (solved >= 10) return "Newcomer"
  return "Beginner"
}

export function computeStreakDays(activityByDate: Record<string, number>): number {
  const today = new Date()
  let streak = 0
  const cursor = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))

  while (true) {
    const key = cursor.toISOString().slice(0, 10)
    if ((activityByDate[key] ?? 0) <= 0) break
    streak += 1
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  return streak
}
