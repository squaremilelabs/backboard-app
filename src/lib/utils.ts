import { format } from "date-fns"

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
