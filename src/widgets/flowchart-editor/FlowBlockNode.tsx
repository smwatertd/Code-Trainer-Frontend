import { Handle, Position, type NodeProps } from "@xyflow/react"

import { cn } from "@/shared/lib/utils"
import { labelFlowBlockType } from "@/shared/utils/labels"

export type FlowBlockNodeData = {
  type: string
  text: string
}

const HANDLE_CLASS = "!h-3 !w-3 !border-2 !border-background !bg-primary"

function blockShellClass(type: string, selected: boolean | undefined): string {
  const base = selected ? "border-primary ring-2 ring-primary/30" : "border-border"
  if (type === "decision") {
    return cn(
      "min-w-[120px] min-h-[120px] rotate-45 border bg-background px-3 py-3 text-sm shadow-sm",
      base,
    )
  }
  if (type === "loop") {
    return cn(
      "min-w-[150px] rounded-2xl border-2 border-dashed bg-background px-3 py-2 text-sm shadow-sm",
      selected ? "border-primary" : "border-amber-500/70",
    )
  }
  return cn("min-w-[140px] rounded-md border bg-background px-3 py-2 text-sm shadow-sm", base)
}

function LoopNodeContent({ blockData }: { blockData: FlowBlockNodeData }) {
  const title = labelFlowBlockType(blockData.type)

  return (
    <>
      <Handle
        id="in"
        type="target"
        position={Position.Top}
        className={HANDLE_CLASS}
        isConnectable
      />
      <Handle
        id="body"
        type="source"
        position={Position.Left}
        className={HANDLE_CLASS}
        style={{ top: "50%" }}
        isConnectable
      />
      <Handle
        id="back"
        type="target"
        position={Position.Right}
        className={HANDLE_CLASS}
        style={{ top: "50%" }}
        isConnectable
      />
      <Handle
        id="out"
        type="source"
        position={Position.Bottom}
        className={HANDLE_CLASS}
        isConnectable
      />
      <div className="font-medium">{title}</div>
      {blockData.text ? (
        <div className="mt-1 break-all text-xs text-muted-foreground">{blockData.text}</div>
      ) : null}
      <p className="mt-1 text-[10px] text-muted-foreground">
        Верхняя — вход (и возврат из тела); нижняя — выход; слева — в тело; справа — обратно
      </p>
    </>
  )
}

export default function FlowBlockNode({ data, selected }: NodeProps) {
  const blockData = data as FlowBlockNodeData
  const title = labelFlowBlockType(blockData.type)
  const isDecision = blockData.type === "decision"
  const isLoop = blockData.type === "loop"

  if (isLoop) {
    return <div className={blockShellClass(blockData.type, selected)}><LoopNodeContent blockData={blockData} /></div>
  }

  return (
    <div className={blockShellClass(blockData.type, selected)}>
      <Handle type="target" position={Position.Top} className={HANDLE_CLASS} isConnectable />
      {isDecision ? (
        <>
          <Handle
            id="no"
            type="source"
            position={Position.Left}
            className={HANDLE_CLASS}
            style={{ top: "50%" }}
            isConnectable
          />
          <Handle
            id="yes"
            type="source"
            position={Position.Right}
            className={HANDLE_CLASS}
            style={{ top: "50%" }}
            isConnectable
          />
          <div className="-rotate-45 text-center">
            <div className="font-medium">{title}</div>
            {blockData.text ? (
              <div className="mt-1 break-all text-xs text-muted-foreground">{blockData.text}</div>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <Handle type="source" position={Position.Bottom} className={HANDLE_CLASS} isConnectable />
          <div className="font-medium">{title}</div>
          {blockData.text ? (
            <div className="mt-1 break-all text-xs text-muted-foreground">{blockData.text}</div>
          ) : null}
        </>
      )}
    </div>
  )
}
