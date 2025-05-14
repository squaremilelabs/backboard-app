"use client"
import { Task } from "@prisma/client"
import { Timeslot } from "@zenstackhq/runtime/models"
import { parse } from "date-fns"
import { useRef } from "react"
import { isTextDropItem, useDrop } from "react-aria"
import { twMerge } from "tailwind-merge"
import { Link } from "react-aria-components"
import { CalendarIcon } from "lucide-react"
import { TaskSizeSummaryChips } from "../primitives/task/task-size"
import { useFindManyTimeslot, useUpdateManyTask } from "@/database/generated/hooks"
import { formatDate } from "@/lib/utils-common"
import { getISOWeekDates, getTimeblock, getTimeslotStatus } from "@/lib/utils-timeslot"
import { iconBox, interactive } from "@/styles/class-names"
import useWeekState from "@/lib/week-state"
import useRouterUtility from "@/lib/router-utility"

type TimeslotWithTasks = Timeslot & { tasks: Task[] }

export default function TimeslotDropTargets({ tasklistId }: { tasklistId: string }) {
  const { activeWeek } = useWeekState()
  const weekDates = getISOWeekDates(activeWeek)

  const timeslotsQuery = useFindManyTimeslot({
    where: {
      tasklist_id: tasklistId,
      date: { in: weekDates },
    },
    include: { tasks: true },
    orderBy: [{ date: "asc" }, { start_time: "asc" }],
  })
  return (
    <div className="flex flex-col gap-8">
      {timeslotsQuery.isLoading ? (
        <div className="p-8 text-neutral-500">Loading timeslots...</div>
      ) : !timeslotsQuery.data?.length ? (
        <div className="rounded-lg border p-16 text-neutral-500">{"No timeslots this week"}</div>
      ) : (
        timeslotsQuery.data.map((timeslot) => {
          return (
            <TimeslotDropTarget key={timeslot.id} tasklistId={tasklistId} timeslot={timeslot} />
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

  const weekStatus = getTimeslotStatus({
    date: timeslot.date,
    startTime: timeslot.start_time,
    endTime: timeslot.end_time,
  })

  const router = useRouterUtility<{ timeslot: string | null }>()
  const isActive = router.query.timeslot === timeslot.id

  return (
    <div ref={ref} {...dropProps}>
      <Link
        href={`/tasklist/${tasklistId}?timeslot=${timeslot.id}`}
        className={twMerge(
          interactive({ hover: "fade" }),
          "flex items-center gap-4 px-4 py-6",
          "rounded-lg border bg-neutral-100",
          isDropTarget ? "outline" : "",
          isActive ? "bg-canvas border-2" : ""
        )}
      >
        <div className={iconBox({ size: "small" })}>
          <CalendarIcon />
        </div>
        <p className="font-medium">
          {formatDate(parse(timeslot.date, "yyyy-MM-dd", new Date()), { withWeekday: true })}
        </p>
        {timeblock.subLabel ? (
          <p className="text-sm text-neutral-500">({timeblock.label})</p>
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
