import { add, format, parse, sub } from "date-fns"
import useRouterUtility from "./router-utility"

export function useScheduleParams() {
  const router = useRouterUtility<{ date: string | null; timeslot: string | null }>()
  const dateParam = router.query.date
  const timeslotParam = router.query.timeslot

  const weekStartDate = dateParam
    ? getMondayFromDate(parse(dateParam, "yyyy-MM-dd", new Date()))
    : getMondayFromDate(new Date())

  const nextWeekStartDate = add(weekStartDate, { days: 7 })
  const prevWeekStartDate = sub(weekStartDate, { days: 7 })

  const nextWeekHref = router.constructHref({
    path: "/schedule",
    query: { date: format(nextWeekStartDate, "yyyy-MM-dd") },
    merge: true,
  })

  const currentWeekHref = router.constructHref({
    path: "/schedule",
    query: { date: null },
    merge: true,
  })

  const prevWeekHref = router.constructHref({
    path: "/schedule",
    query: { date: format(prevWeekStartDate, "yyyy-MM-dd") },
    merge: true,
  })

  const getTimeslotHref = (timeslotId: string) =>
    router.constructHref({
      path: "/schedule",
      query: { timeslot: timeslotId },
      merge: true,
    })

  const closeTimeslotHref = router.constructHref({
    path: "/schedule",
    query: { timeslot: null },
    merge: true,
  })

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
