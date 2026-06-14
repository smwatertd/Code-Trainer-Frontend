import { useEffect, useRef, useState } from "react"
import type { useTaskSolver } from "@/features/task-solving"
import { useLanguages } from "@/features/languages/hooks/useLanguages"
import { getTaskBlocks } from "@/features/task-solving/model/solverState"
import BlockReorderEditor from "@/widgets/block-reorder/BlockReorderEditor"
import CodeEditor from "@/widgets/code-editor/CodeEditor"
import FlowchartEditor from "@/widgets/flowchart-editor/FlowchartEditor"
import ResultsPanel from "@/widgets/results-panel/ResultsPanel"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import { Label } from "@/shared/ui/label"
import SimpleSelect from "@/shared/ui/SimpleSelect"
import { Alert, AlertDescription } from "@/shared/ui/alert"
import { labelLanguage, labelTaskType } from "@/shared/utils/labels"
import {
  isBlockReorderTask,
  isCodeToFlowchartTask,
  isCodingTask,
  isFlowchartTask,
  isTranslationTask,
  isWriteFromDescriptionTask,
  problemStatement,
  sourceCode,
  selectableLanguages,
  resolveSolverLanguage,
} from "@/shared/utils/taskTypes"

type Solver = ReturnType<typeof useTaskSolver>

type TaskWorkspaceProps = {
  solver: Solver
  isGuest?: boolean
  showSubmissionHistory?: boolean
}

export default function TaskWorkspace({ solver, isGuest = false, showSubmissionHistory = false }: TaskWorkspaceProps) {
  const { data: languages = [] } = useLanguages()
  const leftColumnRef = useRef<HTMLDivElement>(null)
  const [leftColumnHeight, setLeftColumnHeight] = useState<number | null>(null)
  const {
    task,
    code,
    setCode,
    language,
    setLanguage,
    blockOrder,
    setBlockOrder,
    flow,
    setFlow,
    result,
    isSubmitting,
    submitError,
    pollError,
    runCheck,
    selectedSubmissionId,
    loadSubmissionFromHistory,
    assembledCode,
  } = solver

  useEffect(() => {
    const node = leftColumnRef.current
    if (!node) {
      setLeftColumnHeight(null)
      return
    }

    const desktopQuery = window.matchMedia("(min-width: 1024px)")

    const updateHeight = () => {
      if (!desktopQuery.matches) {
        setLeftColumnHeight(null)
        return
      }
      setLeftColumnHeight(node.offsetHeight)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(node)
    desktopQuery.addEventListener("change", updateHeight)
    window.addEventListener("resize", updateHeight)
    return () => {
      observer.disconnect()
      desktopQuery.removeEventListener("change", updateHeight)
      window.removeEventListener("resize", updateHeight)
    }
  }, [task?.id])

  if (!task) return null

  const blocks = getTaskBlocks(task, language)
  const monacoLanguage =
    languages.find((item) => item.id === language)?.monaco_language ?? language
  const languageOptions = selectableLanguages(task, languages.length ? languages : [{ id: language, label: language }])
  const resolvedLanguage = resolveSolverLanguage(
    task,
    language,
    languageOptions.map((item) => item.id),
  )

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start">
      <div ref={leftColumnRef} className="min-w-0 flex-1">
        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold">{task.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
              </div>
              <Badge variant="secondary">{labelTaskType(task.task_type)}</Badge>
            </div>

            {isTranslationTask(task) && sourceCode(task) ? (
              <div>
                <Label className="mb-2 block">Исходный код</Label>
                <CodeEditor value={sourceCode(task)} onChange={() => {}} readOnly height="180px" />
              </div>
            ) : null}

            {isWriteFromDescriptionTask(task) ? (
              <Alert>
                <AlertDescription className="text-sm">
                  Напишите программу по условию в описании задачи. Решение проверяется автоматически
                  по тестам на сервере.
                </AlertDescription>
              </Alert>
            ) : null}

            {isWriteFromDescriptionTask(task) && problemStatement(task) ? (
              <div className="rounded-md border bg-muted/40 p-3">
                <Label className="mb-2 block">Подробное условие</Label>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {problemStatement(task)}
                </p>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <Label htmlFor="language-select">Язык</Label>
              <SimpleSelect
                id="language-select"
                triggerTestId="language-select"
                value={resolvedLanguage}
                onValueChange={setLanguage}
                className="w-[180px]"
                options={languageOptions.map((item) => ({
                  value: item.id,
                  label: item.label ?? labelLanguage(item.id),
                }))}
              />
              <Button onClick={() => void runCheck()} disabled={isSubmitting} data-testid="task-check-btn">
                {isSubmitting ? "Проверка…" : "Проверить"}
              </Button>
            </div>

            {isBlockReorderTask(task) ? (
              <BlockReorderEditor blocks={blocks} order={blockOrder} onChange={setBlockOrder} />
            ) : null}

            {isFlowchartTask(task) ? (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription className="text-sm">
                    Постройте блок-схему по программе слева. Код меняется при выборе языка и не
                    редактируется. Для «Условия» проведите две стрелки из правой и левой точек. У
                    «Цикла» верхняя точка — вход и возврат из тела; нижняя — выход; слева — в
                    тело; справа — обратно из тела.
                  </AlertDescription>
                </Alert>
                {isCodeToFlowchartTask(task) ? (
                  <div>
                    <Label className="mb-2 block">Код программы (только для чтения)</Label>
                    <CodeEditor
                      value={code}
                      onChange={() => {}}
                      language={monacoLanguage}
                      readOnly
                      height="180px"
                    />
                  </div>
                ) : null}
                <FlowchartEditor key={task.id} value={flow} onChange={setFlow} />
              </div>
            ) : null}

            {isCodingTask(task) ? (
              <CodeEditor value={code} onChange={setCode} language={monacoLanguage} />
            ) : null}

            {isBlockReorderTask(task) ? (
              <div>
                <Label className="mb-2 block">Собранный код</Label>
                <CodeEditor
                  value={assembledCode}
                  onChange={setCode}
                  language={monacoLanguage}
                  readOnly
                />
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <aside
        className="flex min-h-0 w-full flex-col lg:w-[360px] lg:shrink-0"
        style={leftColumnHeight != null ? { height: leftColumnHeight } : undefined}
      >
        <ResultsPanel
          result={result}
          submitError={submitError}
          pollError={pollError}
          isGuest={isGuest}
          taskId={showSubmissionHistory ? task.id : null}
          showHistory={showSubmissionHistory}
          selectedSubmissionId={selectedSubmissionId}
          onSelectHistoryItem={(item) => void loadSubmissionFromHistory(item.id)}
        />
      </aside>
    </div>
  )
}
