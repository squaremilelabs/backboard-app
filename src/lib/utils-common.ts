import { format, parse } from "date-fns"

export function formatDate(
  dateInput: Date | string | null | undefined,
  options?: {
    withTime?: boolean
    customNoneLabel?: string
    withWeekday?: boolean
    onlyWeekday?: boolean
  }
): string {
  let date = dateInput

  if (typeof date === "string") {
    try {
      date = parse(date, "yyyy-MM-dd", new Date())
    } catch (_) {
      throw new Error(`Invalid date string: ${date}`)
    }
  }

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

  if (options?.withWeekday) {
    dateFormat = "EEE " + dateFormat
  }

  if (options?.onlyWeekday) {
    dateFormat = "EEE"
  }

  return format(date, dateFormat)
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

export function formatMinutes(
  minutes: number | null | undefined,
  options?: { condense?: boolean }
): string {
  if (minutes === null || minutes === undefined) return "-"
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (!options?.condense) {
    if (hours === 0) return `${remainingMinutes}m`
    if (remainingMinutes === 0) return `${hours}h`
    return `${hours}h ${remainingMinutes}m`
  }

  // Condensed logic
  if (hours === 0) return `${remainingMinutes}m`

  if (remainingMinutes === 0) return `${hours}h`
  if (remainingMinutes >= 1 && remainingMinutes <= 19) return `${hours}h+`
  if (remainingMinutes >= 20 && remainingMinutes <= 29) return `~${hours}.5h`
  if (remainingMinutes === 30) return `${hours}.5h`
  if (remainingMinutes >= 31 && remainingMinutes <= 49) return `${hours}.5h+`
  if (remainingMinutes >= 50 && remainingMinutes <= 59) return `~${hours + 1}h`

  // fallback
  return `${hours}h ${remainingMinutes}m`
}

export interface GenericListItem {
  id: string
  title: string
  created_at: Date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any record type (as it has the above fields)
  [key: string]: any
}

export function sortItemsByOrder<T extends GenericListItem>({
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
