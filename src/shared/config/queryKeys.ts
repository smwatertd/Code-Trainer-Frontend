export const queryKeys = {
  me: ["auth", "me"] as const,
  languages: ["languages"] as const,
  catalogTasks: (filters?: Record<string, string | undefined>) =>
    ["catalog", "tasks", filters ?? {}] as const,
  submissionHistory: (taskId: number) => ["submissions", "history", taskId] as const,
  catalogTask: (id: number) => ["catalog", "tasks", id] as const,
  taskProgress: (id: number) => ["progress", "tasks", id] as const,
  learningConceptProgress: (language: string, conceptId: string) =>
    ["progress", "curriculum", language, conceptId] as const,
  languageTrack: (language: string) => ["curriculum", language, "track"] as const,
  collectionShowcase: (language: string, conceptId: string) =>
    ["curriculum", language, "showcase", conceptId] as const,
  curriculumLinks: (taskId: number) => ["curriculum", "tasks", taskId, "links"] as const,
  curriculumValidate: (language: string) => ["curriculum", language, "validate"] as const,
  curriculumDebug: (language: string) => ["curriculum", language, "debug"] as const,
  teacherGroups: ["groups", "mine"] as const,
  joinedGroups: ["groups", "joined"] as const,
  groupDashboard: (groupId: number) => ["groups", groupId, "dashboard"] as const,
  teacherAssignmentSets: ["assignment-sets", "mine"] as const,
  teacherTasks: () => ["teacher", "tasks", "mine"] as const,
  teacherTask: (taskId: number) => ["teacher", "tasks", taskId] as const,
  accessibleAssignmentSets: ["assignment-sets", "accessible"] as const,
  myProfile: ["profiles", "me"] as const,
  userProfile: (userId: number, teacherId: number | null) =>
    ["profiles", "users", userId, teacherId] as const,
}
