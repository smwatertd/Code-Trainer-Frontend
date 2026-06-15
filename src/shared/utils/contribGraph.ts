export function levelFromCount(count: number, maxDaily: number): number {
  if (count <= 0 || maxDaily <= 0) return 0
  const ratio = count / maxDaily
  if (ratio >= 0.85) return 4
  if (ratio >= 0.6) return 3
  if (ratio >= 0.35) return 2
  return 1
}

export function buildContribGrid(byDate: Record<string, number>, weeks = 26): number[][] {
  const totalDays = weeks * 7
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const start = new Date(end)
  start.setUTCDate(end.getUTCDate() - (totalDays - 1))

  const counts: number[] = []
  const grid: number[][] = []

  for (let week = 0; week < weeks; week += 1) {
    const days: number[] = []
    for (let day = 0; day < 7; day += 1) {
      const cell = new Date(start)
      cell.setUTCDate(start.getUTCDate() + week * 7 + day)
      const key = cell.toISOString().slice(0, 10)
      const count = byDate[key] ?? 0
      days.push(count)
      counts.push(count)
    }
    grid.push(days)
  }

  const maxDaily = Math.max(...counts, 1)
  return grid.map((week) => week.map((count) => levelFromCount(count, maxDaily)))
}

export function buildSeedContribGrid(weeks = 26): number[][] {
  const out: number[][] = []
  let seed = 7
  for (let week = 0; week < weeks; week += 1) {
    const days: number[] = []
    for (let day = 0; day < 7; day += 1) {
      seed = (seed * 16807 + 7) % 2147483647
      const ratio = (seed % 100) / 100
      if (ratio <= 0.55) days.push(0)
      else if (ratio <= 0.62) days.push(1)
      else if (ratio <= 0.72) days.push(2)
      else if (ratio <= 0.85) days.push(3)
      else days.push(4)
    }
    out.push(days)
  }
  return out
}
