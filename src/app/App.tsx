import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom"
import { lazy, Suspense } from "react"
import { AuthProvider, useAuth } from "@/features/auth"
import { useLanguages } from "@/features/languages/hooks/useLanguages"
import AppShell from "@/shared/ui/AppShell"
import ProtectedRoute from "@/shared/ui/ProtectedRoute"

const CurriculumAdminPage = lazy(() => import("@/pages/Admin/CurriculumAdminPage"))
const LoginPage = lazy(() => import("@/pages/Auth/LoginPage"))
const RegisterPage = lazy(() => import("@/pages/Auth/RegisterPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))
const HomePage = lazy(() => import("@/pages/Student/HomePage"))
const TaskPage = lazy(() => import("@/pages/Student/TaskPage"))

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

function PageFallback() {
  return <p className="px-4 py-12 text-center text-muted-foreground">Загрузка…</p>
}

function RedirectDemoTask() {
  const { id } = useParams()
  return <Navigate to={`/tasks/${id ?? ""}`} replace />
}

function AppRoutes() {
  const { user, isAuthenticated, isCheckingAuth, logout } = useAuth()
  useLanguages()

  return (
    <AppShell user={user} onLogout={() => void logout()}>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/demo" element={<Navigate to="/" replace />} />
          <Route path="/demo/tasks/:id" element={<RedirectDemoTask />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks/:id" element={<TaskPageRoute />} />
          <Route
            path="/groups/join"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isCheckingAuth={isCheckingAuth}
                user={user}
                allowedRoles={["student", "teacher", "admin"]}
              >
                <JoinGroupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignment-sets"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                isCheckingAuth={isCheckingAuth}
                user={user}
                allowedRoles={["student", "teacher", "admin"]}
              >
                <StudentAssignmentSetsPage />
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
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
