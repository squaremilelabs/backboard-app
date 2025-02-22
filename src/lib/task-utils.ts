import { TaskTarget } from "@prisma/client"

export const ORDERED_TASK_TARGETS: TaskTarget[] = [
  "TODAY",
  "THIS_WEEK",
  "NEXT_WEEK",
  "THIS_MONTH",
  "NEXT_MONTH",
  "SOMEDAY",
  "NO_TARGET",
]

export const TASK_TARGET_DISPLAY_MAP: Record<TaskTarget, { label: string; className: string }> = {
  TODAY: { label: "Today", className: "bg-gold-600 text-gold-50" },
  THIS_WEEK: { label: "This week", className: "bg-gold-300 text-gold-900" },
  NEXT_WEEK: { label: "Next week", className: "bg-blue-200 text-blue-700" },
  THIS_MONTH: { label: "This month", className: "bg-blue-100 text-blue-700" },
  NEXT_MONTH: { label: "Next month", className: "bg-blue-100 text-blue-600" },
  SOMEDAY: { label: "Someday", className: "bg-neutral-100 text-blue-600" },
  NO_TARGET: { label: "No target", className: "bg-neutral-100 text-neutral-600" },
}
