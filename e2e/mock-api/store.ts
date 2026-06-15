import {
  buildMockCollectionShowcase,
  buildMockLanguageTrack,
  curriculumValidation,
  emptyLearningProgress,
  MOCK_DEV_USERS,
  MOCK_LANGUAGES,
  MOCK_TASKS,
  successCheckResult,
} from "./data"

type User = {
  id: number
  email: string
  password: string
  name: string
  role: string
}

type Group = {
  id: number
  name: string
  teacher_id: number
  created_at: string
}

type Invitation = {
  id: number
  code: string
  group_id: number
  max_uses: number | null
  use_count: number
  expires_at: string | null
  is_active: boolean
}

type AssignmentSet = {
  id: number
  name: string
  description: string
  teacher_id: number
  visibility: string
  group_id: number | null
  is_archived: boolean
  items: Array<{ task_id: number; sort_order: number }>
  created_at: string
  deadline_at: string | null
}

type CurriculumLink = {
  id: number
  task_id: number
  language: string
  learning_concept_id: string
  technical_concept_id: string
  exercise_pattern_id: string
  is_primary: boolean
}

type TaskProgress = {
  task_id: number
  progress_status: string
  attempts_count: number
  passed_count: number
  last_status: string | null
}

type TeacherOwnedTask = {
  id: number
  owner_user_id: number
  title: string
  description: string
  difficulty: string
  task_type: string
  payload: Record<string, unknown>
}

type MockResponse = { status: number; body: unknown }

function nowIso() {
  return new Date().toISOString()
}

function authTokens(userId: number) {
  return {
    access_token: `mock-access-${userId}`,
    refresh_token: `mock-refresh-${userId}`,
    token_type: "bearer",
    expires_in: 3600,
  }
}

function parseUserIdFromToken(authorization: string | null): number | null {
  if (!authorization?.startsWith("Bearer mock-access-")) return null
  const id = Number(authorization.replace("Bearer mock-access-", ""))
  return Number.isFinite(id) ? id : null
}

function randomInviteCode() {
  return `INV${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

function summaryLanguages(payload: Record<string, unknown>): string[] {
  const languages = new Set<string>()
  for (const key of ["source_language", "target_language", "language"]) {
    const value = payload[key]
    if (typeof value === "string" && value.trim()) languages.add(value.trim().toLowerCase())
  }
  const blocksByLanguage = payload.blocks_by_language
  if (blocksByLanguage && typeof blocksByLanguage === "object") {
    for (const key of Object.keys(blocksByLanguage as Record<string, unknown>)) {
      if (key) languages.add(key.toLowerCase())
    }
  }
  return Array.from(languages).sort()
}

function toCatalogSummary(
  task: (typeof MOCK_TASKS)[number],
  store: MockApiStore,
  userId: number | null,
) {
  const progress =
    userId != null
      ? store.taskProgress.get(store.progressKey(userId, task.id))
      : undefined
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    difficulty: task.difficulty,
    task_type: task.task_type,
    topics: [],
    languages: summaryLanguages(task.payload),
    constructions: Array.isArray(task.payload.constructions)
      ? task.payload.constructions.filter((value): value is string => typeof value === "string")
      : [],
    progress_status:
      userId != null ? progress?.progress_status ?? "not_started" : null,
  }
}

export class MockApiStore {
  users: User[] = []
  groups: Group[] = []
  groupMembers = new Map<number, Set<number>>()
  invitations: Invitation[] = []
  assignmentSets: AssignmentSet[] = []
  curriculumLinks = new Map<number, CurriculumLink[]>()
  taskProgress = new Map<string, TaskProgress>()
  learningProgress = new Map<string, ReturnType<typeof emptyLearningProgress>>()
  demoJobs = new Map<string, ReturnType<typeof successCheckResult>>()
  submissions = new Map<number, ReturnType<typeof successCheckResult>>()
  teacherTasks: TeacherOwnedTask[] = []
  nextUserId = 100
  nextGroupId = 1
  nextInvitationId = 1
  nextSetId = 1
  nextLinkId = 1
  nextSubmissionId = 1
  nextTeacherTaskId = 1000

  reset() {
    this.users = MOCK_DEV_USERS.map((user) => ({ ...user }))
    this.groups = []
    this.groupMembers = new Map()
    this.invitations = []
    this.assignmentSets = []
    this.curriculumLinks = new Map()
    this.taskProgress = new Map()
    this.learningProgress = new Map()
    this.demoJobs = new Map()
    this.submissions = new Map()
    this.teacherTasks = []
    this.nextUserId = 100
    this.nextGroupId = 1
    this.nextInvitationId = 1
    this.nextSetId = 1
    this.nextLinkId = 1
    this.nextSubmissionId = 1
    this.nextTeacherTaskId = 1000

    for (const conceptId of ["loops", "conditions", "functions"]) {
      this.learningProgress.set(
        `python:${conceptId}`,
        emptyLearningProgress("python", conceptId),
      )
    }
  }

  private userByEmail(email: string) {
    return this.users.find((user) => user.email === email)
  }

  private requireUser(authorization: string | null): User | MockResponse {
    const userId = parseUserIdFromToken(authorization)
    if (!userId) return { status: 401, body: { error: { code: "UNAUTHORIZED", message: "Unauthorized" } } }
    const user = this.users.find((item) => item.id === userId)
    if (!user) return { status: 401, body: { error: { code: "UNAUTHORIZED", message: "Unauthorized" } } }
    return user
  }

  private progressKey(userId: number, taskId: number) {
    return `${userId}:${taskId}`
  }

  private markTaskPassed(userId: number, taskId: number) {
    const key = this.progressKey(userId, taskId)
    const current = this.taskProgress.get(key) ?? {
      task_id: taskId,
      progress_status: "not_started",
      attempts_count: 0,
      passed_count: 0,
      last_status: null,
    }
    current.attempts_count += 1
    current.passed_count = Math.max(current.passed_count, 1)
    current.progress_status = "passed"
    current.last_status = "SUCCESS"
    this.taskProgress.set(key, current)

    if (taskId === 3) {
      const loops = this.learningProgress.get("python:loops") ?? emptyLearningProgress("python", "loops")
      loops.passed_tasks = 1
      loops.progress_percent = 100
      loops.by_task_id["3"] = {
        task_id: 3,
        progress_status: "passed",
        attempts_count: current.attempts_count,
        passed_count: 1,
      }
      this.learningProgress.set("python:loops", loops)
    }
  }

  private buildMyProfile(user: User) {
    let solved = 0
    let attempted = 0
    for (const [key, row] of this.taskProgress.entries()) {
      if (!key.startsWith(`${user.id}:`)) continue
      attempted += 1
      if (row.progress_status === "passed") solved += 1
    }
    return {
      user_id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      handle: `@${user.email.split("@")[0]}`,
      level: solved >= 10 ? "Junior" : "Beginner",
      solved_tasks_count: solved,
      total_tasks_attempted: attempted,
      success_rate: solved > 0 ? 82 : 0,
      streak_days: solved > 0 ? 3 : 0,
      groups_count: this.groups.filter((group) => this.groupMembers.get(group.id)?.has(user.id)).length,
      activity_by_date: { [nowIso().slice(0, 10)]: solved > 0 ? 2 : 0 },
      recent_submissions: [],
      skills: [
        { id: "loops", label: "Циклы", percent: 40, solved: 2, total: 5 },
        { id: "conditions", label: "Условия", percent: 60, solved: 3, total: 5 },
      ],
    }
  }

  private buildUserProfile(target: User, viewer: User, teacherId: number | null) {
    if (target.role === "teacher" || target.role === "admin") {
      const groups = this.groups.filter((group) => group.teacher_id === target.id)
      return {
        kind: "teacher",
        user_id: target.id,
        name: target.name,
        email: target.email,
        handle: `@${target.email.split("@")[0]}`,
        initials: target.name.slice(0, 1).toUpperCase(),
        bio: "Преподаватель платформы.",
        groups: groups.map((group) => ({
          id: group.id,
          name: group.name,
          member_count: this.groupMembers.get(group.id)?.size ?? 0,
        })),
        stats: {
          tasks_count: 5,
          groups_count: groups.length,
          students_count: groups.reduce(
            (sum, group) => sum + (this.groupMembers.get(group.id)?.size ?? 0),
            0,
          ),
          assignment_sets_count: this.assignmentSets.filter((set) => set.teacher_id === target.id).length,
        },
        is_own_profile: viewer.id === target.id,
      }
    }

    const groups = this.groups
      .filter((group) => this.groupMembers.get(group.id)?.has(target.id))
      .map((group) => {
        const teacher = this.users.find((item) => item.id === group.teacher_id)
        return {
          id: group.id,
          name: group.name,
          teacher_id: group.teacher_id,
          teacher_name: teacher?.name ?? "Преподаватель",
        }
      })

    const teacher = teacherId ? this.users.find((item) => item.id === teacherId) : null

    return {
      kind: "student",
      user_id: target.id,
      name: target.name,
      email: target.email,
      handle: `@${target.email.split("@")[0]}`,
      initials: target.name.slice(0, 1).toUpperCase(),
      level: "Junior",
      summary: {
        solved_count: 2,
        success_rate: 80,
        streak_days: 2,
        attempts_count: 5,
        last_activity_at: nowIso(),
      },
      groups,
      skills: [{ id: "loops", label: "Циклы", percent: 50, solved: 1, total: 2 }],
      recent_submissions: [],
      teacher: teacher ? { id: teacher.id, name: teacher.name } : null,
      is_own_profile: viewer.id === target.id,
    }
  }

  handle(method: string, pathname: string, authorization: string | null, body: unknown): MockResponse {
    const [pathOnly, queryString = ""] = pathname.split("?")
    const path = pathOnly.replace(/\/$/, "") || "/"
    const searchParams = new URLSearchParams(queryString)

    if (method === "GET" && path === "/languages") {
      return { status: 200, body: MOCK_LANGUAGES }
    }

    if (method === "GET" && path === "/catalog/tasks") {
      const userId = parseUserIdFromToken(authorization)
      return {
        status: 200,
        body: MOCK_TASKS.map((task) => toCatalogSummary(task, this, userId)),
      }
    }

    const taskMatch = path.match(/^\/catalog\/tasks\/(\d+)$/)
    if (method === "GET" && taskMatch) {
      const task = MOCK_TASKS.find((item) => item.id === Number(taskMatch[1]))
      if (!task) return { status: 404, body: { error: { code: "NOT_FOUND", message: "Task not found" } } }
      return { status: 200, body: task }
    }

    if (method === "GET" && path === "/teacher/tasks/mine") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      return {
        status: 200,
        body: this.teacherTasks
          .filter((task) => task.owner_user_id === user.id)
          .map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            difficulty: task.difficulty,
            task_type: task.task_type,
            topics: Array.isArray(task.payload.topics) ? task.payload.topics : ["custom"],
            languages: ["python"],
          })),
      }
    }

    const teacherTaskMatch = path.match(/^\/teacher\/tasks\/(\d+)$/)
    if (teacherTaskMatch) {
      const taskId = Number(teacherTaskMatch[1])
      const task = this.teacherTasks.find((item) => item.id === taskId)
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      if (!task || (task.owner_user_id !== user.id && user.role !== "admin")) {
        return { status: 404, body: { error: { code: "NOT_FOUND", message: "Task not found" } } }
      }
      if (method === "GET") {
        return {
          status: 200,
          body: {
            id: task.id,
            title: task.title,
            description: task.description,
            difficulty: task.difficulty,
            task_type: task.task_type,
            payload: task.payload,
          },
        }
      }
      if (method === "PATCH") {
        const payload = body as {
          title?: string
          description?: string
          difficulty?: string
          payload?: Record<string, unknown>
        }
        if (payload.title != null) task.title = payload.title
        if (payload.description != null) task.description = payload.description
        if (payload.difficulty != null) task.difficulty = payload.difficulty
        if (payload.payload != null) task.payload = payload.payload
        return {
          status: 200,
          body: {
            id: task.id,
            title: task.title,
            description: task.description,
            difficulty: task.difficulty,
            task_type: task.task_type,
            payload: task.payload,
          },
        }
      }
    }

    if (method === "POST" && path === "/teacher/tasks") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const payload = body as {
        title?: string
        description?: string
        difficulty?: string
        task_type?: string
        payload?: Record<string, unknown>
      }
      const task: TeacherOwnedTask = {
        id: this.nextTeacherTaskId++,
        owner_user_id: user.id,
        title: payload.title ?? "Untitled",
        description: payload.description ?? "",
        difficulty: payload.difficulty ?? "easy",
        task_type: payload.task_type ?? "task_write_from_description",
        payload: payload.payload ?? {},
      }
      this.teacherTasks.push(task)
      return {
        status: 200,
        body: {
          id: task.id,
          title: task.title,
          description: task.description,
          difficulty: task.difficulty,
          task_type: task.task_type,
          payload: task.payload,
        },
      }
    }

    if (method === "POST" && path === "/auth/login") {
      const payload = body as { email?: string; password?: string }
      const user = this.userByEmail(payload.email ?? "")
      if (!user || user.password !== payload.password) {
        return { status: 401, body: { error: { code: "UNAUTHORIZED", message: "Invalid credentials" } } }
      }
      return { status: 200, body: authTokens(user.id) }
    }

    if (method === "POST" && path === "/auth/register") {
      const payload = body as { name?: string; email?: string; password?: string }
      if (!payload.email || !payload.password || !payload.name) {
        return { status: 422, body: { error: { code: "VALIDATION_ERROR", message: "Invalid payload" } } }
      }
      if (this.userByEmail(payload.email)) {
        return { status: 409, body: { error: { code: "CONFLICT", message: "Email already exists" } } }
      }
      const user: User = {
        id: this.nextUserId++,
        email: payload.email,
        password: payload.password,
        name: payload.name,
        role: "student",
      }
      this.users.push(user)
      return { status: 200, body: authTokens(user.id) }
    }

    if (method === "POST" && path === "/auth/refresh") {
      const payload = body as { refresh_token?: string }
      const userId = Number(String(payload.refresh_token ?? "").replace("mock-refresh-", ""))
      if (!Number.isFinite(userId)) {
        return { status: 401, body: { error: { code: "UNAUTHORIZED", message: "Invalid refresh token" } } }
      }
      return { status: 200, body: authTokens(userId) }
    }

    if (method === "POST" && path === "/auth/logout") {
      return { status: 204, body: null }
    }

    if (method === "GET" && path === "/auth/me") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      return {
        status: 200,
        body: { id: user.id, email: user.email, name: user.name, role: user.role },
      }
    }

    if (method === "POST" && path === "/demo/check") {
      const payload = body as { task_id?: number }
      const jobId = `demo-${payload.task_id ?? 0}-${Date.now()}`
      const result = successCheckResult({ job_id: jobId })
      this.demoJobs.set(jobId, result)
      return { status: 200, body: { job_id: jobId, status: "SUCCESS" } }
    }

    const demoResultMatch = path.match(/^\/demo\/check\/(.+)$/)
    if (method === "GET" && demoResultMatch) {
      const result = this.demoJobs.get(demoResultMatch[1]) ?? successCheckResult({ job_id: demoResultMatch[1] })
      return { status: 200, body: result }
    }

    if (method === "POST" && path === "/submissions") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const payload = body as { task_id?: number }
      const submissionId = this.nextSubmissionId++
      const result = successCheckResult({ id: submissionId })
      this.submissions.set(submissionId, result)
      if (payload.task_id) this.markTaskPassed(user.id, payload.task_id)
      return { status: 200, body: { id: submissionId, status: "SUCCESS" } }
    }

    const submissionMatch = path.match(/^\/submissions\/(\d+)$/)
    if (method === "GET" && submissionMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const submissionId = Number(submissionMatch[1])
      const result = this.submissions.get(submissionId) ?? successCheckResult({ id: submissionId })
      return { status: 200, body: result }
    }

    const taskProgressMatch = path.match(/^\/progress\/tasks\/(\d+)$/)
    if (method === "GET" && taskProgressMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const taskId = Number(taskProgressMatch[1])
      const progress = this.taskProgress.get(this.progressKey(user.id, taskId)) ?? {
        task_id: taskId,
        progress_status: "not_started",
        attempts_count: 0,
        passed_count: 0,
        last_status: null,
      }
      return { status: 200, body: progress }
    }

    const learningProgressMatch = path.match(/^\/progress\/curriculum\/([^/]+)\/([^/]+)$/)
    if (method === "GET" && learningProgressMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const language = learningProgressMatch[1]
      const conceptId = learningProgressMatch[2]
      const progress =
        this.learningProgress.get(`${language}:${conceptId}`) ??
        emptyLearningProgress(language, conceptId)
      return { status: 200, body: progress }
    }

    const collectionsMatch = path.match(/^\/curriculum\/([^/]+)\/collections$/)
    if (method === "GET" && collectionsMatch) {
      const language = collectionsMatch[1]
      const userId = parseUserIdFromToken(authorization)
      return {
        status: 200,
        body: buildMockLanguageTrack(language, userId, this),
      }
    }

    const showcaseMatch = path.match(/^\/curriculum\/([^/]+)\/collections\/([^/]+)$/)
    if (method === "GET" && showcaseMatch) {
      const language = showcaseMatch[1]
      const conceptId = showcaseMatch[2]
      const userId = parseUserIdFromToken(authorization)
      const body = buildMockCollectionShowcase(language, conceptId, userId, this)
      if (!body) {
        return { status: 404, body: { error: { code: "NOT_FOUND", message: "Collection not found" } } }
      }
      return { status: 200, body }
    }

    if (method === "POST" && path === "/curriculum/tasks/validate-link") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const payload = body as {
        language?: string
        technical_concept_id?: string
        exercise_pattern_id?: string
      }
      return {
        status: 200,
        body: {
          language: payload.language ?? "python",
          learning_concept_id: "loops",
          technical_concept_id: payload.technical_concept_id ?? "for_loop",
          exercise_pattern_id: payload.exercise_pattern_id ?? "tr_pattern_translation",
          action: "create",
        },
      }
    }

    const curriculumLinksMatch = path.match(/^\/curriculum\/tasks\/(\d+)\/links$/)
    if (method === "GET" && curriculumLinksMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const taskId = Number(curriculumLinksMatch[1])
      const links = this.curriculumLinks.get(taskId) ?? []
      return {
        status: 200,
        body: {
          task_id: taskId,
          has_curriculum_link: links.length > 0,
          primary_link: links.find((link) => link.is_primary) ?? null,
          links,
        },
      }
    }

    if (method === "POST" && curriculumLinksMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const taskId = Number(curriculumLinksMatch[1])
      const payload = body as {
        language?: string
        technical_concept_id?: string
        exercise_pattern_id?: string
        is_primary?: boolean
      }
      const link: CurriculumLink = {
        id: this.nextLinkId++,
        task_id: taskId,
        language: payload.language ?? "python",
        learning_concept_id: "loops",
        technical_concept_id: payload.technical_concept_id ?? "for_loop",
        exercise_pattern_id: payload.exercise_pattern_id ?? "tr_pattern_translation",
        is_primary: payload.is_primary ?? true,
      }
      const links = this.curriculumLinks.get(taskId) ?? []
      links.push(link)
      this.curriculumLinks.set(taskId, links)
      return { status: 200, body: link }
    }

    const curriculumLinkItemMatch = path.match(/^\/curriculum\/tasks\/(\d+)\/links\/(\d+)$/)
    if (method === "DELETE" && curriculumLinkItemMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const taskId = Number(curriculumLinkItemMatch[1])
      const linkId = Number(curriculumLinkItemMatch[2])
      const links = (this.curriculumLinks.get(taskId) ?? []).filter((link) => link.id !== linkId)
      this.curriculumLinks.set(taskId, links)
      return { status: 204, body: null }
    }

    const curriculumValidateMatch = path.match(/^\/curriculum\/([^/]+)\/validate$/)
    if (method === "GET" && curriculumValidateMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      return { status: 200, body: curriculumValidation(curriculumValidateMatch[1]) }
    }

    const curriculumDebugMatch = path.match(/^\/curriculum\/([^/]+)\/debug$/)
    if (method === "GET" && curriculumDebugMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const language = curriculumDebugMatch[1]
      return {
        status: 200,
        body: {
          summary: { language, chapters: 3 },
          validation: curriculumValidation(language),
          chapters: [{ id: "basics", title: "Basics" }],
        },
      }
    }

    if (method === "POST" && path === "/groups") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const payload = body as { name?: string }
      const group: Group = {
        id: this.nextGroupId++,
        name: payload.name ?? "Group",
        teacher_id: user.id,
        created_at: nowIso(),
      }
      this.groups.push(group)
      this.groupMembers.set(group.id, new Set())
      return { status: 201, body: { ...group, member_count: 0 } }
    }

    if (method === "GET" && path === "/groups/mine") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      return {
        status: 200,
        body: this.groups
          .filter((group) => group.teacher_id === user.id)
          .map((group) => ({
            ...group,
            member_count: this.groupMembers.get(group.id)?.size ?? 0,
          })),
      }
    }

    if (method === "GET" && path === "/groups/joined") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      return {
        status: 200,
        body: this.groups
          .filter((group) => this.groupMembers.get(group.id)?.has(user.id))
          .map((group) => ({
            ...group,
            member_count: this.groupMembers.get(group.id)?.size ?? 0,
          })),
      }
    }

    if (method === "POST" && path === "/groups/join") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const payload = body as { code?: string }
      const invitation = this.invitations.find((item) => item.code === payload.code && item.is_active)
      if (!invitation) {
        return { status: 404, body: { error: { code: "NOT_FOUND", message: "Invalid invitation code" } } }
      }
      const members = this.groupMembers.get(invitation.group_id) ?? new Set()
      members.add(user.id)
      this.groupMembers.set(invitation.group_id, members)
      invitation.use_count += 1
      const group = this.groups.find((item) => item.id === invitation.group_id)
      if (!group) {
        return { status: 404, body: { error: { code: "NOT_FOUND", message: "Group not found" } } }
      }
      return {
        status: 200,
        body: { ...group, member_count: members.size },
      }
    }

    const groupInvitationMatch = path.match(/^\/groups\/(\d+)\/invitations$/)
    if (method === "POST" && groupInvitationMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const groupId = Number(groupInvitationMatch[1])
      const invitation: Invitation = {
        id: this.nextInvitationId++,
        code: randomInviteCode(),
        group_id: groupId,
        max_uses: null,
        use_count: 0,
        expires_at: null,
        is_active: true,
      }
      this.invitations.push(invitation)
      return { status: 200, body: invitation }
    }

    const groupDashboardMatch = path.match(/^\/groups\/(\d+)\/dashboard$/)
    if (method === "GET" && groupDashboardMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const groupId = Number(groupDashboardMatch[1])
      const group = this.groups.find((item) => item.id === groupId)
      if (!group || group.teacher_id !== user.id) {
        return { status: 404, body: { error: { code: "NOT_FOUND", message: "Group not found" } } }
      }
      const memberIds = [...(this.groupMembers.get(groupId) ?? new Set())]
      const members = memberIds
        .map((id) => this.users.find((item) => item.id === id))
        .filter(Boolean)
        .map((member) => ({ id: member!.id, name: member!.name, email: member!.email }))
      const sets = this.assignmentSets.filter((set) => set.group_id === groupId && !set.is_archived)
      const taskIds = [...new Set(sets.flatMap((set) => set.items.map((item) => item.task_id)))]
      const studentSummaries = members.map((member) => {
        const solved = taskIds.filter(
          (taskId) =>
            this.taskProgress.get(this.progressKey(member.id, taskId))?.progress_status === "passed",
        ).length
        const total = taskIds.length
        return {
          student_id: member.id,
          student_name: member.name,
          solved_count: solved,
          total_tasks: total,
          progress_percent: total ? Math.round((100 * solved) / total) : 0,
        }
      })
      const taskProgress = members.flatMap((member) =>
        taskIds.map((taskId) => {
          const row = this.taskProgress.get(this.progressKey(member.id, taskId))
          return {
            student_id: member.id,
            task_id: taskId,
            progress_status: row?.progress_status ?? "not_started",
            attempts_count: row?.attempts_count ?? 0,
          }
        }),
      )
      return {
        status: 200,
        body: {
          group: { ...group, member_count: members.length },
          members,
          assignment_sets: sets.map((set) => ({
            id: set.id,
            name: set.name,
            task_count: set.items.length,
            deadline_at: set.deadline_at,
          })),
          student_summaries: studentSummaries,
          task_progress: taskProgress,
        },
      }
    }

    if (method === "POST" && path === "/assignment-sets") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const payload = body as {
        name?: string
        description?: string
        visibility?: string
        group_id?: number | null
      }
      const set: AssignmentSet = {
        id: this.nextSetId++,
        name: payload.name ?? "Set",
        description: payload.description ?? "",
        teacher_id: user.id,
        visibility: payload.visibility ?? "public",
        group_id: payload.group_id ?? null,
        is_archived: false,
        items: [],
        created_at: nowIso(),
        deadline_at: null,
      }
      this.assignmentSets.push(set)
      return { status: 201, body: set }
    }

    if (method === "GET" && path === "/assignment-sets/mine") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      return {
        status: 200,
        body: this.assignmentSets.filter((set) => set.teacher_id === user.id),
      }
    }

    if (method === "GET" && path === "/assignment-sets") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const joinedGroupIds = new Set(
        this.groups
          .filter((group) => this.groupMembers.get(group.id)?.has(user.id))
          .map((group) => group.id),
      )
      return {
        status: 200,
        body: this.assignmentSets.filter(
          (set) =>
            !set.is_archived &&
            (set.visibility === "public" || (set.group_id != null && joinedGroupIds.has(set.group_id))),
        ),
      }
    }

    const assignmentSetMatch = path.match(/^\/assignment-sets\/(\d+)$/)
    if (method === "GET" && assignmentSetMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const set = this.assignmentSets.find((item) => item.id === Number(assignmentSetMatch[1]))
      if (!set) return { status: 404, body: { error: { code: "NOT_FOUND", message: "Set not found" } } }
      return { status: 200, body: set }
    }

    const assignmentSetItemsMatch = path.match(/^\/assignment-sets\/(\d+)\/items$/)
    if (method === "POST" && assignmentSetItemsMatch) {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      const setId = Number(assignmentSetItemsMatch[1])
      const payload = body as { task_id?: number; sort_order?: number }
      const set = this.assignmentSets.find((item) => item.id === setId)
      if (!set) return { status: 404, body: { error: { code: "NOT_FOUND", message: "Set not found" } } }
      set.items.push({
        task_id: payload.task_id ?? 0,
        sort_order: payload.sort_order ?? set.items.length,
      })
      return { status: 204, body: null }
    }

    if (method === "GET" && path === "/profiles/me") {
      const user = this.requireUser(authorization)
      if ("status" in user) return user
      return { status: 200, body: this.buildMyProfile(user) }
    }

    const profileUserMatch = path.match(/^\/profiles\/users\/(\d+)$/)
    if (method === "GET" && profileUserMatch) {
      const viewer = this.requireUser(authorization)
      if ("status" in viewer) return viewer
      const targetId = Number(profileUserMatch[1])
      const target = this.users.find((item) => item.id === targetId)
      if (!target) {
        return { status: 404, body: { error: { code: "NOT_FOUND", message: "User not found" } } }
      }
      const teacherId = searchParams.get("teacher_id")
      return { status: 200, body: this.buildUserProfile(target, viewer, teacherId ? Number(teacherId) : null) }
    }

    return { status: 404, body: { error: { code: "NOT_FOUND", message: `Unhandled route ${method} ${path}` } } }
  }
}

export const mockApiStore = new MockApiStore()
mockApiStore.reset()
