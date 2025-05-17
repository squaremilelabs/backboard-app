import { add, sub, parse, startOfToday, nextMonday, format, previousMonday } from "date-fns"
import { useCallback, useMemo } from "react"
import { useLocalStorageUtility } from "./storage-utility"
import { getISOWeekDates, getISOWeekString } from "./utils-temporal"
import { formatDate } from "./utils-common"

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
  const isPastWeek = activeWeek.localeCompare(currentIsoWeek) < 0
  const isUpcomingWeek = activeWeek.localeCompare(currentIsoWeek) > 0

  const activeWeekDates = getISOWeekDates(activeWeek)
  const activeWeekDisplayedDates = activeWeekDates.filter((date) => {
    if (!hidePastDaysEnabled) return true
    if (!isCurrentWeek) return true
    return parse(date, "yyyy-MM-dd", new Date()) >= startOfToday()
  })

  const activeWeekLabel = useMemo(() => {
    if (activeWeek === currentIsoWeek) return "This week"
    const firstDateOfWeek = activeWeekDates[0]
    if (firstDateOfWeek === format(nextMonday(new Date()), "yyyy-MM-dd")) return "Next week"
    if (firstDateOfWeek === format(previousMonday(sub(new Date(), { days: 6 })), "yyyy-MM-dd"))
      return "Last week"
    return `Week of ${formatDate(firstDateOfWeek)}`
  }, [activeWeek, activeWeekDates])

  return {
    activeWeek,
    activeWeekLabel,
    isCurrentWeek,
    isPastWeek,
    isUpcomingWeek,
    activeWeekDates,
    activeWeekDisplayedDates,
    hidePastDaysEnabled,
    toggleHidePastDaysEnabled,
    setToNextWeek,
    setToPrevWeek,
    setToThisWeek,
  }
}
