"use client"
import { ClassNameValue, twMerge } from "tailwind-merge"
import { ChevronLeftIcon, ChevronRightIcon, RedoIcon, UndoIcon } from "lucide-react"
import { Button } from "react-aria-components"
import { iconBox, interactive } from "@/styles/class-names"
import { useWeekState } from "@/lib/week-state"

export function WeekNavigator({ className }: { className?: ClassNameValue }) {
  const {
    activeWeek,
    activeWeekLabel,
    isCurrentWeek,
    isPastWeek,
    isUpcomingWeek,
    setToNextWeek,
    setToPrevWeek,
    setToThisWeek,
  } = useWeekState()

  return (
    <div className={twMerge("bg-canvas flex items-center gap-4 rounded-lg border p-4", className)}>
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
      <p className="min-w-fit font-medium">{activeWeek}</p>
      <div className="flex min-w-fit items-center px-4">
        {isUpcomingWeek && (
          <Button
            onPress={setToThisWeek}
            className={twMerge(
              interactive({ hover: "background" }),
              iconBox({ size: "base" }),
              "text-gold-500"
            )}
          >
            <UndoIcon />
          </Button>
        )}
        <span
          className={twMerge(
            "min-w-fit text-sm text-neutral-500",
            isCurrentWeek ? "text-gold-500 font-semibold" : ""
          )}
        >
          {activeWeekLabel}
        </span>
        {isPastWeek && (
          <Button
            onPress={setToThisWeek}
            className={twMerge(
              interactive({ hover: "background" }),
              iconBox({ size: "base" }),
              "text-gold-500"
            )}
          >
            <RedoIcon />
          </Button>
        )}
      </div>
    </div>
  )
}
