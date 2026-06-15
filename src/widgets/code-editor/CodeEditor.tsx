import Editor from "@monaco-editor/react"
import { useEffect, useRef } from "react"
import type { editor as MonacoEditor } from "monaco-editor"
import type { ConstructionRange } from "@/features/task-solving/model/constructionDetector"
import { detectConstructions } from "@/features/task-solving/model/constructionDetector"

type CodeEditorProps = {
  value: string
  onChange: (value: string) => void
  language?: string
  readOnly?: boolean
  height?: string
  constructionLanguage?: string
  constructionPatterns?: string[]
  testId?: string
}

const HIGHLIGHT_STYLE_ID = "construction-highlight-style"

function ensureHighlightStyle() {
  if (document.getElementById(HIGHLIGHT_STYLE_ID)) return
  const style = document.createElement("style")
  style.id = HIGHLIGHT_STYLE_ID
  style.textContent =
    ".construction-highlight { background-color: rgba(183, 255, 80, 0.12); border-bottom: 1px solid rgba(183, 255, 80, 0.35); border-radius: 2px; }"
  document.head.appendChild(style)
}

function rangesToDecorations(
  monaco: typeof import("monaco-editor"),
  ranges: ConstructionRange[],
) {
  return ranges.map((range) => ({
    range: new monaco.Range(
      range.startLine,
      range.startColumn,
      range.endLine,
      range.endColumn,
    ),
    options: {
      inlineClassName: "construction-highlight",
      stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
    },
  }))
}

function MonacoFallback({ height }: { height: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground"
      style={{ height }}
      aria-busy="true"
    >
      Загрузка редактора…
    </div>
  )
}

export default function CodeEditor({
  value,
  onChange,
  language = "python",
  readOnly = false,
  height = "420px",
  constructionLanguage,
  constructionPatterns = [],
  testId,
}: CodeEditorProps) {
  const fillHeight = height === "100%"
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null)
  const decorationIdsRef = useRef<string[]>([])

  useEffect(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco) return

    if (!constructionPatterns.length) {
      decorationIdsRef.current = editor.deltaDecorations(decorationIdsRef.current, [])
      return
    }

    const { ranges } = detectConstructions(
      value,
      constructionLanguage ?? language,
      constructionPatterns,
    )
    decorationIdsRef.current = editor.deltaDecorations(
      decorationIdsRef.current,
      rangesToDecorations(monaco, ranges),
    )
  }, [constructionLanguage, constructionPatterns, language, readOnly, value])

  return (
    <div
      data-testid={testId}
      className={fillHeight ? "h-full overflow-hidden rounded-lg border border-border" : "overflow-hidden rounded-lg border border-border"}
    >
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(next) => onChange(next ?? "")}
        theme="vs-dark"
        loading={<MonacoFallback height={fillHeight ? "100%" : height} />}
        onMount={(editor, monaco) => {
          editorRef.current = editor
          monacoRef.current = monaco
          ensureHighlightStyle()
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}
