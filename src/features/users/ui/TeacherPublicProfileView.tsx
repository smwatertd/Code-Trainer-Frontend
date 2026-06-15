import { Link, useNavigate } from "react-router-dom"
import type { TeacherPublicProfile } from "@/shared/types/profile"
import StatCard from "@/shared/ui/StatCard"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"

type TeacherPublicProfileViewProps = {
  profile: TeacherPublicProfile
}

export default function TeacherPublicProfileView({ profile }: TeacherPublicProfileViewProps) {
  const navigate = useNavigate()

  return (
    <div>
      <div className="tpp-hero">
        <div className="tpp-hero-main">
          <div className="tpp-avatar">{profile.initials}</div>
          <div className="min-w-0">
            <h1 className="tpp-name">{profile.name}</h1>
            <p className="tpp-username">{profile.handle}</p>
            <div className="tpp-meta">
              <Badge variant="secondary">Преподаватель</Badge>
              <span className="online-dot">
                <i />
                онлайн
              </span>
            </div>
          </div>
        </div>
        <div className="tpp-cta">
          <Button type="button" onClick={() => window.alert("Сообщения будут доступны позже")}>
            ✉ Написать сообщение
          </Button>
          <p className="m-0 text-center text-xs text-ink-faint">обычно отвечает в течение 2 часов</p>
        </div>
      </div>

      <div className="tp-cards3 mb-[18px]">
        <StatCard label="Задач" value={profile.stats.tasks_count} badgeKind="lime" />
        <StatCard
          label="Групп"
          value={profile.stats.groups_count}
          badge={`${profile.stats.students_count} студентов`}
          badgeKind="purple"
        />
        <StatCard
          label="Сборников"
          value={profile.stats.assignment_sets_count}
          badgeKind="muted"
        />
      </div>

      <div className="tpp-grid">
        <div className="grid gap-[18px]">
          <section className="tpp-section">
            <div className="tpp-section-h">
              <b>О преподавателе</b>
            </div>
            <p className="tpp-quote">
              Алгоритмы — это способ думать, а не зубрить. Главное — научиться формулировать задачу.
            </p>
            <p className="tpp-bio">{profile.bio || "Преподаватель платформы."}</p>
          </section>

          <section className="tpp-section">
            <div className="tpp-section-h">
              <b>Группы</b>
              <span className="small">{profile.groups.length} активных</span>
            </div>
            {profile.groups.length === 0 ? (
              <p className="m-0 text-[13px] text-ink-faint">У преподавателя пока нет открытых групп.</p>
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
                    <span>{group.member_count} студентов</span>
                  </div>
                  <span className="arr">→</span>
                </button>
              ))
            )}
          </section>
        </div>

        <div className="grid gap-[18px]">
          <section className="tpp-section">
            <div className="tpp-section-h">
              <b>Активность</b>
            </div>
            <div className="tpp-activity-row good">
              <div className="ico">●</div>
              <div className="body">
                <b>Доступен на платформе</b>
                <span>ведёт {profile.stats.groups_count} групп</span>
              </div>
            </div>
            <div className="tpp-activity-row good">
              <div className="ico">↩</div>
              <div className="body">
                <b>Отвечает быстро</b>
                <span>обычно в течение 2 часов</span>
              </div>
            </div>
          </section>

          {profile.is_own_profile ? (
            <section className="tpp-section">
              <div className="tpp-section-h">
                <b>Кабинет</b>
              </div>
              <Button type="button" variant="secondary" className="w-full" asChild>
                <Link to="/teacher/cabinet">Открыть кабинет преподавателя</Link>
              </Button>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
