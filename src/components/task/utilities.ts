"use client"

import { Task, TaskStatus } from "@zenstackhq/runtime/models"
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

export function getTaskSummary(tasks: Task[]): {
  status: Record<TaskStatus, { count: number; minutes: number }>
  total: { count: number; minutes: number }
} {
  const totalCount = tasks.length
  const totalMinutes = tasks.reduce((sum, task) => sum + (task.size_minutes ?? 0), 0)

  const todoTasks = tasks.filter((task) => task.status === "TODO")
  const todoCount = todoTasks.length
  const todoMinutes = todoTasks.reduce((sum, task) => sum + (task.size_minutes ?? 0), 0)

  const draftTasks = tasks.filter((task) => task.status === "DRAFT")
  const draftCount = draftTasks.length
  const draftMinutes = draftTasks.reduce((sum, task) => sum + (task.size_minutes ?? 0), 0)

  const doneTasks = tasks.filter((task) => task.status === "DONE")
  const doneCount = doneTasks.length
  const doneMinutes = doneTasks.reduce((sum, task) => sum + (task.size_minutes ?? 0), 0)

  return {
    status: {
      DRAFT: { count: draftCount, minutes: draftMinutes },
      TODO: { count: todoCount, minutes: todoMinutes },
      DONE: { count: doneCount, minutes: doneMinutes },
    },
    total: { count: totalCount, minutes: totalMinutes },
  }
}
