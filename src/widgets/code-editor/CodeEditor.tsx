import { lazy, Suspense } from "react"

type CodeEditorProps = {
  value: string
  onChange: (value: string) => void
  language?: string
  readOnly?: boolean
  height?: string
}

const LazyMonacoEditor = lazy(() =>
  import("@monaco-editor/react").then((module) => ({ default: module.default })),
)

function MonacoFallback({ height }: { height: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground"
      style={{ height }}
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
}: CodeEditorProps) {
  const fillHeight = height === "100%"

  return (
    <div className={fillHeight ? "h-full overflow-hidden rounded-lg border border-border" : "overflow-hidden rounded-lg border border-border"}>
      <Suspense fallback={<MonacoFallback height={fillHeight ? "100%" : height} />}>
        <LazyMonacoEditor
          height={height}
          language={language}
          value={value}
          onChange={(next) => onChange(next ?? "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            readOnly,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </Suspense>
    </div>
  )
}
