"use client"
import { Task } from "@prisma/client"
import { Timeslot } from "@zenstackhq/runtime/models"
import { format, parse } from "date-fns"
import { useRef } from "react"
import { isTextDropItem, useDrop } from "react-aria"
import { twMerge } from "tailwind-merge"
import { Link } from "react-aria-components"
import { useParams } from "next/navigation"
import { TaskSizeSummaryChips } from "../primitives/task/task-size"
import { useFindManyTimeslot, useUpdateManyTask } from "@/database/generated/hooks"
import { formatDate } from "@/lib/utils-common"
import {
  getISOWeekDates,
  getISOWeekString,
  getTimeblock,
  getTimeslotStatus,
} from "@/lib/utils-timeslot"
import { iconBox, interactive } from "@/styles/class-names"

type TimeslotWithTasks = Timeslot & { tasks: Task[] }

const todayDateString = format(new Date(), "yyyy-MM-dd")

export default function TimeslotDropTargets({
  tasklistId,
  activeTimeslotId,
}: {
  tasklistId: string
  activeTimeslotId?: string
}) {
  const { iso_week: isoWeek } = useParams<{ iso_week?: string }>()
  const weekDates = isoWeek ? getISOWeekDates(isoWeek) : []

  const timeslotsQuery = useFindManyTimeslot({
    where: {
      tasklist_id: tasklistId,
      date: activeTimeslotId ? { in: weekDates } : { gte: todayDateString },
      id: { not: activeTimeslotId },
    },
    include: { tasks: true },
    orderBy: [{ date: "asc" }, { start_time: "asc" }],
  })
  const timeslotsByDate: Record<string, TimeslotWithTasks[]> =
    timeslotsQuery.data?.reduce(
      (result, timeslot) => {
        if (!result[timeslot.date]) {
          result[timeslot.date] = []
        }
        result[timeslot.date].push(timeslot)
        return result
      },
      {} as Record<string, TimeslotWithTasks[]>
    ) ?? {}

  return (
    <div className="flex flex-col gap-8">
      {timeslotsQuery.isLoading ? (
        <div className="p-8 text-neutral-500">Loading timeslots...</div>
      ) : !timeslotsQuery.data?.length ? (
        <div className="rounded-lg border p-16 text-neutral-500">
          {activeTimeslotId ? "No other timeslots this week" : "No upcoming timeslots"}
        </div>
      ) : (
        Object.entries(timeslotsByDate).map(([date, timeslots]) => {
          return (
            <div key={date} className="flex flex-col gap-4">
              <p className="text-sm font-medium text-neutral-500">
                {formatDate(parse(date, "yyyy-MM-dd", new Date()), { withWeekday: true })}
              </p>
              {timeslots.map((timeslot) => {
                return (
                  <TimeslotDropTarget
                    key={timeslot.id}
                    tasklistId={tasklistId}
                    timeslot={timeslot}
                  />
                )
              })}
            </div>
          )
        })
      )}
    </div>
  )
}

function TimeslotDropTarget({
  tasklistId,
  timeslot,
}: {
  tasklistId: string
  timeslot: TimeslotWithTasks
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { dropProps, isDropTarget } = useDrop({
    ref,
    getDropOperation: (draggedItemTypes) => {
      return draggedItemTypes.has("task") ? "move" : "cancel"
    },
    onDrop: async (e) => {
      const tasks = await Promise.all<Task>(
        e.items.filter(isTextDropItem).map(async (task) => {
          return JSON.parse(await task.getText("task"))
        })
      )
      handleTasksDrop(tasks)
    },
  })

  const updateTasksMutation = useUpdateManyTask()
  const handleTasksDrop = (tasks: Task[]) => {
    // handle draft tasks (move to todo)
    const draftTasks = tasks.filter((task) => task.status === "DRAFT")
    if (draftTasks.length > 0) {
      updateTasksMutation.mutate({
        where: { id: { in: draftTasks.map((task) => task.id) } },
        data: {
          status: "TODO",
          tasklist_id: tasklistId,
          timeslot_id: timeslot.id,
          timeslot_tasklist_id: tasklistId,
        },
      })
    }
    const nonDraftTasks = tasks.filter((task) => task.status !== "DRAFT")
    if (nonDraftTasks.length > 0) {
      updateTasksMutation.mutate({
        where: { id: { in: nonDraftTasks.map((task) => task.id) } },
        data: {
          tasklist_id: tasklistId,
          timeslot_id: timeslot.id,
          timeslot_tasklist_id: tasklistId,
        },
      })
    }
  }

  const timeblock = getTimeblock({
    startTime: timeslot.start_time,
    endTime: timeslot.end_time,
  })

  const isoWeek = getISOWeekString(parse(timeslot.date, "yyyy-MM-dd", new Date()))
  const weekStatus = getTimeslotStatus({
    date: timeslot.date,
    startTime: timeslot.start_time,
    endTime: timeslot.end_time,
  })

  return (
    <div ref={ref} {...dropProps}>
      <Link
        href={`/calendar/${isoWeek}/timeslot/${tasklistId}-${timeslot.id}`}
        className={twMerge(
          interactive({ hover: "fade" }),
          "flex items-center gap-4 px-4 py-6",
          "rounded-lg border-2 bg-neutral-100",
          isDropTarget ? "outline" : ""
        )}
      >
        <div className={iconBox({ size: "small" })}>
          <timeblock.Icon />
        </div>
        <p className="font-medium">{timeblock.label}</p>
        {timeblock.subLabel ? (
          <p className="text-sm text-neutral-500">({timeblock.subLabel})</p>
        ) : null}
        <div className="grow" />
        <TaskSizeSummaryChips
          tasks={timeslot.tasks}
          useOverdueColor={weekStatus === "past"}
          consistentWeightVariant="medium"
          showEmptyChip
        />
      </Link>
    </div>
  )
}
