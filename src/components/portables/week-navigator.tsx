"use client"
import { ClassNameValue, twMerge } from "tailwind-merge"
import { ChevronLeftIcon, ChevronRightIcon, RedoIcon, UndoIcon } from "lucide-react"
import { Button } from "react-aria-components"
import { Task } from "@zenstackhq/runtime/models"
import { TaskSizeSummaryText } from "./task-size"
import { iconBox, interactive } from "@/styles/class-names"
import { useWeekState } from "@/lib/week-state"

export function WeekNavigator({
  className,
  summaryTasks,
}: {
  className?: ClassNameValue
  summaryTasks?: Task[]
}) {
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
              "text-neutral-500"
            )}
          >
            <UndoIcon />
          </Button>
        )}
        <span
          className={twMerge(
            "min-w-fit text-sm text-neutral-500",
            isCurrentWeek ? "font-semibold text-neutral-600" : ""
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
              "text-neutral-500"
            )}
          >
            <RedoIcon />
          </Button>
        )}
      </div>
      {summaryTasks && summaryTasks.length > 0 && (
        <div className="flex min-w-fit items-center border-l px-6">
          <TaskSizeSummaryText tasks={summaryTasks} useOverdueColor={isPastWeek} />
        </div>
      )}
    </div>
  )
}
