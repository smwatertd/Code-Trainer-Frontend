import { cn } from "@/shared/ui/cn"

type BrandProps = {
  className?: string
  compact?: boolean
  purple?: boolean
}

export default function Brand({ className, compact, purple }: BrandProps) {
  return (
    <div className={cn("brand flex items-center gap-[11px]", compact && "compact", className)}>
      <span
        className={cn(
          "dot relative shrink-0 rounded-[9px] bg-lime shadow-glow-lime",
          compact ? "h-6 w-6 rounded-[7px]" : "h-[30px] w-[30px]",
          purple &&
            "bg-purple shadow-[0_0_0_1px_rgba(139,83,254,.5),0_8px_30px_-8px_rgba(139,83,254,.45)]",
        )}
        aria-hidden
      />
      <b className={cn("text-[17px] tracking-[-0.3px]", compact && "text-base")}>
        Практика
        <span className="pulse font-serif font-normal italic text-purple"> кода</span>
      </b>
    </div>
  )
}
