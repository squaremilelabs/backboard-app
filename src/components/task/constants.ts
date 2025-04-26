"use client"

import { TaskStatus } from "@prisma/client"
import { Circle, CircleCheckBig, CircleDashed, LucideIcon } from "lucide-react"

export const taskStatusUIMap: Record<
  TaskStatus,
  { label: string; color: string; Icon: LucideIcon }
> = {
  DRAFT: {
    label: "Draft",
    color: "neutral",
    Icon: CircleDashed,
  },
  TODO: {
    label: "To-do",
    color: "gold",
    Icon: Circle,
  },
  DONE: {
    label: "Done",
    color: "blue",
    Icon: CircleCheckBig,
  },
}

export const taskStatuses: TaskStatus[] = ["DRAFT", "TODO", "DONE"]

export const taskSizeOptions: { label: string; value: number }[] = [
  { label: "5m", value: 5 },
  { label: "15m", value: 15 },
  { label: "30m", value: 30 },
  { label: "1h", value: 60 },
  { label: "2h", value: 120 },
  { label: "4h", value: 240 },
]

export type TaskSizeTier = "zero" | "low" | "medium" | "high"

export const getTaskSizeTier = (minutes: number | null | undefined): TaskSizeTier => {
  if (!minutes) return "zero"
  if (minutes < 30) return "low"
  if (minutes < 61) return "medium"
  return "high"
}
