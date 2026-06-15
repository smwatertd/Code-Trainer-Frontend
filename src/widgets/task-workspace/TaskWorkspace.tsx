import { useEffect, useMemo, type ReactNode, useState } from "react"
import type { useTaskSolver } from "@/features/task-solving"
import { useLanguages } from "@/features/languages/hooks/useLanguages"
import { getTaskBlocks } from "@/features/task-solving/model/solverState"
import {
  hasReferencePane,
  resolveSubmissionLanguage,
  shouldShowParallelLanguageBar,
} from "@/features/task-solving/model/studentUiUtils"
import BlockReorderEditor from "@/widgets/block-reorder/BlockReorderEditor"
import BlockAssemblyEditor from "@/widgets/block-assembly-editor/BlockAssemblyEditor"
import CodeEditor from "@/widgets/code-editor/CodeEditor"
import FlowchartEditor from "@/widgets/flowchart-editor/FlowchartEditor"
import ParallelLanguageBar from "@/widgets/task-workspace/ParallelLanguageBar"
import TaskBottomPanel from "@/widgets/task-workspace/TaskBottomPanel"
import TaskLeftRail from "@/widgets/task-workspace/TaskLeftRail"
import ResizableBottomPanel from "@/widgets/task-workspace/ResizableBottomPanel"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import ResizableSplit from "@/shared/ui/ResizableSplit"
import {
  isBlockReorderTask,
  isCodeToFlowchartTask,
  isCodingTask,
  isFlowchartTask,
  isPlaceholderTask,
  isWriteFromDescriptionTask,
} from "@/shared/utils/taskTypes"
import {
  getPlaceholderBank,
  getPlaceholderTemplate,
} from "@/features/task-solving/model/placeholderTask"
import PlaceholderEditor from "@/widgets/placeholder-editor/PlaceholderEditor"
import {
  getBlockAssemblyTemplate,
  resolveBlockAssemblyKind,
} from "@/features/task-solving/model/blockAssemblyMode"
import { getFragmentBaseCode } from "@/features/task-solving/model/blockAssemblyHelpers"
import { detectConstructions } from "@/features/task-solving/model/constructionDetector"
import { getTaskConstructions } from "@/features/task-solving/model/studentUiUtils"

type Solver = ReturnType<typeof useTaskSolver>

type TaskWorkspaceProps = {
  solver: Solver
  isGuest?: boolean
}

function EditorShell({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-border bg-[#0c111a] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-faint">
        {title}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-2">{children}</div>
    </div>
  )
}

export default function TaskWorkspace({ solver, isGuest = false }: TaskWorkspaceProps) {
  const { data: languages = [] } = useLanguages()
  const isWideLayout = useMediaQuery("(min-width: 1280px)")
  const isEditorSplit = useMediaQuery("(min-width: 1024px)")
  const {
    task,
    code,
    setCode,
    language,
    setLanguage,
    knownLanguage,
    setKnownLanguage,
    knownLanguages,
    learningLanguages,
    referenceCode,
    swapLanguages,
    blockOrder,
    setBlockOrder,
    blockPlacements,
    setBlockPlacements,
    flow,
    setFlow,
    result,
    isSubmitting,
    runCheck,
    assembledCode,
    placeholderFills,
    setPlaceholderFills,
  } = solver

  const [activePlaceholderSlot, setActivePlaceholderSlot] = useState(0)
  const [referenceEditorReady, setReferenceEditorReady] = useState(false)

  const taskConstructions = useMemo(
    () => (task ? getTaskConstructions(task) : []),
    [task],
  )

  const detectionCode = useMemo(() => {
    if (!task) return ""
    if (isPlaceholderTask(task) || isBlockReorderTask(task)) return assembledCode
    if (isCodingTask(task)) return code
    return ""
  }, [assembledCode, code, task])

  const submissionLanguage = useMemo(
    () => (task ? resolveSubmissionLanguage(task, language) : language),
    [language, task],
  )

  const detectedConstructions = useMemo(() => {
    if (!task || taskConstructions.length === 0) return new Set<string>()
    return detectConstructions(detectionCode, submissionLanguage, taskConstructions).detected
  }, [detectionCode, submissionLanguage, task, taskConstructions])

  const blocks = useMemo(
    () => (task ? getTaskBlocks(task, language) : []),
    [language, task],
  )
  const monacoLanguage =
    languages.find((item) => item.id === language)?.monaco_language ?? language
  const knownMonacoLanguage =
    languages.find((item) => item.id === knownLanguage)?.monaco_language ?? knownLanguage
  const showReferenceSplit = task ? hasReferencePane(task) : false
  const showLanguageBar = shouldShowParallelLanguageBar(task, knownLanguages, learningLanguages)

  useEffect(() => {
    setReferenceEditorReady(false)
    if (!showReferenceSplit) return
    const timer = window.setTimeout(() => setReferenceEditorReady(true), 250)
    return () => window.clearTimeout(timer)
  }, [showReferenceSplit, task?.id])

  const editorPane = useMemo(() => {
    if (!task) return null

    if (isPlaceholderTask(task)) {
      return (
        <PlaceholderEditor
          template={getPlaceholderTemplate(task)}
          fills={placeholderFills}
          bank={getPlaceholderBank(task)}
          activeSlot={activePlaceholderSlot}
          language={language}
          shuffleKey={String(task.id)}
          onActiveSlotChange={setActivePlaceholderSlot}
          onFillSlot={(index, value) => {
            setActivePlaceholderSlot(index)
            const next = [...placeholderFills]
            while (next.length <= index) next.push("")
            next[index] = value
            setPlaceholderFills(next)
          }}
        />
      )
    }

    if (isBlockReorderTask(task)) {
      const assemblyTemplate = getBlockAssemblyTemplate(task, language)
      const assemblyKind = resolveBlockAssemblyKind(blocks, assemblyTemplate)
      const blockTexts = blocks.map((block) => block.content)
      const correctOrder = Array.isArray(task.payload?.correct_order)
        ? (task.payload.correct_order as number[])
        : undefined

      if (assemblyKind === "program_reorder") {
        return (
          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" data-testid="block-task-editor">
            <BlockReorderEditor
              key={`${task.id}-${language}-reorder`}
              blocks={blocks}
              order={blockOrder}
              onChange={setBlockOrder}
            />
          </div>
        )
      }

      const baseCode =
        assemblyKind === "fragment" ? getFragmentBaseCode(task, blocks, language) : ""

      return (
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" data-testid="block-task-editor">
          <BlockAssemblyEditor
            key={`${task.id}-${language}-${assemblyKind}`}
            blocks={blockTexts}
            baseCode={baseCode}
            rawTemplate={assemblyKind === "fragment" ? assemblyTemplate : undefined}
            placements={blockPlacements}
            correctOrder={correctOrder}
            onChange={({ placements }) => setBlockPlacements(placements ?? [])}
            language={language}
            hideLanguageSelect
            shuffleKey={String(task.id)}
          />
        </div>
      )
    }

    if (isFlowchartTask(task)) {
      return (
        <div className="flex h-full min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-2">
          {isCodeToFlowchartTask(task) ? (
            <Alert>
              <AlertDescription className="text-sm">
                Постройте блок-схему по программе слева. Код меняется при выборе языка и не
                редактируется.
              </AlertDescription>
            </Alert>
          ) : null}
          <FlowchartEditor key={task.id} value={flow} onChange={setFlow} />
        </div>
      )
    }

    if (isCodingTask(task)) {
      return (
        <div className="h-full min-h-[200px] overflow-hidden" data-testid="task-learning-editor">
          <CodeEditor
            key={`${task.id}-${language}`}
            value={code}
            onChange={setCode}
            language={monacoLanguage}
            height="100%"
            constructionLanguage={language}
            constructionPatterns={taskConstructions}
            testId="task-learning-code-editor"
          />
        </div>
      )
    }

    return null
  }, [
    blockOrder,
    blockPlacements,
    blocks,
    code,
    flow,
    monacoLanguage,
    setBlockOrder,
    setBlockPlacements,
    setCode,
    setFlow,
    task,
    placeholderFills,
    setPlaceholderFills,
    language,
    taskConstructions,
    activePlaceholderSlot,
  ])

  if (!task) return null

  const referencePane = (
    <EditorShell title={`Эталон · ${knownLanguage}`}>
      <div className="h-full min-h-[200px] overflow-hidden">
        {referenceEditorReady ? (
          <CodeEditor
            value={referenceCode}
            onChange={() => {}}
            language={knownMonacoLanguage}
            readOnly
            height="100%"
          />
        ) : (
          <pre className="h-full overflow-auto rounded-lg border border-border bg-[#0b0f17] p-4 font-mono text-sm leading-relaxed text-ink">
            {referenceCode ?? ""}
          </pre>
        )}
      </div>
    </EditorShell>
  )

  const learningPane = (
    <EditorShell
      title={isWriteFromDescriptionTask(task) ? "Решение" : `Учу · ${language}`}
    >
      {editorPane}
      {isBlockReorderTask(task) &&
      resolveBlockAssemblyKind(blocks, getBlockAssemblyTemplate(task, language)) === "program_reorder" ? (
        <div className="mt-2 shrink-0 border-t border-border pt-2">
          <div className="mb-1 text-xs text-muted-foreground">Собранный код</div>
          <CodeEditor
            value={assembledCode}
            onChange={setCode}
            language={monacoLanguage}
            readOnly
            height="120px"
            constructionLanguage={language}
            constructionPatterns={taskConstructions}
          />
        </div>
      ) : null}
    </EditorShell>
  )

  const editorArea = (
    <div className="flex h-full min-h-0 min-w-0 flex-col bg-bg-2">
      {showLanguageBar ? (
        <ParallelLanguageBar
          knownLanguage={knownLanguage}
          learningLanguage={language}
          knownLanguages={knownLanguages.length ? knownLanguages : [knownLanguage]}
          learningLanguages={learningLanguages.length ? learningLanguages : [language]}
          onKnownLanguageChange={setKnownLanguage}
          onLearningLanguageChange={setLanguage}
          onSwap={swapLanguages}
        />
      ) : null}

      <div className="min-h-0 flex-1">
        {showReferenceSplit ? (
          <ResizableSplit
            layout="row"
            storageKey="task-workspace-editors"
            defaultFirstRatio={0.5}
            minFirst={240}
            minSecond={240}
            disabled={!isEditorSplit}
            className="h-full"
            first={referencePane}
            second={learningPane}
          />
        ) : (
          learningPane
        )}
      </div>
    </div>
  )

  const workspaceMain = (
    <ResizableSplit
      layout="row"
      storageKey="task-workspace-main"
      defaultFirstRatio={0.42}
      minFirst={280}
      minSecond={360}
      disabled={!isWideLayout}
      className="h-full min-h-0"
      first={
        <div className="h-full min-h-0 overflow-hidden border-b border-border xl:border-b-0 xl:border-r">
          <TaskLeftRail
            task={task}
            detectedConstructions={detectedConstructions}
            highlightLanguage={language}
          />
        </div>
      }
      second={editorArea}
    />
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-hidden">{workspaceMain}</div>

      <ResizableBottomPanel>
        <TaskBottomPanel
          task={task}
          result={result}
          onRun={() => void runCheck()}
          isSubmitting={isSubmitting}
        />
      </ResizableBottomPanel>

      {isGuest ? (
        <p className="shrink-0 border-t border-border px-4 py-2 text-center text-xs text-muted-foreground">
          Гостевой режим — прогресс не сохраняется.
        </p>
      ) : null}
    </div>
  )
}
