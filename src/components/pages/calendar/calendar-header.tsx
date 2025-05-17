"use client"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns"
import { Button } from "react-aria-components"
import { ArrowLeftToLineIcon, ArrowRightFromLineIcon } from "lucide-react"
import { formatDate } from "@/lib/utils-common"
import { useWeekState } from "@/lib/week-state"
import { iconBox, interactive } from "@/styles/class-names"

export function CalendarHeader() {
  const { activeWeekDisplayedDates, hidePastDaysEnabled, toggleHidePastDaysEnabled } =
    useWeekState()

  return (
    <>
      {activeWeekDisplayedDates.map((dateString) => {
        const date = parse(dateString, "yyyy-MM-dd", new Date())
        const isToday = dateString === format(new Date(), "yyyy-MM-dd")
        const isMonday = date.getDay() === 1
        return (
          <div
            key={dateString}
            className={twMerge(
              "flex items-center rounded-lg px-16 py-4",
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
