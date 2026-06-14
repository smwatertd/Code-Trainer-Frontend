import { lazy, Suspense, useState } from "react"

import type { FlowPayload } from "@/shared/types/api"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import SimpleSelect from "@/shared/ui/SimpleSelect"

import { labelFlowBlockType } from "@/shared/utils/labels"

import { FLOWCHART_TEMPLATES } from "./flowchartTemplates"

const FlowchartCanvas = lazy(() => import("./FlowchartCanvas"))

const NODE_TYPES = ["start", "input", "decision", "loop", "output", "process", "end"] as const

type EditorMode = "canvas" | "list"

type FlowchartEditorProps = {
  value: FlowPayload
  onChange: (value: FlowPayload) => void
}

export default function FlowchartEditor({ value, onChange }: FlowchartEditorProps) {
  const [mode, setMode] = useState<EditorMode>("canvas")

  const addNode = (type: (typeof NODE_TYPES)[number]) => {
    const id = String(Date.now())
    const node = { id, type, text: "", x: 80, y: value.nodes.length * 100 }
    onChange({
      nodes: [...value.nodes, node],
      edges: value.edges,
      flow: [...value.flow, { id, type, text: "" }],
    })
  }

  const updateNode = (id: string, patch: Partial<{ type: string; text: string }>) => {
    const nodes = value.nodes.map((node) => (node.id === id ? { ...node, ...patch } : node))
    const flow = value.flow.map((step) => (step.id === id ? { ...step, ...patch } : step))
    onChange({ ...value, nodes, flow })
  }

  const removeNode = (id: string) => {
    onChange({
      nodes: value.nodes.filter((node) => node.id !== id),
      edges: value.edges.filter((edge) => edge.source !== id && edge.target !== id),
      flow: value.flow.filter((step) => step.id !== id),
    })
  }

  const addEdge = () => {
    const source = value.nodes[0]?.id
    const target = value.nodes[1]?.id
    if (!source || !target) return
    onChange({ ...value, edges: [...value.edges, { source, target }] })
  }

  const updateEdge = (index: number, patch: Partial<{ source: string; target: string }>) => {
    const edges = value.edges.map((edge, edgeIndex) =>
      edgeIndex === index ? { ...edge, ...patch } : edge,
    )
    onChange({ ...value, edges })
  }

  const removeEdge = (index: number) => {
    onChange({ ...value, edges: value.edges.filter((_, edgeIndex) => edgeIndex !== index) })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={mode === "canvas" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("canvas")}
        >
          Схема
        </Button>
        <Button
          variant={mode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("list")}
        >
          Список
        </Button>
        <span className="mx-1 text-muted-foreground">|</span>
        {FLOWCHART_TEMPLATES.map((template) => (
          <Button
            key={template.id}
            variant="secondary"
            size="sm"
            data-testid={`flowchart-template-${template.id}`}
            onClick={() => onChange(template.payload)}
          >
            {template.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {NODE_TYPES.map((type) => (
          <Button key={type} variant="outline" size="sm" onClick={() => addNode(type)}>
            + {labelFlowBlockType(type)}
          </Button>
        ))}
      </div>

      {mode === "canvas" ? (
        <Suspense
          fallback={
            <div className="flex h-[420px] items-center justify-center rounded-lg border bg-muted/20 text-sm text-muted-foreground">
              Загрузка схемы…
            </div>
          }
        >
          <FlowchartCanvas value={value} onChange={onChange} />
        </Suspense>
      ) : (
        <>
          <div className="space-y-2">
            {value.nodes.map((node) => (
              <div
                key={node.id}
                className="grid gap-2 rounded-lg border bg-muted/40 p-3 md:grid-cols-[120px_1fr_auto]"
              >
                <SimpleSelect
                  value={node.type}
                  onValueChange={(value) => updateNode(node.id, { type: value })}
                  options={NODE_TYPES.map((type) => ({
                    value: type,
                    label: labelFlowBlockType(type),
                  }))}
                  className="w-[120px]"
                />
                <Input
                  value={node.text ?? ""}
                  placeholder="Текст блока"
                  onChange={(event) => updateNode(node.id, { text: event.target.value })}
                />
                <Button variant="ghost" size="sm" onClick={() => removeNode(node.id)}>
                  Удалить
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Связи</Label>
              <Button variant="outline" size="sm" onClick={addEdge}>
                + связь
              </Button>
            </div>
            {value.edges.map((edge, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2">
                <SimpleSelect
                  value={edge.source}
                  onValueChange={(value) => updateEdge(index, { source: value })}
                  options={value.nodes.map((node) => ({
                    value: node.id,
                    label: `${node.id} (${labelFlowBlockType(node.type)})`,
                  }))}
                  className="min-w-[140px]"
                />
                <span className="text-muted-foreground">→</span>
                <SimpleSelect
                  value={edge.target}
                  onValueChange={(value) => updateEdge(index, { target: value })}
                  options={value.nodes.map((node) => ({
                    value: node.id,
                    label: `${node.id} (${labelFlowBlockType(node.type)})`,
                  }))}
                  className="min-w-[140px]"
                />
                <Button variant="ghost" size="sm" onClick={() => removeEdge(index)}>
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
