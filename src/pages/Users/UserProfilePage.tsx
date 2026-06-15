import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { useUserProfile } from "@/features/profiles/hooks/useProfile"
import StudentPublicProfileView from "@/features/users/ui/StudentPublicProfileView"
import TeacherPublicProfileView from "@/features/users/ui/TeacherPublicProfileView"
import ApiErrorAlert from "@/shared/ui/ApiErrorAlert"
import { Button } from "@/shared/ui/button"
import { canAccessTeacherWorkspace } from "@/shared/types/user"

export default function UserProfilePage() {
  const { userId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const numericUserId = Number(userId)
  const teacherIdParam = searchParams.get("teacherId")
  const teacherId = teacherIdParam ? Number(teacherIdParam) : null

  const profileQuery = useUserProfile(numericUserId, teacherId, Number.isFinite(numericUserId))

  return (
    <div>
      <Button type="button" variant="ghost" size="sm" className="mb-3.5" onClick={() => navigate(-1)}>
        ← Назад
      </Button>

      {profileQuery.isLoading ? <p className="text-sm text-ink-muted">Загрузка профиля…</p> : null}
      {profileQuery.isError ? <ApiErrorAlert error={profileQuery.error} /> : null}

      {profileQuery.data?.kind === "teacher" ? (
        <TeacherPublicProfileView profile={profileQuery.data} />
      ) : null}

      {profileQuery.data?.kind === "student" ? (
        <StudentPublicProfileView
          profile={profileQuery.data}
          viewerIsTeacher={canAccessTeacherWorkspace(user)}
        />
      ) : null}
    </div>
  )
}
