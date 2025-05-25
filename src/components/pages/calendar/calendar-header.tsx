"use client"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns"
import { Button } from "react-aria-components"
import { ArrowLeftToLineIcon, ArrowRightFromLineIcon } from "lucide-react"
import { formatDate } from "@/lib/utils-common"
import { useWeekState } from "@/lib/week-state"
import { iconBox, interactive } from "@/styles/class-names"
import { useTimeslotsQuery } from "@/lib/query-timeslots"
import { TaskSizeSummaryText } from "@/components/portables/task-size"
import { getTemporalStatus } from "@/lib/utils-temporal"

export function CalendarHeader() {
  const { activeWeekDisplayedDates, hidePastDaysEnabled, toggleHidePastDaysEnabled } =
    useWeekState()

  const { getDateTimeslots } = useTimeslotsQuery()

  return (
    <>
      {activeWeekDisplayedDates.map((dateString) => {
        const date = parse(dateString, "yyyy-MM-dd", new Date())
        const isToday = dateString === format(new Date(), "yyyy-MM-dd")
        const isMonday = date.getDay() === 1
        const temporalStatus = getTemporalStatus({
          date: dateString,
          startTime: "00:00",
          endTime: "23:59",
        })

        const tasks = getDateTimeslots(dateString)?.flatMap((timeslot) => timeslot.tasks)

        return (
          <div
            key={dateString}
            className={twMerge(
              "group/calendar-header",
              "flex items-center gap-4 rounded-lg px-16 py-4",
              "text-neutral-600",
              isToday ? "bg-canvas text-neutral-950" : ""
            )}
          >
            {isToday && !isMonday && hidePastDaysEnabled ? (
              <Button
                onPress={toggleHidePastDaysEnabled}
                className={twMerge([
                  iconBox(),
                  interactive({ hover: "background" }),
                  "text-neutral-500",
                  "mr-8",
                ])}
              >
                <ArrowLeftToLineIcon />
              </Button>
            ) : null}
            <p className="font-semibold">{formatDate(date, { withWeekday: true })}</p>
            <div className="grow" />
            <div className="opacity-0 transition-opacity group-hover/calendar-header:opacity-100">
              <TaskSizeSummaryText
                tasks={tasks ?? []}
                useOverdueColor={temporalStatus === "past"}
              />
            </div>
            {isToday && !isMonday && !hidePastDaysEnabled ? (
              <Button
                onPress={toggleHidePastDaysEnabled}
                className={twMerge([
                  iconBox(),
                  interactive({ hover: "background" }),
                  "text-neutral-500",
                ])}
              >
                <ArrowRightFromLineIcon />
              </Button>
            ) : null}
          </div>
        )
      })}
    </>
  )
}
