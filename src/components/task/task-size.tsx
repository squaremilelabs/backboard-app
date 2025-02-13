import { Timer } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function TaskSizeDisplay({
  minutes,
  size = "default",
}: {
  minutes: number | null | undefined
  size?: "sm" | "default"
}) {
  return (
    <div
      // similar to task-status
      className={twMerge(
        "flex items-center rounded",
        "bg-neutral-100 text-neutral-600",
        size === "sm" ? "px-1 py-0.5" : "px-2 py-1",
        size === "sm" ? "space-x-0.5" : "space-x-1"
      )}
    >
      <Timer size={size === "sm" ? 16 : 20} />
      <span className={twMerge(size === "sm" ? "text-sm" : "text-base")}>
        {minutes ? formatMinutesToTimeString(minutes) : "-"}
      </span>
    </div>
  )
}

export function formatMinutesToTimeString(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return "-"
  if (isNaN(minutes) || minutes < 0)
    throw new Error("Invalid minutes value. Expected a non-negative number.")
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours === 0 && remainingMinutes === 0) return "0m"
  if (hours === 0) return `${remainingMinutes}m`
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}
