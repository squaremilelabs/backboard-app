"use client"

import { twMerge } from "tailwind-merge"
import { Link } from "react-aria-components"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useMemo } from "react"
import { format } from "date-fns"
import { presetTimeslots, useScheduleParams } from "../utilities"
import WeekGridDayColumn from "./week-grid-day-column"
import { formatDate, formatTimeString, getTimeslotStatus, getWeekdaysFromDate } from "@/lib/utils"

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
      <div className="sticky top-0 z-30 grid grid-cols-[70px_1fr] gap-4">
        {/* Navigator */}
        <Navigator />
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
                <span className="font-medium text-neutral-700">
                  {date.toLocaleDateString("en-US", { weekday: "long" })}
                </span>
                <span className="text-sm font-medium text-neutral-500">{formatDate(date)}</span>
              </div>
            )
          })}
        </div>
      </div>
      {/* Body (Timeslots) */}
      <div className="grid max-h-full min-h-[600px] grid-cols-[70px_1fr] gap-4">
        {/* Timeslot Left Header */}
        <div
          className="sticky left-0 z-20 grid gap-4"
          style={{ gridTemplateRows: `repeat(${presetTimeslots.length}, 1fr)` }}
        >
          {presetTimeslots.map((ts) => (
            <div
              key={ts.startTime}
              className={twMerge(
                "flex p-8",
                "border-2",
                "bg-neutral-100/50 backdrop-blur-lg",
                "rounded-lg font-medium text-neutral-700"
              )}
            >
              {formatTimeString(ts.startTime)}
            </div>
          ))}
        </div>
        {/* Timeslots */}
        <div className="grid min-w-lg grid-cols-7 gap-4 overflow-auto">
          {weekdays.map((date) => {
            return <WeekGridDayColumn key={date.toLocaleDateString()} date={date} />
          })}
        </div>
      </div>
    </div>
  )
}

function Navigator() {
  const { currentWeekHref, nextWeekHref, prevWeekHref } = useScheduleParams()

  return (
    <div
      className={twMerge(
        "flex items-stretch justify-between",
        "bg-canvas/50 rounded-lg border-2 backdrop-blur-lg"
      )}
    >
      <Link
        key={prevWeekHref}
        className="flex cursor-pointer items-center rounded-md text-neutral-600 hover:bg-neutral-200"
        href={prevWeekHref}
      >
        <ChevronLeftIcon size={16} />
      </Link>
      <Link
        href={currentWeekHref}
        className="flex cursor-pointer items-center rounded-md text-sm font-medium underline-offset-2 hover:underline"
      >
        Today
      </Link>
      <Link
        key={nextWeekHref}
        className="flex cursor-pointer items-center rounded-md text-neutral-600 hover:bg-neutral-200"
        href={nextWeekHref}
      >
        <ChevronRightIcon size={16} />
      </Link>
    </div>
  )
}
