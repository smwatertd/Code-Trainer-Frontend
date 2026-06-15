import { useMemo } from "react"
import { cn } from "@/shared/ui/cn"
import { buildContribGrid, buildSeedContribGrid } from "@/shared/utils/contribGraph"

const MONTH_NAMES = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
]

type ContribGraphProps = {
  weeks?: number
  pp?: boolean
  byDate?: Record<string, number>
}

export default function ContribGraph({ weeks = 26, pp = false, byDate }: ContribGraphProps) {
  const hasActivity = byDate && Object.keys(byDate).length > 0
  const grid = useMemo(
    () => (hasActivity ? buildContribGrid(byDate!, weeks) : buildSeedContribGrid(weeks)),
    [byDate, hasActivity, weeks],
  )

  const totalDays = weeks * 7
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const startDate = new Date(end)
  startDate.setUTCDate(end.getUTCDate() - (totalDays - 1))

  const monthCells = Array.from({ length: weeks }, () => "")
  let lastMonth = -1
  for (let week = 0; week < weeks; week += 1) {
    const date = new Date(startDate)
    date.setUTCDate(startDate.getUTCDate() + week * 7)
    const month = date.getUTCMonth()
    if (month !== lastMonth) {
      monthCells[week] = MONTH_NAMES[month] ?? ""
      lastMonth = month
    }
  }

  return (
    <div className={cn("contrib-wrap", pp && "pp")} data-testid="contrib-graph">
      <div
        className="contrib-months"
        style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}
      >
        {monthCells.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
      <div className="contrib-grid">
        <div className="contrib-days">
          {["", "Пн", "", "Ср", "", "Пт", ""].map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
        <div className="contrib-weeks">
          {grid.map((week, weekIndex) => (
            <div key={weekIndex} className="contrib-week">
              {week.map((level, dayIndex) => (
                <i key={dayIndex} className={level ? `l${level}` : undefined} title="" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="contrib-legend">
        меньше
        {[1, 2, 3, 4].map((level) => (
          <i key={level} className={level ? `l${level}` : undefined} />
        ))}
        больше
      </div>
    </div>
  )
}
