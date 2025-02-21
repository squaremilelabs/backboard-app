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
  NO_TARGET: { label: "No target", className: "bg-neutral-50 text-neutral-600" },
  TODAY: { label: "Today", className: "bg-gold-100 text-gold-600" },
  THIS_WEEK: { label: "This week", className: "bg-gold-100 text-gold-600" },
  NEXT_WEEK: { label: "Next week", className: "bg-gold-50 text-gold-600" },
  THIS_MONTH: { label: "This month", className: "bg-gold-50 text-gold-600" },
  NEXT_MONTH: { label: "Next month", className: "bg-gold-50 text-gold-600" },
  SOMEDAY: { label: "Someday", className: "bg-neutral-50 text-gold-600" },
}
