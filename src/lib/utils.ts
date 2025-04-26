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
