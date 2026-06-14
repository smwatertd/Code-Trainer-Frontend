import type { ReactNode } from "react"
import { cn } from "@/shared/ui/cn"

type PageHeaderProps = {
  title: string
  subtitle?: string
  right?: ReactNode
  className?: string
}

export default function PageHeader({ title, subtitle, right, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-5 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-ink-muted">{subtitle}</p> : null}
      </div>
      {right ? <div className="flex flex-wrap items-center gap-2.5">{right}</div> : null}
    </div>
  )
}
