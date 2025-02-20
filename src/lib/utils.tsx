import { format } from "date-fns"

export function formatDate(date: Date): string {
  const currentYear = new Date().getFullYear()
  const inputYear = date.getFullYear()
  if (inputYear !== currentYear) {
    return format(date, "MMM d, yy")
  }
  return format(date, "MMM d")
}
