"use client"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns"
import { getISOWeekDates } from "@/lib/utils-temporal"
import { formatDate } from "@/lib/utils-common"
import { useWeekState } from "@/lib/week-state"

export function CalendarHeader() {
  const { activeWeek } = useWeekState()
  const weekDates = getISOWeekDates(activeWeek)

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
