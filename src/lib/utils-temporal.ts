"use client"

import { Task, Timeslot } from "@zenstackhq/runtime/models"
import { BirdIcon, CircleIcon, LucideIcon, MoonIcon, SunIcon } from "lucide-react"
import { add, format, getISOWeek, getISOWeekYear, parse, startOfDay } from "date-fns"
import { getTaskSummary } from "./utils-task"
import { formatTimeString } from "./utils-common"

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
    endTime: "12:00",
    label: "Morning",
    subLabel: "Before noon",
    Icon: BirdIcon,
  },
  {
    startTime: "12:00",
    endTime: "17:00",
    label: "Afternoon",
    subLabel: "Noon to 5pm",
    Icon: SunIcon,
  },
  {
    startTime: "17:00",
    endTime: "23:59",
    label: "Evening",
    subLabel: "After 5pm",
    Icon: MoonIcon,
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
      label: "All day",
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

export type TemporalStatus = "past" | "current" | "future"

export function getTemporalStatus({
  date,
  startTime,
  endTime,
}: {
  date: string
  startTime: string
  endTime: string
}): TemporalStatus {
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

export function getTemporalStatusFromTimeslot(timeslot: Timeslot): TemporalStatus {
  return getTemporalStatus({
    date: timeslot.date,
    startTime: timeslot.start_time,
    endTime: timeslot.end_time,
  })
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

export function getISOWeekDates(isoWeekString: string) {
  if (!isoWeekString) return []
  const [year, week] = isoWeekString.split("-W").map(Number)
  const firstDay = startOfDay(parse(`${year} ${week}`, "R I", new Date()))
  return Array.from({ length: 7 }, (_, i) => {
    const date = add(firstDay, { days: i })
    return format(date, "yyyy-MM-dd")
  })
}
