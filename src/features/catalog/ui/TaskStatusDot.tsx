import { Check } from "lucide-react"
import type { CatalogStudentStatus } from "@/features/catalog/lib/taskCatalogView"
import { cn } from "@/shared/ui/cn"

type TaskStatusDotProps = {
  status: CatalogStudentStatus
}

export default function TaskStatusDot({ status }: TaskStatusDotProps) {
  if (status === "solved") {
    return (
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-lime/35 bg-lime-soft text-xs font-bold text-lime"
        aria-label="Решено"
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    )
  }

  if (status === "attempted") {
    return (
      <span
        className="inline-block h-6 w-6 rounded-full border-2 border-purple"
        aria-label="В процессе"
      />
    )
  }

  return (
    <span
      className="inline-block h-6 w-6 rounded-full border-2 border-dashed border-[#333d4f]"
      aria-label="Не начато"
    />
  )
}
