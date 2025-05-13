"use client"

import { useParams } from "next/navigation"
import CalendarDayHeader from "./calendar-day-header"
import CalendarDayColumn from "./calendar-day-column"
import { getISOWeekDates } from "@/lib/utils-timeslot"

export default function Calendar() {
  const { iso_week: isoWeek } = useParams<{ iso_week: string }>()
  const weekDates = getISOWeekDates(isoWeek)

  return (
    <div className="flex flex-col gap-4 overflow-auto p-16 pt-0">
      <div className="sticky top-0 z-20">
        <CalendarDayHeader />
      </div>
      <div className="flex items-stretch gap-4 border-2 border-transparent">
        {weekDates.map((dateString) => {
          return <CalendarDayColumn key={dateString} dateString={dateString} />
        })}
      </div>
    </div>
  )
}
