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

export function TaskStatusDisplay({
  status,
  size = "default",
  iconOnly,
  customLabel,
  disableAutoHideLabel,
}: {
  status: TaskStatus
  size?: "sm" | "default"
  iconOnly?: boolean
  customLabel?: string
  disableAutoHideLabel?: boolean
}) {
  const { Icon, label: defaultLabel, color } = taskStatusDisplayValues[status]

  const label = customLabel || defaultLabel

  return (
    <div
      className={twMerge(
        "flex items-center rounded",
        size === "sm" ? "px-1 py-0.5" : "px-2 py-1",
        iconOnly ? "" : size === "sm" ? "space-x-0.5" : "@3xl:space-x-1",
        color === "neutral" ? "bg-neutral-100 text-neutral-600" : null,
        color === "gold" ? "bg-gold-100 text-gold-600" : null,
        color === "red" ? "bg-red-100 text-red-600" : null,
        color === "green" ? "bg-green-100 text-green-600" : null
      )}
    >
      <Icon size={size === "sm" ? 16 : 20} />
      {iconOnly ? null : (
        <span
          className={twMerge(
            size === "sm" ? "text-sm" : "text-base",
            disableAutoHideLabel ? "" : "hidden @3xl:block"
          )}
        >
          {label}
        </span>
      )}
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
