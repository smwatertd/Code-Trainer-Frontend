import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useTaskDetail } from "@/features/catalog"
import {
  applySubmissionInput,
  buildCodeFromBlocks,
  createInitialSolverState,
  flowToApiPayload,
  getLearningStarterCode,
  getTaskBlocks,
  initialBlockOrder,
  resolveLearningCodeAfterSwap,
  type SolverMode,
} from "@/features/task-solving/model/solverState"
import { getDemoCheckResult, submitDemoCheck } from "@/shared/api/demoClient"
import { getSubmission, submitSubmission } from "@/shared/api/submissionsClient"
import { queryKeys } from "@/shared/config/queryKeys"
import { useJobPoll } from "@/shared/hooks/useJobPoll"
import type { CheckResult, FlowPayload } from "@/shared/types/api"
import {
  canSwapParallelLanguages,
  getKnownLanguages,
  getLearningLanguages,
  getReferenceCode,
  getWriteTaskReferenceText,
  resolveKnownLanguage,
  resolveLearningLanguage,
  resolveLearningLanguageBarOptions,
  resolveKnownLanguageBarOptions,
  resolveSubmissionLanguage,
} from "@/features/task-solving/model/studentUiUtils"
import { getFlowchartReferenceCode } from "@/features/task-solving/model/flowchartReferenceCode"
import { useLanguages } from "@/features/languages/hooks/useLanguages"
import { isBlockReorderTask, isCodeToFlowchartTask, isFlowchartTask, isPlaceholderTask, isTranslationTask, isWriteFromDescriptionTask } from "@/shared/utils/taskTypes"
import {
  assemblePlaceholderCode,
  countPlaceholderSlots,
  getPlaceholderTemplate,
} from "@/features/task-solving/model/placeholderTask"
import type { BlockPlacement } from "@/domain/blockAssembly"
import {
  buildCodeFromBlockTask,
  blockOrderFromPlacements,
  createBlockTaskStateForLanguage,
  getFragmentBaseCode,
  normalizeBlockOrder,
} from "@/features/task-solving/model/blockAssemblyHelpers"
import {
  getBlockAssemblyTemplate,
  initialBlockAssemblyOrder,
  resolveBlockAssemblyKind,
} from "@/features/task-solving/model/blockAssemblyMode"
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
  const [knownLanguage, setKnownLanguageState] = useState("python")
  const [blockOrder, setBlockOrder] = useState<number[]>([])
  const [blockPlacements, setBlockPlacements] = useState<BlockPlacement[]>([])
  const [placeholderFills, setPlaceholderFills] = useState<string[]>([])
  const [flow, setFlow] = useState<FlowPayload>({ flow: [], nodes: [], edges: [] })
  const [jobId, setJobId] = useState<string | number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [manualResult, setManualResult] = useState<CheckResult | null>(null)
  const [historyResult, setHistoryResult] = useState<CheckResult | null>(null)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null)
  const initializedTaskIdRef = useRef<number | null>(null)
  const languagesHydratedRef = useRef(false)

  const applyLearningLanguage = useCallback(
    (nextLanguage: string) => {
      setLanguage(nextLanguage)
      if (!task) return

      if (isBlockReorderTask(task)) {
        const next = createBlockTaskStateForLanguage(task, nextLanguage)
        setBlockOrder(next.blockOrder)
        setBlockPlacements(next.blockPlacements)
        setCode(next.code)
      } else if (isCodeToFlowchartTask(task)) {
        setCode(getFlowchartReferenceCode(task, nextLanguage))
      } else if (isTranslationTask(task) || isWriteFromDescriptionTask(task)) {
        setCode(getLearningStarterCode(task, nextLanguage))
      } else if (isPlaceholderTask(task)) {
        setPlaceholderFills(
          Array(countPlaceholderSlots(getPlaceholderTemplate(task))).fill(""),
        )
      }
    },
    [task],
  )

  useEffect(() => {
    initializedTaskIdRef.current = null
    languagesHydratedRef.current = false
  }, [taskId])

  useEffect(() => {
    if (taskId == null || !task || task.id !== taskId) {
      return
    }
    if (initializedTaskIdRef.current === taskId) {
      return
    }
    initializedTaskIdRef.current = taskId

    const initial = createInitialSolverState(task, availableLanguageIds)
    const known = resolveKnownLanguage(task)
    const learning = resolveLearningLanguage(task, known, initial.language, availableLanguageIds)
    setKnownLanguageState(known)
    setLanguage(learning)
    const blocks = getTaskBlocks(task, learning)
    const assemblyTemplate = getBlockAssemblyTemplate(task, learning)
    const blockOrderInitial = isBlockReorderTask(task)
      ? initialBlockAssemblyOrder(blocks, assemblyTemplate)
      : initial.blockOrder
    setBlockOrder(blockOrderInitial)
    setBlockPlacements([])
    setPlaceholderFills(
      isPlaceholderTask(task)
        ? Array(countPlaceholderSlots(getPlaceholderTemplate(task))).fill("")
        : [],
    )
    setFlow(initial.flow)
    if (isBlockReorderTask(task)) {
      const kind = resolveBlockAssemblyKind(blocks, assemblyTemplate)
      if (kind === "fragment") {
        setCode(getFragmentBaseCode(task, blocks, learning))
      } else {
        setCode(buildCodeFromBlockTask(task, blocks, blockOrderInitial, [], learning))
      }
    } else {
      setCode(getLearningStarterCode(task, learning))
    }
    setJobId(null)
    setManualResult(null)
    setHistoryResult(null)
    setSelectedSubmissionId(null)
    setSubmitError(null)
  }, [task, taskId])

  useEffect(() => {
    if (!task || !availableLanguageIds.length || initializedTaskIdRef.current !== taskId) {
      return
    }
    if (languagesHydratedRef.current) {
      return
    }
    languagesHydratedRef.current = true

    const learningAvailable = getLearningLanguages(task, availableLanguageIds)
    if (learningAvailable.includes(language)) {
      return
    }

    const resolved = resolveLearningLanguage(task, knownLanguage, language, availableLanguageIds)
    if (resolved !== language && learningAvailable.includes(resolved)) {
      applyLearningLanguage(resolved)
    }
  }, [applyLearningLanguage, availableLanguageIds, knownLanguage, language, task, taskId])

  const knownLanguages = useMemo(() => resolveKnownLanguageBarOptions(task), [task])
  const learningLanguages = useMemo(
    () => resolveLearningLanguageBarOptions(task, availableLanguageIds),
    [availableLanguageIds, task],
  )

  const referenceCode = useMemo(() => {
    if (!task) return ""
    const fromExamples = getReferenceCode(task, knownLanguage)
    if (fromExamples) return fromExamples
    return getWriteTaskReferenceText(task) ?? ""
  }, [knownLanguage, task])

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
      const blocks = getTaskBlocks(task, language)
      return buildCodeFromBlockTask(task, blocks, blockOrder, blockPlacements, language)
    }
    if (isPlaceholderTask(task)) {
      return assemblePlaceholderCode(getPlaceholderTemplate(task), placeholderFills)
    }
    if (isCodeToFlowchartTask(task)) {
      return getFlowchartReferenceCode(task, language)
    }
    return code
  }, [blockOrder, blockPlacements, code, language, placeholderFills, task])

  const updateKnownLanguage = useCallback(
    (nextKnownLanguage: string) => {
      setKnownLanguageState(nextKnownLanguage)
      if (!task) return
      const learning = resolveLearningLanguage(task, nextKnownLanguage, language, availableLanguageIds)
      if (learning !== language) {
        applyLearningLanguage(learning)
      }
    },
    [applyLearningLanguage, availableLanguageIds, language, task],
  )

  const swapLanguages = useCallback(() => {
    if (
      !task ||
      !canSwapParallelLanguages(knownLanguage, language, knownLanguages, learningLanguages)
    ) {
      return
    }
    const nextKnown = language
    const nextLearning = knownLanguage
    setKnownLanguageState(nextKnown)
    if (isBlockReorderTask(task)) {
      applyLearningLanguage(nextLearning)
    } else if (isTranslationTask(task) || isWriteFromDescriptionTask(task)) {
      setLanguage(nextLearning)
      setCode(resolveLearningCodeAfterSwap(task, nextLearning))
    } else {
      applyLearningLanguage(nextLearning)
    }
  }, [applyLearningLanguage, knownLanguage, knownLanguages, language, learningLanguages, task])

  const updateLanguage = useCallback(
    (nextLanguage: string) => {
      applyLearningLanguage(nextLanguage)
    },
    [applyLearningLanguage],
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
      language: resolveSubmissionLanguage(task, language),
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
      if (!task || !isBlockReorderTask(task)) {
        setBlockOrder(next)
        return
      }
      const blocks = getTaskBlocks(task, language)
      const normalized = normalizeBlockOrder(next, blocks)
      setBlockOrder(normalized)
      setCode(buildCodeFromBlockTask(task, blocks, normalized, blockPlacements, language))
    },
    [blockPlacements, language, task],
  )

  const updateBlockPlacements = useCallback(
    (next: BlockPlacement[]) => {
      setBlockPlacements(next)
      if (!task || !isBlockReorderTask(task)) return
      const blocks = getTaskBlocks(task, language)
      const template = getBlockAssemblyTemplate(task, language)
      const kind = resolveBlockAssemblyKind(blocks, template)
      const baseCode = kind === "fragment" ? getFragmentBaseCode(task, blocks, language) : ""
      const order =
        next.length > 0 ? blockOrderFromPlacements(next, baseCode) : initialBlockOrder(blocks)
      setBlockOrder(order)
      setCode(buildCodeFromBlockTask(task, blocks, order, next, language))
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
    knownLanguage,
    setKnownLanguage: updateKnownLanguage,
    knownLanguages,
    learningLanguages,
    referenceCode,
    swapLanguages,
    blockOrder,
    setBlockOrder: updateBlockOrder,
    blockPlacements,
    setBlockPlacements: updateBlockPlacements,
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
    placeholderFills,
    setPlaceholderFills,
    assembledCode: resolvedCode,
  }
}

const TERMINAL = new Set(["SUCCESS", "FAILED", "TIMEOUT"])
