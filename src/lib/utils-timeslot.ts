"use client"

import { Task, Timeslot } from "@zenstackhq/runtime/models"
import {
  CircleIcon,
  Clock12Icon,
  Clock5Icon,
  Clock7Icon,
  Clock9Icon,
  LucideIcon,
} from "lucide-react"
import { getISOWeek, getISOWeekYear } from "date-fns"
import { getTaskSummary } from "./utils-task"
import { formatTimeString } from "./utils-common"

export const dayHeaderHeight = 40
export const timeslotHeight = 100

export type Timeblock = {
  startTime: string
  endTime: string
  label: string
  subLabel?: string
  Icon: LucideIcon
}

export const presetTimeblocks: Timeblock[] = [
  {
    startTime: "00:00",
    endTime: "09:00",
    label: "Early Morning",
    subLabel: "Before 9am",
    Icon: Clock7Icon,
  },
  {
    startTime: "09:00",
    endTime: "12:00",
    label: "Morning",
    subLabel: "9am to 12pm",
    Icon: Clock9Icon,
  },
  {
    startTime: "12:00",
    endTime: "17:00",
    label: "Afternoon",
    subLabel: "12pm to 5pm",
    Icon: Clock12Icon,
  },
  {
    startTime: "17:00",
    endTime: "23:59",
    label: "Evening",
    subLabel: "After 5pm",
    Icon: Clock5Icon,
  },
]

export const getTimeblock = ({
  startTime,
  endTime,
}: {
  startTime: string
  endTime: string
}): Timeblock => {
  const presetTimeblock = presetTimeblocks.find(
    (t) => t.startTime === startTime && t.endTime === endTime
  )
  if (presetTimeblock) return presetTimeblock
  if (startTime === "00:00" && endTime === "23:59") {
    return {
      startTime,
      endTime,
      label: "Anytime",
      Icon: CircleIcon,
    }
  }
  return {
    startTime: formatTimeString(startTime),
    endTime: formatTimeString(endTime),
    label: `${formatTimeString(startTime)} to ${formatTimeString(endTime)}`,
    Icon: CircleIcon,
  }
}

export type TimeslotStatus = "past" | "current" | "future"

export function getTimeslotStatus({
  date,
  startTime,
  endTime,
}: {
  date: string
  startTime: string
  endTime: string
}): TimeslotStatus {
  const now = new Date()
  const startDateTime = new Date(`${date}T${startTime}`)
  const endDateTime = new Date(`${date}T${endTime}`)

  if (endDateTime < now) {
    return "past"
  } else if (startDateTime <= now && endDateTime >= now) {
    return "current"
  } else {
    return "future"
  }
}

export function sortTimeslots<T extends Timeslot & { tasks: Task[] }>(
  timeslots: T[],
  options: { doneSort?: "asc" | "desc" } = { doneSort: "asc" }
) {
  return timeslots.sort((a, b) => {
    const aTasksSummary = getTaskSummary(a.tasks)
    const bTasksSummary = getTaskSummary(b.tasks)
    const aTodoMinutes = aTasksSummary.status.TODO.minutes
    const bTodoMinutes = bTasksSummary.status.TODO.minutes
    const aDoneMinutes = aTasksSummary.status.DONE.minutes
    const bDoneMinutes = bTasksSummary.status.DONE.minutes

    // Compare by TODO minutes in descending order
    if (bTodoMinutes !== aTodoMinutes) {
      return bTodoMinutes - aTodoMinutes
    }

    // Compare by DONE minutes in ASCENDING order
    if (bDoneMinutes !== aDoneMinutes) {
      if (options.doneSort === "asc") return aDoneMinutes - bDoneMinutes
      if (options.doneSort === "desc") return bDoneMinutes - aDoneMinutes
    }

    // Fallback to comparing by created_at in ascending order
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}

export function getISOWeekString(date: Date) {
  const isoWeekYear = getISOWeekYear(date)
  const isoWeek = getISOWeek(date)
  return `${isoWeekYear}-W${String(isoWeek).padStart(2, "0")}`
}
