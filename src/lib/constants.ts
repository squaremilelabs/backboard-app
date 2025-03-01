import { RelativeTarget } from "@prisma/client"

export const RELATIVE_TARGETS_ORDER: RelativeTarget[] = [
  "TODAY",
  "THIS_WEEK",
  "NEXT_WEEK",
  "THIS_MONTH",
  "NEXT_MONTH",
  "SOMEDAY",
  "NONE",
]

export const RELATIVE_TARGETS_UI_ENUM: Record<
  RelativeTarget,
  { label: string; className: string }
> = {
  TODAY: {
    label: "Now",
    className:
      "bg-linear-to-br from-gold-300 to-gold-500 text-gold-50 border-gold-500 font-semibold",
  },
  THIS_WEEK: { label: "This week", className: "bg-gold-200 text-gold-700 border-gold-300" },
  NEXT_WEEK: { label: "Next week", className: "bg-blue-200 text-blue-700 border-blue-300" },
  THIS_MONTH: { label: "This month", className: "bg-blue-100 text-blue-700 border-blue-300" },
  NEXT_MONTH: { label: "Next month", className: "bg-blue-100 text-blue-700 border-blue-300" },
  SOMEDAY: { label: "Someday", className: "bg-neutral-200 text-blue-600 border-blue-200" },
  NONE: {
    label: "No target",
    className: "bg-neutral-200 text-neutral-600 border-neutral-300",
  },
}

export const BACKBOARD_INTRO_PAGE_LINK =
  "https://squaremilelabs.notion.site/Intro-to-Backboard-1a9aece5ba118082ae09f3c876fe76a8?pvs=74"

export const PROD_BACKBOARD_TOPIC_ID = "cm7mokhx80000k4031bej9t4m"
