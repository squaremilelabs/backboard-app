"use client"

import { twMerge } from "tailwind-merge"
import { CalendarHeader } from "./calendar-header"
import { CalendarColumn } from "./calendar-column"
import { useWeekState } from "@/lib/week-state"
import { presetTimeblocks } from "@/lib/utils-temporal"

export function CalendarPage() {
  const { activeWeekDisplayedDates } = useWeekState()

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-auto p-16 pt-0">
      <div
        className={twMerge(
          "sticky top-0 z-20 min-w-fit",
          "grid grid-rows-1 gap-4",
          "rounded-lg border-2 border-neutral-300 bg-neutral-300/50 backdrop-blur-lg"
        )}
        style={{
          gridTemplateColumns: `repeat(${activeWeekDisplayedDates.length}, minmax(var(--container-xs), 1fr))`,
        }}
      >
        <CalendarHeader />
      </div>
      <div
        className={twMerge("grid grow grid-rows-1 gap-4", "border-2 border-transparent")}
        style={{
          gridTemplateColumns: `repeat(${activeWeekDisplayedDates.length}, minmax(var(--container-xs), 1fr))`,
        }}
      >
        {activeWeekDisplayedDates.map((dateString) => {
          return (
            <div
              key={dateString}
              className="grid w-full gap-4"
              style={{
                gridTemplateRows: `repeat(${presetTimeblocks.length}, minimax(0,1fr))`,
              }}
            >
              <CalendarColumn key={dateString} dateString={dateString} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
