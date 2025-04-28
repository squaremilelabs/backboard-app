import { format } from "date-fns"
import { WithMetadata } from "./types"

export function formatDate(
  date: Date | null | undefined,
  options?: { withTime?: boolean; customNoneLabel?: string }
): string {
  if (!date || !(date instanceof Date)) {
    if (options?.customNoneLabel) return options.customNoneLabel
    return "-"
  }
  const currentYear = new Date().getFullYear()
  const inputYear = date.getFullYear()
  let dateFormat = inputYear !== currentYear ? "MMM do, yy" : "MMM do"

  if (options?.withTime) {
    dateFormat += " h:mma"
  }

  return format(date, dateFormat)
}

export function isEqualStringArrays(arr1: string[], arr2: string[]) {
  return arr1.every((value, index) => value === arr2[index])
}

export function formatMinutes(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return "-"
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours === 0) {
    return `${remainingMinutes}m`
  }
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${remainingMinutes}m`
}

export function sortItemsByOrder<T extends WithMetadata>({
  items,
  order,
}: {
  items: T[]
  order: string[]
}) {
  return items.sort((a, b) => {
    const aIndex = order.indexOf(a.id)
    const bIndex = order.indexOf(b.id)
    if (aIndex === -1 && bIndex !== -1) return -1
    if (aIndex !== -1 && bIndex === -1) return 1
    if (aIndex === -1 && bIndex === -1) {
      if (a.created_at > b.created_at) return -1
      if (a.created_at < b.created_at) return 1
      return 0
    }
    return aIndex - bIndex
  })
}

export function formatTimeString(timeString: string, options?: { withMinutes: boolean }) {
  const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/
  if (!timeRegex.test(timeString)) {
    return options?.withMinutes ? "-:--" : "-"
  }

  const [hours, minutes] = timeString.split(":").map(Number)
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, "0")
  const period = hours < 12 ? "am" : "pm"
  return options?.withMinutes
    ? `${formattedHours}:${formattedMinutes}${period}`
    : `${formattedHours}${period}`
}

export function getMondayFromDate(date: Date) {
  const day = date.getDay()
  const result = new Date(date)
  result.setHours(0, 0, 0, 0) // Reset time to midnight
  if (day === 1) return result // If it's already Monday, return the same date
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  result.setDate(diff)
  return result
}

export function getWeekdaysFromDate(date: Date) {
  const monday = getMondayFromDate(date)
  return Array.from({ length: 7 }, (_, i) => {
    const newDate = new Date(monday)
    newDate.setDate(monday.getDate() + i)
    return newDate
  })
}

type TimeslotStatus = "past" | "current" | "future"
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
