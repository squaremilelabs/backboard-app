"use client"

import { twMerge } from "tailwind-merge"
import { useMemo } from "react"
import { format } from "date-fns"
import WeekGridDay from "./week-grid-day"
import { presetTimeslots, getTimeslotStatus } from "@/lib/utils-timeslot"
import { useScheduleParams, getWeekdaysFromDate } from "@/lib/schedule"
import { formatDate, formatTimeString } from "@/lib/utils-common"

export default function WeekGrid() {
  const { weekStartDate } = useScheduleParams()
  const weekdays = useMemo(() => getWeekdaysFromDate(weekStartDate), [weekStartDate])

  return (
    <div
      className={twMerge(
        "h-full w-full p-4",
        "grid grid-rows-[auto_1fr] gap-4 overflow-auto",
        "rounded-xl border-2 bg-neutral-100"
      )}
    >
      {/* Header (Days) */}
      <div className="sticky top-0 z-30 grid grid-cols-[40px_1fr] gap-4">
        <div />
        {/* Weekdays */}
        <div className="grid min-w-lg grid-cols-7 gap-4">
          {weekdays.map((date) => {
            const timeslotStatus = getTimeslotStatus({
              date: format(date, "yyyy-MM-dd"),
              startTime: "00:00",
              endTime: "23:59",
            })
            return (
              <div
                key={date.toLocaleDateString()}
                className={twMerge(
                  "flex items-center justify-center gap-8",
                  "rounded-lg border-2 p-4",
                  "backdrop-blur-lg",
                  timeslotStatus === "past" ? "bg-neutral-200/50" : "bg-canvas/50"
                )}
              >
                <span className={twMerge("font-medium", "text-neutral-700")}>
                  {date.toLocaleDateString("en-US", { weekday: "long" })}
                </span>
                <span
                  className={twMerge(
                    "text-sm font-medium text-neutral-500",
                    timeslotStatus === "current" ? "text-gold-500" : ""
                  )}
                >
                  {formatDate(date)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      {/* Body (Timeslots) */}
      <div className="grid max-h-full min-h-[600px] grid-cols-[40px_1fr] gap-4">
        {/* Timeslot Left Header */}
        <div
          className="sticky left-0 z-20 grid gap-4 rounded-lg border bg-neutral-100/50 backdrop-blur-lg"
          style={{ gridTemplateRows: `repeat(${presetTimeslots.length}, 1fr)` }}
        >
          {presetTimeslots.map((ts) => (
            <div key={ts.startTime} className={twMerge("flex flex-col")}>
              <span
                className={twMerge(
                  "flex items-center justify-center",
                  "rounded-lg p-2 text-sm font-medium text-neutral-700",
                  ""
                )}
              >
                {formatTimeString(ts.startTime)}
              </span>
              <div className="grow" />
              <span
                className={twMerge(
                  "flex items-center justify-center",
                  "rounded-lg p-2 text-sm font-medium text-neutral-700",
                  ""
                )}
              >
                {formatTimeString(ts.midTime)}
              </span>
              <div className="grow" />
            </div>
          ))}
        </div>
        {/* Timeslots */}
        <div className="grid min-w-lg grid-cols-7 gap-4 overflow-auto">
          {weekdays.map((date) => {
            return <WeekGridDay key={date.toLocaleDateString()} date={date} />
          })}
        </div>
      </div>
    </div>
  )
}
