"use client"
import { useSearchParams } from "next/navigation"
import { add, format, parse, sub } from "date-fns"
import { useCallback, useMemo } from "react"
import { getMondayFromDate } from "@/lib/utils"

export const dayHeaderHeight = 40
export const timeslotHeight = 100

export type PresetTimeslot = {
  startTime: string
  endTime: string
  midTime: string
}

export const presetTimeslots: PresetTimeslot[] = [
  { startTime: "09:00", midTime: "10:00", endTime: "11:00" },
  { startTime: "11:00", midTime: "12:00", endTime: "13:00" },
  { startTime: "13:00", midTime: "14:00", endTime: "15:00" },
  { startTime: "15:00", midTime: "16:00", endTime: "17:00" },
  { startTime: "17:00", midTime: "18:00", endTime: "19:00" },
]

export function useScheduleParams() {
  const searchParams = useSearchParams()
  const dateParam = searchParams.get("date")
  const timeslotParam = searchParams.get("timeslot")

  const weekStartDate = useMemo(
    () =>
      dateParam
        ? getMondayFromDate(parse(dateParam, "yyyy-MM-dd", new Date()))
        : getMondayFromDate(new Date()),
    [dateParam]
  )

  const currentTimeslotParam = timeslotParam ? `&timeslot=${timeslotParam}` : ""
  const currentDateParam = dateParam ? `&date=${dateParam}` : ""

  const nextWeekStartDate = useMemo(() => add(weekStartDate, { days: 7 }), [weekStartDate])
  const prevWeekStartDate = useMemo(() => sub(weekStartDate, { days: 7 }), [weekStartDate])

  const nextWeekParam = `date=${format(nextWeekStartDate, "yyyy-MM-dd")}`
  const prevWeekParam = `date=${format(prevWeekStartDate, "yyyy-MM-dd")}`

  const nextWeekHref = useMemo(
    () => `/schedule?${nextWeekParam}` + currentTimeslotParam,
    [nextWeekParam, currentTimeslotParam]
  )
  const currentWeekHref = useMemo(
    () => `/schedule` + (timeslotParam ? `?timeslot=${timeslotParam}` : ""),
    [timeslotParam]
  )
  const prevWeekHref = useMemo(
    () => `/schedule?${prevWeekParam}` + currentTimeslotParam,
    [prevWeekParam, currentTimeslotParam]
  )

  const getTimeslotHref = useCallback(
    (timeslotId: string) => `/schedule?timeslot=${timeslotId}` + currentDateParam,
    [currentDateParam]
  )

  const closeTimeslotHref = useMemo(
    () => `/schedule` + (dateParam ? `?date=${dateParam}` : ""),
    [dateParam]
  )

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
