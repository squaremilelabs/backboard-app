"use client"

import { createId } from "@paralleldrive/cuid2"
import { Task, TaskStatus } from "@zenstackhq/runtime/models"
import { mdiCheckCircle, mdiRecordCircle, mdiRecordCircleOutline } from "@mdi/js"
import { ChipProps } from "@/styles/class-names"

export const taskStatusUIMap: Record<
  TaskStatus,
  { label: string; color: string; mdiIconPath: string }
> = {
  DRAFT: {
    label: "Draft",
    color: "neutral",
    mdiIconPath: mdiRecordCircleOutline,
  },
  TODO: {
    label: "To Do",
    color: "gold",
    mdiIconPath: mdiRecordCircle,
  },
  DONE: {
    label: "Done",
    color: "blue",
    mdiIconPath: mdiCheckCircle,
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

export const getTaskSizeChipWeight = (minutes: number | null | undefined): ChipProps["weight"] => {
  if (!minutes) return "zero"
  if (minutes < 30) return "light"
  if (minutes < 61) return "medium"
  return "heavy"
}

export const getTaskStatusChipColor = (
  status: TaskStatus,
  options?: { useOverdueColor?: boolean }
): ChipProps["color"] => {
  if (status === "DRAFT") return options?.useOverdueColor ? "red" : "neutral"
  if (status === "TODO") return options?.useOverdueColor ? "red" : "gold"
  if (status === "DONE") return "blue"
}

// TO REMOVE
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

export function draftTask(taskValues: Partial<Task>): Task {
  return {
    id: createId(),
    created_at: new Date(),
    updated_at: new Date(),
    title: "",
    tasklist_id: null,
    timeslot_id: null,
    timeslot_tasklist_id: null,
    archived_at: null,
    created_by_id: "UNKNOWN",
    status: "DRAFT",
    size_minutes: 5,
    content: null,
    ...taskValues,
  }
}
