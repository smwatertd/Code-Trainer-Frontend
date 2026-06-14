import type { ReactNode } from "react"
import PageHeader from "@/shared/ui/PageHeader"
import { cn } from "@/shared/ui/cn"

type ShellPageProps = {
  title: string
  subtitle?: string
  right?: ReactNode
  children: ReactNode
  className?: string
}

/** Контент страницы внутри AppShell — единые отступы и заголовок как в макете. */
export default function ShellPage({
  title,
  subtitle,
  right,
  children,
  className,
}: ShellPageProps) {
  return (
    <div className={cn("py-6", className)}>
      <PageHeader title={title} subtitle={subtitle} right={right} />
      {children}
    </div>
  )
}
