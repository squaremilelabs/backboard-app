"use client"

import { CalendarHeader } from "./calendar-header"
import { CalendarColumn } from "./calendar-column"
import { useWeekState } from "@/lib/week-state"

export function CalendarPage() {
  const { activeWeekDisplayedDates } = useWeekState()

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-16 pt-0">
      <div className="sticky top-0 z-20">
        <CalendarHeader />
      </div>
      <div
        className="grid min-w-fit grow grid-rows-1 gap-4 border-2 border-transparent"
        style={{
          gridTemplateColumns: `repeat(${activeWeekDisplayedDates.length}, minmax(var(--container-xs), 1fr))`,
        }}
      >
        {activeWeekDisplayedDates.map((dateString) => {
          return <CalendarColumn key={dateString} dateString={dateString} />
        })}
      </div>
    </div>
  )
}
