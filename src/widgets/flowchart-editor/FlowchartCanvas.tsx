import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react"
import { Maximize2, Minimize2 } from "lucide-react"
import "@xyflow/react/dist/style.css"

import type { FlowPayload } from "@/shared/types/api"
import { cn } from "@/shared/lib/utils"
import { labelFlowBlockType } from "@/shared/utils/labels"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

import FlowBlockNode, { type FlowBlockNodeData } from "./FlowBlockNode"

const nodeTypes = { flowBlock: FlowBlockNode }

const FLOWCHART_PRO_OPTIONS = { hideAttribution: true } as const

const CANVAS_HEIGHT = "h-[420px]"
const CANVAS_HEIGHT_EXPANDED = "min-h-0 flex-1"

function toReactFlow(value: FlowPayload): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = value.nodes.map((node) => ({
    id: node.id,
    type: "flowBlock",
    position: {
      x: node.position?.x ?? node.x ?? 0,
      y: node.position?.y ?? node.y ?? 0,
    },
    data: {
      type: node.type,
      text: node.text ?? "",
    } satisfies FlowBlockNodeData,
  }))

  const edges: Edge[] = value.edges.map((edge, index) => ({
    id: edge.id ?? `e-${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    label: edge.label,
  }))

  return { nodes, edges }
}

function syncFlowSteps(value: FlowPayload, nodes: Node[]): FlowPayload["flow"] {
  const byId = new Map(
    nodes.map((node) => {
      const data = node.data as FlowBlockNodeData
      return [
        node.id,
        { id: node.id, type: data.type, text: data.text || undefined },
      ] as const
    }),
  )

  const kept = value.flow.filter((step) => byId.has(step.id)).map((step) => byId.get(step.id)!)
  const keptIds = new Set(kept.map((step) => step.id))
  const added = nodes
    .filter((node) => !keptIds.has(node.id))
    .map((node) => byId.get(node.id)!)

  return [...kept, ...added]
}

function fromReactFlow(value: FlowPayload, nodes: Node[], edges: Edge[]): FlowPayload {
  const payloadNodes = nodes.map((node) => {
    const data = node.data as FlowBlockNodeData
    return {
      id: node.id,
      type: data.type,
      x: node.position.x,
      y: node.position.y,
      text: data.text,
      position: { x: node.position.x, y: node.position.y },
    }
  })

  return {
    nodes: payloadNodes,
    edges: edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      id: edge.id,
      sourceHandle: edge.sourceHandle ?? undefined,
      targetHandle: edge.targetHandle ?? undefined,
      label: typeof edge.label === "string" ? edge.label : undefined,
    })),
    flow: syncFlowSteps(value, nodes),
  }
}

type FlowchartCanvasProps = {
  value: FlowPayload
  onChange: (value: FlowPayload) => void
}

export default function FlowchartCanvas({ value, onChange }: FlowchartCanvasProps) {
  const initial = useMemo(() => toReactFlow(value), [value])
  const [nodes, setNodes] = useState<Node[]>(initial.nodes)
  const [edges, setEdges] = useState<Edge[]>(initial.edges)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [textDraft, setTextDraft] = useState("")
  const isEditingTextRef = useRef(false)

  useEffect(() => {
    if (!expanded) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [expanded])

  useEffect(() => {
    const next = toReactFlow(value)
    setNodes(next.nodes)
    setEdges(next.edges)
    // Re-sync when structure changes externally (templates, list mode), not while typing text.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    value.nodes.length,
    value.edges.length,
    value.nodes.map((node) => `${node.id}:${node.type}`).join("|"),
    value.edges.map((edge) => `${edge.source}->${edge.target}:${edge.sourceHandle ?? ""}:${edge.targetHandle ?? ""}`).join("|"),
  ])

  const commit = useCallback(
    (nextNodes: Node[], nextEdges: Edge[]) => {
      setNodes(nextNodes)
      setEdges(nextEdges)
      onChange(fromReactFlow(value, nextNodes, nextEdges))
    },
    [onChange, value],
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const nextNodes = applyNodeChanges(changes, nodes)
      commit(nextNodes, edges)
    },
    [commit, edges, nodes],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const nextEdges = applyEdgeChanges(changes, edges)
      commit(nodes, nextEdges)
    },
    [commit, edges, nodes],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      const nextEdges = addEdge(connection, edges)
      commit(nodes, nextEdges)
    },
    [commit, edges, nodes],
  )

  const selectedNode = nodes.find((node) => node.id === selectedId)
  const selectedData = selectedNode?.data as FlowBlockNodeData | undefined

  useEffect(() => {
    if (isEditingTextRef.current) return
    setTextDraft(selectedData?.text ?? "")
  }, [selectedId, selectedData?.text])

  const previewSelectedText = useCallback(
    (text: string) => {
      if (!selectedId) return
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === selectedId
            ? { ...node, data: { ...(node.data as FlowBlockNodeData), text } }
            : node,
        ),
      )
    },
    [selectedId],
  )

  const commitSelectedText = useCallback(() => {
    if (!selectedId) return
    isEditingTextRef.current = false
    const nextNodes = nodes.map((node) =>
      node.id === selectedId
        ? { ...node, data: { ...(node.data as FlowBlockNodeData), text: textDraft } }
        : node,
    )
    commit(nextNodes, edges)
  }, [commit, edges, nodes, selectedId, textDraft])

  const selectedPanel = selectedNode && selectedData ? (
    <div className="grid gap-2 rounded-lg border bg-muted/40 p-3 md:grid-cols-[120px_1fr]">
      <div className="text-sm">
        <Label>Блок</Label>
        <p className="mt-1 font-medium">{labelFlowBlockType(selectedData.type)}</p>
      </div>
      <div>
        <Label htmlFor="flow-node-text">Текст</Label>
        <Input
          id="flow-node-text"
          value={textDraft}
          placeholder="Текст блока"
          onFocus={() => {
            isEditingTextRef.current = true
          }}
          onChange={(event) => {
            const nextText = event.target.value
            setTextDraft(nextText)
            previewSelectedText(nextText)
          }}
          onBlur={() => {
            commitSelectedText()
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur()
            }
          }}
        />
      </div>
    </div>
  ) : (
    <p className="text-sm text-muted-foreground">
      Выберите блок на схеме, чтобы изменить текст. Соединяйте блоки перетаскиванием от точки на
      одном блоке к точке на другом. У «Условия» — левая и правая точки; у «Цикла» — верхняя
      (вход и возврат), нижняя (выход), слева (в тело), справа (обратно).
    </p>
  )

  const canvas = (
    <div className={cn("relative rounded-lg border bg-muted/20", expanded ? CANVAS_HEIGHT_EXPANDED : CANVAS_HEIGHT)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        proOptions={FLOWCHART_PRO_OPTIONS}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={({ nodes: selected }) => setSelectedId(selected[0]?.id ?? null)}
        connectionRadius={32}
        fitView
        deleteKeyCode={["Backspace", "Delete"]}
      >
        <Background />
        <Controls className="flowchart-controls" />
        <Panel position="top-right" className="m-0">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-8 w-8 shadow-sm"
            aria-label={expanded ? "Свернуть редактор схемы" : "Развернуть редактор схемы"}
            data-testid="flowchart-expand-toggle"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </Panel>
        {nodes.length > 0 ? (
          <MiniMap
            className="flowchart-minimap"
            zoomable
            pannable
            maskColor="hsl(220 27% 6% / 0.65)"
            nodeColor={(node) => {
              const type = (node.data as FlowBlockNodeData).type
              if (type === "decision") return "hsl(263 99% 66%)"
              if (type === "start" || type === "end") return "hsl(84 100% 50%)"
              return "hsl(215 14% 65%)"
            }}
          />
        ) : null}
      </ReactFlow>
    </div>
  )

  if (expanded) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col gap-3 bg-background/95 p-4 backdrop-blur-sm"
        data-testid="flowchart-expanded-overlay"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Редактор блок-схемы</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setExpanded(false)}
          >
            <Minimize2 className="mr-2 h-4 w-4" />
            Свернуть
          </Button>
        </div>
        {canvas}
        <div className="shrink-0">{selectedPanel}</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {canvas}
      {selectedPanel}
    </div>
  )
}
