import { Link, useNavigate } from "react-router-dom"
import type { StudentPublicProfile } from "@/shared/types/profile"
import CatalogStatusBadge from "@/features/catalog/ui/CatalogStatusBadge"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/ui/cn"
import { mapSubmissionStatus } from "@/shared/utils/submissionStatus"

type StudentPublicProfileViewProps = {
  profile: StudentPublicProfile
  viewerIsTeacher?: boolean
}

function submissionStatus(status: string): "solved" | "attempted" | "todo" {
  return mapSubmissionStatus(status)
}

export default function StudentPublicProfileView({
  profile,
  viewerIsTeacher = false,
}: StudentPublicProfileViewProps) {
  const navigate = useNavigate()
  const summary = profile.summary

  return (
    <div>
      <div className="spp-hero">
        <div className="spp-hero-main">
          <div className="spp-avatar">{profile.initials}</div>
          <div className="min-w-0">
            <h1 className="spp-name">{profile.name}</h1>
            <p className="spp-username">{profile.handle}</p>
            <div className="spp-meta">
              <Badge variant="default">Студент</Badge>
              <Badge variant="default">Уровень · {profile.level}</Badge>
            </div>
          </div>
        </div>
        <div className="spp-stats">
          <div className="spp-stat">
            <div className="v lime">{summary.solved_count}</div>
            <div className="l">Решено задач</div>
          </div>
          <div className="spp-stat">
            <div className="v">{summary.success_rate}%</div>
            <div className="l">Точность</div>
          </div>
          <div className="spp-stat">
            <div className="v lime">
              {summary.streak_days}
              {summary.streak_days > 0 ? " 🔥" : ""}
            </div>
            <div className="l">Серия дней</div>
          </div>
          <div className="spp-stat">
            <div className="v purple">{summary.attempts_count}</div>
            <div className="l">Попыток</div>
          </div>
        </div>
      </div>

      <div className="spp-grid">
        <div className="grid gap-[18px]">
          <section className="spp-section">
            <div className="spp-section-h">
              <b>Навыки</b>
            </div>
            {profile.skills.length === 0 ? (
              <p className="text-sm text-ink-muted">Пока недостаточно данных по учебному треку.</p>
            ) : (
              profile.skills.map((skill, index) => (
                <div key={skill.id} className="spp-skill">
                  <div className="spp-skill-h">
                    <span>
                      <span className="name">{skill.label}</span>
                      <span className="sub">
                        {skill.solved} / {skill.total}
                      </span>
                    </span>
                    <span className={cn("pct", index % 2 === 1 && "pp")}>{skill.percent}%</span>
                  </div>
                  <div className={cn("tp-progress", index % 2 === 1 && "pp")}>
                    <i style={{ width: `${skill.percent}%` }} />
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="spp-section">
            <div className="spp-section-h">
              <b>Последние решения</b>
              <span className="small">{profile.recent_submissions.length}</span>
            </div>
            {profile.recent_submissions.length === 0 ? (
              <p className="text-sm text-ink-muted">Пока нет отправленных решений.</p>
            ) : (
              <table className="catalog-table w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-ink-muted">
                    <th className="pb-2 pr-3">Задача</th>
                    <th className="pb-2 pr-3">Язык</th>
                    <th className="pb-2 pr-3">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.recent_submissions.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/60 last:border-0"
                      onClick={() => navigate(`/tasks/${row.task_id}`)}
                    >
                      <td className="t-name py-2.5 pr-3">{row.task_title}</td>
                      <td className="py-2.5 pr-3 text-ink-muted">{row.language}</td>
                      <td className="py-2.5 pr-3">
                        <CatalogStatusBadge status={submissionStatus(row.status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        <div className="grid gap-[18px]">
          {viewerIsTeacher ? (
            <section className="spp-section compact">
              <div className="grid gap-2">
                <Button type="button" className="w-full">
                  ✉ Написать студенту
                </Button>
                <Button type="button" variant="secondary" className="w-full">
                  Подробная аналитика
                </Button>
              </div>
            </section>
          ) : null}

          <section className="spp-section">
            <div className="spp-section-h">
              <b>Группы</b>
              <span className="small">{profile.groups.length}</span>
            </div>
            {profile.groups.length === 0 ? (
              <p className="m-0 text-[13px] text-ink-faint">Студент не состоит ни в одной группе.</p>
            ) : (
              profile.groups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className="tpp-listitem w-full text-left"
                  onClick={() => navigate("/assignment-sets")}
                >
                  <div className="ico">{group.name.slice(0, 2).toUpperCase()}</div>
                  <div className="body">
                    <b>{group.name}</b>
                    <span>
                      {group.teacher_name} ·{" "}
                      <Link
                        to={`/users/${group.teacher_id}`}
                        className="text-lime hover:underline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        профиль
                      </Link>
                    </span>
                  </div>
                  <span className="arr">→</span>
                </button>
              ))
            )}
          </section>

          {profile.teacher ? (
            <section className="spp-section">
              <div className="spp-section-h">
                <b>Преподаватель</b>
              </div>
              <Link to={`/users/${profile.teacher.id}`} className="font-semibold text-lime hover:underline">
                {profile.teacher.name}
              </Link>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
