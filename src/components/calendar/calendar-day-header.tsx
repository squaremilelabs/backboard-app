"use client"

import { useParams } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns"
import { getISOWeekDates } from "@/lib/utils-timeslot"
import { formatDate } from "@/lib/utils-common"

export default function CalendarDayHeader() {
  const { iso_week: isoWeek } = useParams<{ iso_week: string }>()
  const weekDates = getISOWeekDates(isoWeek)

  return (
    <div
      className={twMerge(
        "flex items-stretch gap-4",
        "rounded-lg border-2 border-neutral-300 bg-neutral-300/50 backdrop-blur-lg"
      )}
    >
      {weekDates.map((dateString) => {
        const date = parse(dateString, "yyyy-MM-dd", new Date())
        const isToday = dateString === format(new Date(), "yyyy-MM-dd")
        return (
          <div
            key={dateString}
            className={twMerge(
              "w-xs",
              "flex items-center rounded-lg px-16 py-4",
              "text-neutral-600",
              isToday ? "bg-canvas text-neutral-950" : ""
            )}
          >
            <p className="font-semibold">{formatDate(date, { withWeekday: true })}</p>
          </div>
        )
      })}
    </div>
  )
}
