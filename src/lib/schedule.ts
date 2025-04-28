import { add, format, parse, sub } from "date-fns"
import { useSearchParams } from "next/navigation"

export function useScheduleParams() {
  const searchParams = useSearchParams()
  const dateParam = searchParams.get("date")
  const timeslotParam = searchParams.get("timeslot")

  const weekStartDate = dateParam
    ? getMondayFromDate(parse(dateParam, "yyyy-MM-dd", new Date()))
    : getMondayFromDate(new Date())

  const currentTimeslotParam = timeslotParam ? `&timeslot=${timeslotParam}` : ""
  const currentDateParam = dateParam ? `&date=${dateParam}` : ""

  const nextWeekStartDate = add(weekStartDate, { days: 7 })
  const prevWeekStartDate = sub(weekStartDate, { days: 7 })

  const nextWeekParam = `date=${format(nextWeekStartDate, "yyyy-MM-dd")}`
  const prevWeekParam = `date=${format(prevWeekStartDate, "yyyy-MM-dd")}`

  const nextWeekHref = `/schedule?${nextWeekParam}` + currentTimeslotParam

  const currentWeekHref = `/schedule` + (timeslotParam ? `?timeslot=${timeslotParam}` : "")

  const prevWeekHref = `/schedule?${prevWeekParam}` + currentTimeslotParam

  const getTimeslotHref = (timeslotId: string) =>
    `/schedule?timeslot=${timeslotId}` + currentDateParam

  const closeTimeslotHref = `/schedule` + (dateParam ? `?date=${dateParam}` : "")

  return {
    weekStartDate,
    nextWeekHref,
    currentWeekHref,
    prevWeekHref,
    timeslotId: timeslotParam,
    getTimeslotHref,
    closeTimeslotHref,
  }
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
