"use client"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns"
import { formatDate } from "@/lib/utils-common"
import { useWeekState } from "@/lib/week-state"

export function CalendarHeader() {
  const { activeWeekDisplayedDates } = useWeekState()

  return (
    <div
      className={twMerge(
        "grid min-w-fit items-stretch gap-4",
        "rounded-lg border-2 border-neutral-300 bg-neutral-300/50 backdrop-blur-lg"
      )}
      style={{
        gridTemplateColumns: `repeat(${activeWeekDisplayedDates.length}, minmax(var(--container-xs), 1fr))`,
      }}
    >
      {activeWeekDisplayedDates.map((dateString) => {
        const date = parse(dateString, "yyyy-MM-dd", new Date())
        const isToday = dateString === format(new Date(), "yyyy-MM-dd")
        return (
          <div
            key={dateString}
            className={twMerge(
              "min-w-xs",
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
