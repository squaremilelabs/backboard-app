"use client"
import { Task } from "@prisma/client"
import { Timeslot } from "@zenstackhq/runtime/models"
import { format, sub, parse } from "date-fns"
import { useRef } from "react"
import { isTextDropItem, useDrop } from "react-aria"
import { twMerge } from "tailwind-merge"
import { Link } from "react-aria-components"
import { TaskSizeSummaryChips } from "../primitives/task/task-size"
import { useFindManyTimeslot, useUpdateManyTask } from "@/database/generated/hooks"
import { formatDate } from "@/lib/utils-common"
import { getTimeblock } from "@/lib/utils-timeslot"
import { iconBox, interactive } from "@/styles/class-names"

type TimeslotWithTasks = Timeslot & { tasks: Task[] }

const todayDateString = format(sub(new Date(), { weeks: 1 }), "yyyy-MM-dd")

export default function TimeslotDropTargets({
  tasklistId,
  activeTimeslotId,
}: {
  tasklistId: string
  activeTimeslotId?: string
}) {
  const timeslotsQuery = useFindManyTimeslot({
    where: {
      tasklist_id: tasklistId,
      date_string: { gte: todayDateString },
      id: { not: activeTimeslotId },
    },
    include: { tasks: true },
    orderBy: [{ date_string: "asc" }, { start_time_string: "asc" }],
  })
  const timeslotsByDate: Record<string, TimeslotWithTasks[]> =
    timeslotsQuery.data?.reduce(
      (result, timeslot) => {
        if (!result[timeslot.date_string]) {
          result[timeslot.date_string] = []
        }
        result[timeslot.date_string].push(timeslot)
        return result
      },
      {} as Record<string, TimeslotWithTasks[]>
    ) ?? {}

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(timeslotsByDate).map(([date, timeslots]) => {
        return (
          <div key={date} className="flex flex-col gap-4">
            <p className="text-sm font-medium text-neutral-500">
              {formatDate(parse(date, "yyyy-MM-dd", new Date()), { withWeekday: true })}
            </p>
            {timeslots.map((timeslot) => {
              return (
                <TimeslotDropTarget key={timeslot.id} tasklistId={tasklistId} timeslot={timeslot} />
              )
            })}
          </div>
        )
      })}
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
    startTime: timeslot.start_time_string,
    endTime: timeslot.end_time_string,
  })

  return (
    <div ref={ref} {...dropProps}>
      <Link
        href={`/calendar/timeslot/${tasklistId}-${timeslot.id}`}
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
        <TaskSizeSummaryChips tasks={timeslot.tasks} />
      </Link>
    </div>
  )
}
