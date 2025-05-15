import { add, sub, parse } from "date-fns"
import { useCallback } from "react"
import { useLocalStorageUtility } from "./storage-utility"
import { getISOWeekDates, getISOWeekString } from "./utils-temporal"

const currentIsoWeek = getISOWeekString(new Date())

export function useWeekState() {
  const [activeWeek, setActiveWeek] = useLocalStorageUtility("active-week", currentIsoWeek)

  const setToNextWeek = useCallback(() => {
    const weekDates = getISOWeekDates(activeWeek)
    const firstDate = parse(weekDates[0], "yyyy-MM-dd", new Date())
    const nextWeekDate = add(firstDate, { weeks: 1 })
    const nextIsoWeek = getISOWeekString(nextWeekDate)
    setActiveWeek(nextIsoWeek)
  }, [activeWeek, setActiveWeek])

  const setToPrevWeek = useCallback(() => {
    const weekDates = getISOWeekDates(activeWeek)
    const firstDate = parse(weekDates[0], "yyyy-MM-dd", new Date())
    const prevWeekDate = sub(firstDate, { weeks: 1 })
    const prevIsoWeek = getISOWeekString(prevWeekDate)
    setActiveWeek(prevIsoWeek)
  }, [activeWeek, setActiveWeek])

  const setToThisWeek = () => {
    setActiveWeek(currentIsoWeek)
  }

  return {
    activeWeek,
    isCurrentWeek: activeWeek === currentIsoWeek,
    setToNextWeek,
    setToPrevWeek,
    setToThisWeek,
  }
}
