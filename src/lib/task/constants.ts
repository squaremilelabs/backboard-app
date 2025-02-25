import { TaskDoneTarget } from "@prisma/client"

export const ORDERED_TASK_DONE_TARGETS: TaskDoneTarget[] = [
  "TODAY",
  "THIS_WEEK",
  "NEXT_WEEK",
  "THIS_MONTH",
  "NEXT_MONTH",
  "SOMEDAY",
  "NO_TARGET",
]

export const TASK_DONE_TARGET_DISPLAY_MAP: Record<
  TaskDoneTarget,
  { label: string; className: string }
> = {
  TODAY: { label: "Today", className: "bg-gold-500 text-gold-50 border-gold-500" },
  THIS_WEEK: { label: "This week", className: "bg-gold-200 text-gold-700 border-gold-200" },
  NEXT_WEEK: { label: "Next week", className: "bg-blue-200 text-blue-700 border-blue-200" },
  THIS_MONTH: { label: "This month", className: "bg-blue-100 text-blue-700 border-blue-200" },
  NEXT_MONTH: { label: "Next month", className: "bg-blue-100 text-blue-700 border-blue-200" },
  SOMEDAY: { label: "Someday", className: "bg-neutral-100 text-blue-700 border-neutral-200" },
  NO_TARGET: {
    label: "No target",
    className: "bg-neutral-100 text-neutral-600 border-neutral-200",
  },
}
