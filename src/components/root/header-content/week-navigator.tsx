"use client"
import { twMerge } from "tailwind-merge"
import { ArrowLeftCircle, ArrowRightCircle, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button, Link } from "react-aria-components"
import { parse } from "date-fns"
import { iconBox, interactive } from "@/styles/class-names"
import { getISOWeekDates } from "@/lib/utils-temporal"
import { useWeekState } from "@/lib/week-state"
import { formatDate } from "@/lib/utils-common"
import { useRouterUtility } from "@/lib/router-utility"

export function WeekNavigator() {
  const router = useRouterUtility()
  const { activeWeek, isCurrentWeek, setToNextWeek, setToPrevWeek, setToThisWeek } = useWeekState()
  const weekDates = getISOWeekDates(activeWeek)
  const firstDate = parse(weekDates[0], "yyyy-MM-dd", new Date())
  const isBeforeToday = firstDate < new Date()
  return (
    <div
      className={twMerge(
        "flex items-center rounded-lg border p-4",
        router.basePath === "calendar" ? "bg-canvas" : "bg-neutral-100"
      )}
    >
      <div className="flex items-center">
        <Button
          onPress={setToPrevWeek}
          className={twMerge(interactive({ hover: "background" }), iconBox({ size: "large" }))}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          onPress={setToNextWeek}
          className={twMerge(interactive({ hover: "background" }), iconBox({ size: "large" }))}
        >
          <ChevronRightIcon />
        </Button>
      </div>
      <Link
        href="/calendar"
        isDisabled={router.basePath === "calendar"}
        className={twMerge(
          interactive({ hover: "background" }),
          "flex grow items-center justify-center gap-8 rounded-md px-6 py-2"
        )}
      >
        <p className="font-medium">{activeWeek}</p>
        <span
          className={twMerge(
            "text-sm text-neutral-500",
            isCurrentWeek ? "text-gold-500 font-semibold" : ""
          )}
        >
          {isCurrentWeek ? "This week" : `Week of ${formatDate(firstDate)}`}
        </span>
      </Link>
      {!isCurrentWeek && (
        <Button
          onPress={setToThisWeek}
          className={twMerge(
            interactive({ hover: "background" }),
            iconBox({ size: "large" }),
            "text-gold-500"
          )}
        >
          {isBeforeToday ? <ArrowRightCircle /> : <ArrowLeftCircle />}
        </Button>
      )}
    </div>
  )
}
