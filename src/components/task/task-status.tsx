"use client"

import { TaskStatus } from "@prisma/client"
import { CircleCheckBig, CircleDashed, CircleDot, CircleX, LucideIcon } from "lucide-react"
import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"

type TaskStatusDisplayValue = {
  Icon: LucideIcon
  label: string
  color: "neutral" | "gold" | "red" | "green"
}

const taskStatusDisplayValues: Record<TaskStatus, TaskStatusDisplayValue> = {
  DRAFT: {
    Icon: CircleDashed,
    label: "Draft",
    color: "neutral",
  },
  TO_DO: {
    Icon: CircleDot,
    label: "To-do",
    color: "gold",
  },
  BLOCKED: {
    Icon: CircleX,
    label: "Blocked",
    color: "red",
  },
  DONE: {
    Icon: CircleCheckBig,
    label: "Done",
    color: "green",
  },
  CANCELED: {
    Icon: CircleX,
    label: "Canceled",
    color: "neutral",
  },
}

export function TaskStatusDisplay({ status }: { status: TaskStatus }) {
  const { Icon, label, color } = taskStatusDisplayValues[status]

  return (
    <div
      className={twMerge(
        "flex items-center space-x-1 rounded px-2 py-1",
        color === "neutral" ? "bg-neutral-100 text-neutral-600" : null,
        color === "gold" ? "bg-gold-100 text-gold-600" : null,
        color === "red" ? "bg-red-100 text-red-600" : null,
        color === "green" ? "bg-green-100 text-green-600" : null
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </div>
  )
}

export function TaskStatusButton({ status }: { status: TaskStatus }) {
  return (
    <Button
      className={twMerge("cursor-pointer hover:opacity-80", "data-pressed:scale-95", "rounded")}
    >
      <TaskStatusDisplay status={status} />
    </Button>
  )
}
