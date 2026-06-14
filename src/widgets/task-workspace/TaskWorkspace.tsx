import { useMemo, type ReactNode } from "react"
import type { useTaskSolver } from "@/features/task-solving"
import { useLanguages } from "@/features/languages/hooks/useLanguages"
import { getTaskBlocks } from "@/features/task-solving/model/solverState"
import { hasReferencePane } from "@/features/task-solving/model/studentUiUtils"
import BlockReorderEditor from "@/widgets/block-reorder/BlockReorderEditor"
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
  isWriteFromDescriptionTask,
} from "@/shared/utils/taskTypes"

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
    flow,
    setFlow,
    result,
    isSubmitting,
    runCheck,
    assembledCode,
  } = solver

  if (!task) return null

  const blocks = getTaskBlocks(task, language)
  const monacoLanguage =
    languages.find((item) => item.id === language)?.monaco_language ?? language
  const knownMonacoLanguage =
    languages.find((item) => item.id === knownLanguage)?.monaco_language ?? knownLanguage
  const showReferenceSplit = hasReferencePane(task)
  const showLanguageBar = knownLanguages.length > 0 || learningLanguages.length > 1

  const editorPane = useMemo(() => {
    if (isBlockReorderTask(task)) {
      return (
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          <BlockReorderEditor blocks={blocks} order={blockOrder} onChange={setBlockOrder} />
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
        <div className="h-full min-h-[200px] overflow-hidden">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={monacoLanguage}
            height="100%"
          />
        </div>
      )
    }

    return null
  }, [
    blockOrder,
    blocks,
    code,
    flow,
    monacoLanguage,
    setBlockOrder,
    setCode,
    setFlow,
    task,
  ])

  const referencePane = (
    <EditorShell title={`Эталон · ${knownLanguage}`}>
      <div className="h-full min-h-[200px] overflow-hidden">
        <CodeEditor
          value={referenceCode}
          onChange={() => {}}
          language={knownMonacoLanguage}
          readOnly
          height="100%"
        />
      </div>
    </EditorShell>
  )

  const learningPane = (
    <EditorShell
      title={isWriteFromDescriptionTask(task) ? "Решение" : `Учу · ${language}`}
    >
      {editorPane}
      {isBlockReorderTask(task) ? (
        <div className="mt-2 shrink-0 border-t border-border pt-2">
          <div className="mb-1 text-xs text-muted-foreground">Собранный код</div>
          <CodeEditor
            value={assembledCode}
            onChange={setCode}
            language={monacoLanguage}
            readOnly
            height="120px"
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
          <TaskLeftRail task={task} />
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
