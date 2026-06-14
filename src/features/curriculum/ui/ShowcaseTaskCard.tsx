import type { ShowcaseTask } from "@/features/curriculum/types"
import { Badge } from "@/shared/ui/badge"
import { cn } from "@/shared/ui/cn"

const ACTION_TONE: Record<string, "default" | "secondary" | "muted"> = {
  translate: "default",
  assemble: "secondary",
  implement: "muted",
  debug: "muted",
  analyze: "muted",
  recognize: "muted",
}

type ShowcaseTaskCardProps = {
  task: ShowcaseTask
  isGuest?: boolean
  returnTo: string
  onOpen: (taskId: number, returnTo: string) => void
}

export default function ShowcaseTaskCard({
  task,
  isGuest = false,
  returnTo,
  onOpen,
}: ShowcaseTaskCardProps) {
  const status = task.progress_status
  const showStatus = !isGuest && status && status !== "not_started"

  return (
    <button
      type="button"
      onClick={() => onOpen(task.task_id, returnTo)}
      className={cn(
        "flex w-full flex-col gap-2.5 rounded-2xl border bg-surface p-4 text-left transition",
        "hover:-translate-y-0.5 hover:border-lime/45 hover:bg-surface-2",
        "hover:shadow-[0_16px_38px_-26px_rgba(142,255,1,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/20",
        !isGuest && status === "passed" && "border-lime/40",
        !isGuest && status === "failed" && "border-amber-400/40",
        "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Badge variant={ACTION_TONE[task.action] ?? "muted"}>{task.action_label}</Badge>
        <div className="flex items-center gap-1.5">
          <Badge variant="muted">{task.difficulty}</Badge>
          {showStatus ? (
            status === "passed" ? (
              <Badge variant="default">✓ Пройдено</Badge>
            ) : (
              <Badge variant="secondary">Ещё раз</Badge>
            )
          ) : null}
        </div>
      </div>

      <div>
        <b className="block text-[15px] text-ink">{task.title}</b>
        <span className="text-xs font-semibold text-[#b89bff]">{task.action_skill_label}</span>
      </div>

      <p className="m-0 text-sm text-ink-muted">{task.action_description_ru}</p>
      <p className="m-0 line-clamp-2 text-xs leading-relaxed text-ink-faint">
        {task.short_instruction}
      </p>

      <div className="mt-0.5 flex items-center gap-1.5 border-t border-border pt-2.5">
        <span className="text-[11.5px] text-ink-faint">◷ {task.subtopic_name_ru}</span>
      </div>
    </button>
  )
}
