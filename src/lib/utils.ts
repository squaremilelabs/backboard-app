import { format } from "date-fns"

export function formatDate(
  date: Date | null | undefined,
  options?: { withTime?: boolean; customNoneLabel?: string }
): string {
  if (!date) {
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
