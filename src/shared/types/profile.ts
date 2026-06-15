export type SkillProgress = {
  id: string
  label: string
  percent: number
  solved: number
  total: number
}

export type RecentSubmission = {
  id: number
  task_id: number
  task_title: string
  language: string
  status: string
  attempt: number
  created_at: string
}

export type MyProfile = {
  user_id: number
  name: string
  email: string
  role: string
  handle: string
  level: string
  solved_tasks_count: number
  total_tasks_attempted: number
  success_rate: number
  streak_days: number
  groups_count: number
  activity_by_date: Record<string, number>
  recent_submissions: RecentSubmission[]
  skills: SkillProgress[]
}

export type TeacherPublicProfile = {
  kind: "teacher"
  user_id: number
  name: string
  email: string
  handle: string
  initials: string
  bio: string
  groups: Array<{ id: number; name: string; member_count: number }>
  stats: {
    tasks_count: number
    groups_count: number
    students_count: number
    assignment_sets_count: number
  }
  is_own_profile: boolean
}

export type StudentPublicProfile = {
  kind: "student"
  user_id: number
  name: string
  email: string
  handle: string
  initials: string
  level: string
  summary: {
    solved_count: number
    success_rate: number
    streak_days: number
    attempts_count: number
    last_activity_at: string | null
  }
  groups: Array<{ id: number; name: string; teacher_id: number; teacher_name: string }>
  skills: SkillProgress[]
  recent_submissions: RecentSubmission[]
  teacher: { id: number; name: string } | null
  is_own_profile: boolean
}

export type UserProfile = TeacherPublicProfile | StudentPublicProfile
