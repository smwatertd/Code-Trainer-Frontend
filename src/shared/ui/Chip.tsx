import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/shared/ui/cn"

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
  size?: "default" | "sm"
}

export default function Chip({
  active,
  size = "default",
  className,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      className={cn("tp-chip", active && "on", size === "sm" && "sm", className)}
      {...props}
    />
  )
}
