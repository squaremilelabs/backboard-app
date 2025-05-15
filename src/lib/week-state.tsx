import { add, sub, parse, startOfToday } from "date-fns"
import { useCallback } from "react"
import { useLocalStorageUtility } from "./storage-utility"
import { getISOWeekDates, getISOWeekString, getTemporalStatus } from "./utils-temporal"

const currentIsoWeek = getISOWeekString(new Date())

export function useWeekState() {
  const [activeWeek, setActiveWeek] = useLocalStorageUtility("active-week", currentIsoWeek)
  const [hidePastDaysEnabled, setHidePastDaysEnabled] = useLocalStorageUtility(
    "hide-past-days-setting",
    false
  )

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

  const toggleHidePastDaysEnabled = () => {
    setHidePastDaysEnabled((prev) => !prev)
  }

  const isCurrentWeek = activeWeek === currentIsoWeek

  const activeWeekDates = getISOWeekDates(activeWeek)
  const activeWeekDisplayedDates = activeWeekDates.filter((date) => {
    if (!hidePastDaysEnabled) return true
    if (!isCurrentWeek) return true
    return parse(date, "yyyy-MM-dd", new Date()) >= startOfToday()
  })

  const activeWeekTemporalStatus = getTemporalStatus({
    date: activeWeekDates[6],
    startTime: "23:59",
    endTime: "23:59",
  })

  return {
    activeWeek,
    isCurrentWeek,
    activeWeekDates,
    activeWeekDisplayedDates,
    activeWeekTemporalStatus,
    hidePastDaysEnabled,
    toggleHidePastDaysEnabled,
    setToNextWeek,
    setToPrevWeek,
    setToThisWeek,
  }
}
