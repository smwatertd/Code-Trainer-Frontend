import { useCallback, useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useTaskDetail } from "@/features/catalog"
import {
  applySubmissionInput,
  buildCodeFromBlocks,
  createInitialBlockReorderCode,
  createInitialSolverState,
  flowToApiPayload,
  getTaskBlocks,
  type SolverMode,
} from "@/features/task-solving/model/solverState"
import { getDemoCheckResult, submitDemoCheck } from "@/shared/api/demoClient"
import { getSubmission, submitSubmission } from "@/shared/api/submissionsClient"
import { queryKeys } from "@/shared/config/queryKeys"
import { useJobPoll } from "@/shared/hooks/useJobPoll"
import type { CheckResult, FlowPayload } from "@/shared/types/api"
import { getFlowchartReferenceCode } from "@/features/task-solving/model/flowchartReferenceCode"
import { useLanguages } from "@/features/languages/hooks/useLanguages"
import { isBlockReorderTask, isCodeToFlowchartTask, isFlowchartTask, resolveSolverLanguage, selectableLanguages } from "@/shared/utils/taskTypes"
import { getApiErrorMessage } from "@/shared/utils/apiErrors"
import { showError } from "@/shared/utils/toast"

type UseTaskSolverOptions = {
  mode: SolverMode
  taskId: number | null
}

export function useTaskSolver({ mode, taskId }: UseTaskSolverOptions) {
  const queryClient = useQueryClient()
  const taskQuery = useTaskDetail(taskId)
  const task = taskQuery.data ?? null
  const { data: languages = [] } = useLanguages()
  const availableLanguageIds = useMemo(
    () => languages.map((item) => item.id),
    [languages],
  )

  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("python")
  const [blockOrder, setBlockOrder] = useState<number[]>([])
  const [flow, setFlow] = useState<FlowPayload>({ flow: [], nodes: [], edges: [] })
  const [jobId, setJobId] = useState<string | number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [manualResult, setManualResult] = useState<CheckResult | null>(null)
  const [historyResult, setHistoryResult] = useState<CheckResult | null>(null)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null)

  useEffect(() => {
    if (taskId == null || !task || task.id !== taskId) {
      return
    }

    const initial = createInitialSolverState(task, availableLanguageIds)
    setLanguage(initial.language)
    setBlockOrder(initial.blockOrder)
    setFlow(initial.flow)
    if (isBlockReorderTask(task)) {
      setCode(createInitialBlockReorderCode(task, initial.language, initial.blockOrder))
    } else {
      setCode(initial.code)
    }
    setJobId(null)
    setManualResult(null)
    setHistoryResult(null)
    setSelectedSubmissionId(null)
    setSubmitError(null)
  }, [availableLanguageIds, task, taskId])

  useEffect(() => {
    if (!task) return
    const ids = selectableLanguages(task, languages).map((item) => item.id)
    const resolved = resolveSolverLanguage(task, language, ids)
    if (resolved !== language) {
      setLanguage(resolved)
    }
  }, [language, languages, task])

  const fetchResult = useCallback(async () => {
    if (jobId == null) throw new Error("job id missing")
    if (mode === "guest") {
      return getDemoCheckResult(String(jobId))
    }
    return getSubmission(Number(jobId))
  }, [jobId, mode])

  const { result: polledResult, isPolling, error: pollError } = useJobPoll(
    fetchResult,
    jobId,
    jobId != null,
  )

  const result = polledResult ?? manualResult ?? historyResult

  const loadSubmissionFromHistory = useCallback(async (submissionId: number) => {
    if (mode !== "student" || !task) return
    setSelectedSubmissionId(submissionId)
    setJobId(null)
    setManualResult(null)
    setSubmitError(null)
    try {
      const loaded = await getSubmission(submissionId)
      setHistoryResult(loaded)
      const restored = applySubmissionInput(task, loaded)
      setLanguage(restored.language)
      setCode(restored.code)
      setBlockOrder(restored.blockOrder)
      setFlow(restored.flow)
    } catch (error) {
      const message = getApiErrorMessage(error)
      setSubmitError(message)
      showError(error)
    }
  }, [mode, task])

  const resolvedCode = useMemo(() => {
    if (!task) return code
    if (isBlockReorderTask(task)) {
      return buildCodeFromBlocks(getTaskBlocks(task, language), blockOrder, language)
    }
    if (isCodeToFlowchartTask(task)) {
      return getFlowchartReferenceCode(task, language)
    }
    return code
  }, [blockOrder, code, language, task])

  const updateLanguage = useCallback(
    (nextLanguage: string) => {
      setLanguage(nextLanguage)
      if (task && isBlockReorderTask(task)) {
        setCode(buildCodeFromBlocks(getTaskBlocks(task, nextLanguage), blockOrder, nextLanguage))
      } else if (task && isCodeToFlowchartTask(task)) {
        setCode(getFlowchartReferenceCode(task, nextLanguage))
      }
    },
    [blockOrder, task],
  )

  const runCheck = useCallback(async () => {
    if (!task || taskId == null) return
    setIsSubmitting(true)
    setSubmitError(null)
    setManualResult(null)
    setHistoryResult(null)
    setSelectedSubmissionId(null)
    setJobId(null)

    const basePayload = {
      task_id: taskId,
      language,
      code: resolvedCode,
    }

    try {
      if (mode === "guest") {
        const payload = {
          ...basePayload,
          ...(isBlockReorderTask(task) ? { block_order: blockOrder } : {}),
          ...(isFlowchartTask(task) ? flowToApiPayload(flow) : {}),
        }
        const queued = await submitDemoCheck(payload)
        if (TERMINAL.has(queued.status.toUpperCase())) {
          const immediate = await getDemoCheckResult(queued.job_id)
          setManualResult(immediate)
        } else {
          setJobId(queued.job_id)
        }
      } else {
        const payload = {
          ...basePayload,
          ...(isBlockReorderTask(task) ? { block_order: blockOrder } : {}),
          ...(isFlowchartTask(task) ? flowToApiPayload(flow) : {}),
        }
        const queued = await submitSubmission(payload)
        if (TERMINAL.has(queued.status.toUpperCase())) {
          const immediate = await getSubmission(queued.id)
          setManualResult(immediate)
        } else {
          setJobId(queued.id)
        }
        await queryClient.invalidateQueries({ queryKey: queryKeys.taskProgress(taskId) })
        await queryClient.invalidateQueries({ queryKey: queryKeys.submissionHistory(taskId) })
      }
    } catch (error) {
      const message = getApiErrorMessage(error)
      setSubmitError(message)
      showError(error)
    } finally {
      setIsSubmitting(false)
    }
  }, [
    blockOrder,
    flow,
    language,
    mode,
    queryClient,
    resolvedCode,
    task,
    taskId,
  ])

  const updateBlockOrder = useCallback(
    (next: number[]) => {
      setBlockOrder(next)
      if (task && isBlockReorderTask(task)) {
        setCode(buildCodeFromBlocks(getTaskBlocks(task, language), next, language))
      }
    },
    [language, task],
  )

  return {
    task,
    isTaskLoading: taskQuery.isLoading,
    taskLoadError: taskQuery.error ? getApiErrorMessage(taskQuery.error) : "",
    code,
    setCode,
    language,
    setLanguage: updateLanguage,
    blockOrder,
    setBlockOrder: updateBlockOrder,
    flow,
    setFlow,
    result,
    selectedSubmissionId,
    loadSubmissionFromHistory,
    isSubmitting: isSubmitting || isPolling,
    submitError,
    pollError,
    runCheck,
    mode,
    assembledCode: resolvedCode,
  }
}

const TERMINAL = new Set(["SUCCESS", "FAILED", "TIMEOUT"])
