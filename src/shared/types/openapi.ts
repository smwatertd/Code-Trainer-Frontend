import type { components } from "@/shared/api/generated/schema"

export type AuthResponse = components["schemas"]["AuthResponse"]
export type CurrentUser = components["schemas"]["CurrentUserResponse"]
export type TaskSummary = components["schemas"]["TaskSummaryResponse"]
export type TaskDetail = components["schemas"]["TaskDetailResponse"]
export type Language = components["schemas"]["LanguageResponse"]
export type TaskProgress = components["schemas"]["TaskProgressResponse"]
export type LearningConceptProgress = components["schemas"]["LearningConceptProgressResponse"]
export type TaskCurriculumLink = components["schemas"]["TaskCurriculumLinkResponse"]
export type TaskCurriculumMetadata = components["schemas"]["TaskCurriculumMetadataResponse"]
export type TaskCurriculumLinkCreate = components["schemas"]["TaskCurriculumLinkCreateRequest"]
export type TaskCurriculumLinkValidate = components["schemas"]["TaskCurriculumLinkValidateRequest"]
export type TaskCurriculumLinkValidateResult =
  components["schemas"]["TaskCurriculumLinkValidateResponse"]
export type CurriculumValidation = components["schemas"]["CurriculumValidationResponse"]
export type CurriculumDebug = components["schemas"]["CurriculumDebugResponse"]

export type ApiErrorBody = {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ExecutionIssue = {
  message?: string
  line?: number
  column?: number
  [key: string]: unknown
}

export type TestResult = {
  passed?: boolean
  status?: string
  output?: string
  expected?: string
  [key: string]: unknown
}

export type CheckResult = {
  job_id?: string
  id?: number
  status: string
  success?: boolean | null
  language?: string
  code?: string
  block_order?: number[]
  nodes?: FlowNode[]
  edges?: FlowEdge[]
  flow?: Array<{ id: string; type: string; text?: string }>
  compiler_errors?: ExecutionIssue[]
  linter_errors?: ExecutionIssue[]
  pattern_errors?: ExecutionIssue[]
  test_results?: TestResult[]
  flow_debug?: Record<string, unknown> | null
  errors?: string | null
}

export type TaskBlock = {
  id: number
  content: string
}

export type FlowNode = {
  id: string
  type: string
  x?: number
  y?: number
  text?: string
  position?: { x: number; y: number }
}

export type FlowEdge = {
  source: string
  target: string
  id?: string
  label?: string
  sourceHandle?: string
  targetHandle?: string
}

export type FlowPayload = {
  flow: Array<{ id: string; type: string; text?: string }>
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export type StudyGroup = {
  id: number
  name: string
  teacher_id: number
  created_at?: string
  member_count?: number
}

export type InvitationCode = {
  id: number
  code: string
  group_id: number
  max_uses: number | null
  use_count: number
  expires_at: string | null
  is_active: boolean
}

export type GroupMember = {
  id: number
  name: string
  email: string
}

export type GroupAssignmentSetSummary = {
  id: number
  name: string
  task_count: number
  deadline_at: string | null
}

export type GroupStudentSummary = {
  student_id: number
  student_name: string
  solved_count: number
  total_tasks: number
  progress_percent: number
}

export type StudentTaskProgress = {
  student_id: number
  task_id: number
  progress_status: string
  attempts_count: number
}

export type GroupDashboard = {
  group: StudyGroup
  members: GroupMember[]
  assignment_sets: GroupAssignmentSetSummary[]
  student_summaries: GroupStudentSummary[]
  task_progress: StudentTaskProgress[]
}

export type AssignmentSetItem = {
  task_id: number
  sort_order: number
}

export type AssignmentSet = {
  id: number
  name: string
  description: string
  teacher_id: number
  visibility: string
  group_id: number | null
  is_archived: boolean
  items: AssignmentSetItem[]
  created_at?: string
  deadline_at?: string | null
}
