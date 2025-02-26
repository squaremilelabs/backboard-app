import { RelativeTarget } from "@prisma/client"

export const RELATIVE_TARGETS_UI_ENUM: Record<
  RelativeTarget,
  { label: string; className: string }
> = {
  TODAY: { label: "Today", className: "bg-gold-500 text-gold-50 border-gold-500" },
  THIS_WEEK: { label: "This week", className: "bg-gold-200 text-gold-700 border-gold-200" },
  NEXT_WEEK: { label: "Next week", className: "bg-blue-200 text-blue-700 border-blue-200" },
  THIS_MONTH: { label: "This month", className: "bg-blue-100 text-blue-700 border-blue-200" },
  NEXT_MONTH: { label: "Next month", className: "bg-blue-100 text-blue-700 border-blue-200" },
  SOMEDAY: { label: "Someday", className: "bg-neutral-200 text-blue-700 border-blue-200" },
  NONE: {
    label: "No target",
    className: "bg-neutral-200 text-neutral-600 border-neutral-200",
  },
}
