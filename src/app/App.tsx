import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom"
import { lazy, Suspense, type ReactNode } from "react"
import { AuthProvider, useAuth } from "@/features/auth"
import { useLanguages } from "@/features/languages/hooks/useLanguages"
import AppShell from "@/shared/ui/AppShell"
import ProtectedRoute from "@/shared/ui/ProtectedRoute"
import VerifyEmailBanner from "@/shared/ui/VerifyEmailBanner"
import { canAccessTeacherWorkspace } from "@/shared/types/user"

const CurriculumAdminPage = lazy(() => import("@/pages/Admin/CurriculumAdminPage"))
const LoginPage = lazy(() => import("@/pages/Auth/LoginPage"))
const RegisterPage = lazy(() => import("@/pages/Auth/RegisterPage"))
const ResetPasswordPage = lazy(() => import("@/pages/Auth/ResetPasswordPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))
const HomePage = lazy(() => import("@/pages/Student/HomePage"))
const TaskPage = lazy(() => import("@/pages/Student/TaskPage"))
const ProfilePage = lazy(() => import("@/pages/Student/ProfilePage"))
const UserProfilePage = lazy(() => import("@/pages/Users/UserProfilePage"))

function TaskPageRoute() {
  const { id } = useParams()
  return <TaskPage key={id} />
}

const TaskCurriculumPage = lazy(() => import("@/pages/Teacher/TaskCurriculumPage"))
const TeacherGroupsPage = lazy(() => import("@/pages/Teacher/GroupsPage"))
const TeacherGroupDashboardPage = lazy(() => import("@/pages/Teacher/GroupDashboardPage"))
const TeacherTaskLibraryPage = lazy(() => import("@/pages/Teacher/TaskLibraryPage"))
const TeacherAssignmentSetsPage = lazy(() => import("@/pages/Teacher/AssignmentSetsPage"))
const JoinGroupPage = lazy(() => import("@/pages/Student/JoinGroupPage"))
const StudentAssignmentSetsPage = lazy(() => import("@/pages/Student/AssignmentSetsPage"))
const LearnTracksPage = lazy(() => import("@/pages/Student/LearnTracksPage"))
const LearnTrackPage = lazy(() => import("@/pages/Student/LearnTrackPage"))
const CollectionShowcasePage = lazy(() => import("@/pages/Student/CollectionShowcasePage"))
const TeacherCabinetPage = lazy(() => import("@/pages/Teacher/TeacherCabinetPage"))
const TeacherTaskEditorPage = lazy(() => import("@/pages/Teacher/TeacherTaskEditorPage"))
const SettingsLayout = lazy(() => import("@/pages/Settings/SettingsLayout"))

function PageFallback() {
  return <p className="px-4 py-12 text-center text-muted-foreground">Загрузка…</p>
}

function RedirectDemoTask() {
  const { id } = useParams()
  return <Navigate to={`/tasks/${id ?? ""}`} replace />
}

function RedirectTeacherProfile() {
  const { teacherId } = useParams()
  return <Navigate to={`/users/${teacherId ?? ""}`} replace />
}

function RedirectStudentProfile() {
  const { studentId } = useParams()
  const { user } = useAuth()
  const teacherQuery =
    user && canAccessTeacherWorkspace(user) ? `?teacherId=${user.id}` : ""
  return <Navigate to={`/users/${studentId ?? ""}${teacherQuery}`} replace />
}

function AuthenticatedRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isCheckingAuth } = useAuth()
  return (
    <ProtectedRoute
      isAuthenticated={isAuthenticated}
      isCheckingAuth={isCheckingAuth}
      user={user}
      allowedRoles={["student", "teacher", "admin"]}
    >
      {children}
    </ProtectedRoute>
  )
}

function AppRoutes() {
  const { user, isAuthenticated, isCheckingAuth, logout } = useAuth()
  useLanguages()

  return (
    <>
      <VerifyEmailBanner />
      <AppShell user={user} onLogout={() => void logout()}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/demo" element={<Navigate to="/" replace />} />
            <Route path="/demo/tasks/:id" element={<RedirectDemoTask />} />
            <Route
              path="/users/:userId"
              element={
                <AuthenticatedRoute>
                  <UserProfilePage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/teachers/:teacherId"
              element={
                <AuthenticatedRoute>
                  <RedirectTeacherProfile />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/students/:studentId"
              element={
                <AuthenticatedRoute>
                  <RedirectStudentProfile />
                </AuthenticatedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnTracksPage />} />
            <Route path="/learn/:language" element={<LearnTrackPage />} />
            <Route path="/learn/:language/:conceptId" element={<CollectionShowcasePage />} />
            <Route path="/tasks/:id" element={<TaskPageRoute />} />
            <Route
              path="/student/profile"
              element={
                <AuthenticatedRoute>
                  <ProfilePage />
                </AuthenticatedRoute>
              }
            />
            <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
            <Route
              path="/student/groups"
              element={<Navigate to="/assignment-sets" replace />}
            />
            <Route
              path="/groups/join"
              element={
                <AuthenticatedRoute>
                  <JoinGroupPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/assignment-sets"
              element={
                <AuthenticatedRoute>
                  <StudentAssignmentSetsPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <AuthenticatedRoute>
                  <SettingsLayout />
                </AuthenticatedRoute>
              }
            >
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<SettingsProfileTabLazy />} />
              <Route path="security" element={<SettingsSecurityTabLazy />} />
              <Route path="learning" element={<SettingsLearningTabLazy />} />
              <Route path="teacher" element={<SettingsTeacherTabLazy />} />
            </Route>
            <Route
              path="/teacher/tasks/new"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isCheckingAuth={isCheckingAuth}
                  user={user}
                  allowedRoles={["teacher", "admin"]}
                >
                  <TeacherTaskEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/tasks/:id/edit"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isCheckingAuth={isCheckingAuth}
                  user={user}
                  allowedRoles={["teacher", "admin"]}
                >
                  <TeacherTaskEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/cabinet"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isCheckingAuth={isCheckingAuth}
                  user={user}
                  allowedRoles={["teacher", "admin"]}
                >
                  <TeacherCabinetPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/groups/:id/dashboard"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isCheckingAuth={isCheckingAuth}
                  user={user}
                  allowedRoles={["teacher", "admin"]}
                >
                  <TeacherGroupDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/groups"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isCheckingAuth={isCheckingAuth}
                  user={user}
                  allowedRoles={["teacher", "admin"]}
                >
                  <TeacherGroupsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/tasks/library"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isCheckingAuth={isCheckingAuth}
                  user={user}
                  allowedRoles={["teacher", "admin"]}
                >
                  <TeacherTaskLibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/assignment-sets"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isCheckingAuth={isCheckingAuth}
                  user={user}
                  allowedRoles={["teacher", "admin"]}
                >
                  <TeacherAssignmentSetsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/tasks/:id/curriculum"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isCheckingAuth={isCheckingAuth}
                  user={user}
                  allowedRoles={["teacher", "admin"]}
                >
                  <TaskCurriculumPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/curriculum/:lang"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isCheckingAuth={isCheckingAuth}
                  user={user}
                  allowedRoles={["admin"]}
                >
                  <CurriculumAdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<Navigate to="/admin/curriculum/python" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </>
  )
}

const SettingsProfileTabLazy = lazy(async () => {
  const module = await import("@/pages/Settings/SettingsLayout")
  return { default: module.SettingsProfileTab }
})
const SettingsSecurityTabLazy = lazy(async () => {
  const module = await import("@/pages/Settings/SettingsLayout")
  return { default: module.SettingsSecurityTab }
})
const SettingsLearningTabLazy = lazy(async () => {
  const module = await import("@/pages/Settings/SettingsLayout")
  return { default: module.SettingsLearningTab }
})
const SettingsTeacherTabLazy = lazy(async () => {
  const module = await import("@/pages/Settings/SettingsLayout")
  return { default: module.SettingsTeacherTab }
})

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
