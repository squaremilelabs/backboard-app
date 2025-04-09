import { TaskStatus } from "@zenstackhq/runtime/models"
import { Diamond, DiamondMinus, LucideIcon, SquareCheckBig } from "lucide-react"

export const BACKBOARD_INTRO_PAGE_LINK =
  "https://squaremilelabs.notion.site/Intro-to-Backboard-1a9aece5ba118082ae09f3c876fe76a8?pvs=74"

export const PROD_BACKBOARD_TOPIC_ID = "cm7mokhx80000k4031bej9t4m"

export const TASK_STATUS_UI_MAP: Record<
  TaskStatus,
  { Icon: LucideIcon; label: string; colorVariable: string }
> = {
  NOW: {
    Icon: Diamond,
    label: "Now",
    colorVariable: "gold",
  },
  LATER: {
    Icon: DiamondMinus,
    label: "Later",
    colorVariable: "neutral",
  },
  DONE: {
    Icon: SquareCheckBig,
    label: "Done",
    colorVariable: "blue",
  },
}
