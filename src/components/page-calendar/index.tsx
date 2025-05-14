"use client"

import { CalendarHeader } from "./calendar-header"
import { CalendarColumn } from "./calendar-column"
import { getISOWeekDates } from "@/lib/utils-temporal"
import useWeekState from "@/lib/week-state"

export function CalendarPage() {
  const { activeWeek } = useWeekState()
  const weekDates = getISOWeekDates(activeWeek)

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-16 pt-0">
      <div className="sticky top-0 z-20">
        <CalendarHeader />
      </div>
      <div className="grid grow grid-cols-7 grid-rows-1 gap-4 border-2 border-transparent">
        {weekDates.map((dateString) => {
          return <CalendarColumn key={dateString} dateString={dateString} />
        })}
      </div>
    </div>
  )
}
