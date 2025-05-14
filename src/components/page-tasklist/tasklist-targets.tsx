"use client"

import { Task } from "@zenstackhq/runtime/models"
import { CalendarIcon, LayersIcon } from "lucide-react"
import { useRef } from "react"
import { isTextDropItem, useDrop } from "react-aria"
import { GridList, GridListItem, Link, useDragAndDrop } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { TaskSizeSummaryChips } from "../primitives/task-size"
import { iconBox, interactive } from "@/styles/class-names"
import { useFindManyTask, useFindManyTimeslot, useUpdateManyTask } from "@/database/generated/hooks"
import useRouterUtility from "@/lib/router-utility"
import useWeekState from "@/lib/week-state"
import { getISOWeekDates, getTemporalStatusFromTimeslot, getTimeblock } from "@/lib/utils-temporal"
import { formatDate } from "@/lib/utils-common"

export function TasklistTargets({ tasklistId }: { tasklistId: string | undefined }) {
  return (
    <div className="flex flex-col gap-4">
      <Backlog tasklistId={tasklistId} />
      <TimeslotsGridList tasklistId={tasklistId} />
    </div>
  )
}

function Backlog({ tasklistId }: { tasklistId: string | undefined }) {
  const router = useRouterUtility()
  const isActive = !router.query.timeslot

  const backlogTasksQuery = useFindManyTask({
    where: { tasklist_id: tasklistId, timeslot_id: null },
  })

  const ref = useRef<HTMLDivElement>(null)

  const { dropProps, isDropTarget } = useDrop({
    ref,
    isDisabled: isActive,
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
    // handle done tasks
    const doneTasks = tasks.filter((task) => task.status === "DONE")
    if (doneTasks.length > 0) {
      updateTasksMutation.mutate({
        where: { id: { in: doneTasks.map((task) => task.id) } },
        data: { status: "TODO", tasklist_id: tasklistId, timeslot_id: null },
      })
    }
    // handle undone tasks
    const undoneTasks = tasks.filter((task) => task.status !== "DONE")
    if (undoneTasks.length > 0) {
      updateTasksMutation.mutate({
        where: { id: { in: undoneTasks.map((task) => task.id) } },
        data: { tasklist_id: tasklistId, timeslot_id: null },
      })
    }
  }

  return (
    <div ref={ref} {...dropProps}>
      <Link
        href={`/tasklist/${tasklistId}`}
        className={twMerge(
          interactive({ hover: "fade" }),
          "flex items-center gap-4 px-4 py-6",
          "rounded-lg border bg-neutral-100",
          isDropTarget ? "outline" : "",
          isActive ? "bg-canvas border-2" : ""
        )}
      >
        <div className={iconBox({ size: "small" })}>
          <LayersIcon />
        </div>
        <p className="font-medium">Backlog</p>
        <div className="grow" />
        <TaskSizeSummaryChips tasks={backlogTasksQuery.data ?? []} showEmptyChip />
      </Link>
    </div>
  )
}

function TimeslotsGridList({ tasklistId }: { tasklistId: string | undefined }) {
  const router = useRouterUtility()
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

  const { dragAndDropHooks } = useDragAndDrop({
    acceptedDragTypes: ["task"],
    onItemDrop: async (e) => {
      const tasks = await Promise.all<Task>(
        e.items.filter(isTextDropItem).map(async (task) => {
          return JSON.parse(await task.getText("task"))
        })
      )
      handleTasksDrop(e.target.key as string, tasks)
    },
  })

  const updateTasksMutation = useUpdateManyTask()
  const handleTasksDrop = (timeslotId: string, tasks: Task[]) => {
    // handle draft tasks (move to todo)
    const draftTasks = tasks.filter((task) => task.status === "DRAFT")
    if (draftTasks.length > 0) {
      updateTasksMutation.mutate({
        where: { id: { in: draftTasks.map((task) => task.id) } },
        data: {
          status: "TODO",
          tasklist_id: tasklistId,
          timeslot_id: timeslotId,
          timeslot_tasklist_id: tasklistId,
        },
      })
    }
    // handle non-draft tasks (maintain status)
    const nonDraftTasks = tasks.filter((task) => task.status !== "DRAFT")
    if (nonDraftTasks.length > 0) {
      updateTasksMutation.mutate({
        where: { id: { in: nonDraftTasks.map((task) => task.id) } },
        data: {
          tasklist_id: tasklistId,
          timeslot_id: timeslotId,
          timeslot_tasklist_id: tasklistId,
        },
      })
    }
  }

  return (
    <GridList
      aria-label={`$${activeWeek} Timeslots`}
      items={timeslotsQuery.data ?? []}
      className="flex flex-col gap-4"
      dragAndDropHooks={dragAndDropHooks}
      dependencies={[router.query.timeslot]}
      renderEmptyState={() =>
        timeslotsQuery.isLoading ? (
          <div className="p-8 text-neutral-500">Loading...</div>
        ) : (
          <div className="rounded-lg border p-16 text-neutral-500">
            No time committed in {activeWeek}
          </div>
        )
      }
    >
      {(timeslot) => {
        const isActive = router.query.timeslot === timeslot.id
        const timeblock = getTimeblock({
          startTime: timeslot.start_time,
          endTime: timeslot.end_time,
        })
        const temporalStatus = getTemporalStatusFromTimeslot(timeslot)
        return (
          <GridListItem
            id={timeslot.id}
            textValue={timeslot.date + "at" + timeslot.start_time}
            href={`/tasklist/${tasklistId}?timeslot=${timeslot.id}`}
            className={({ isDropTarget }) =>
              twMerge(
                interactive({ hover: "fade" }),
                "flex items-center gap-4 px-4 py-6",
                "rounded-lg border bg-neutral-100",
                isDropTarget ? "outline" : "",
                isActive ? "bg-canvas border-2" : ""
              )
            }
          >
            <div className={iconBox({ size: "small" })}>
              <CalendarIcon />
            </div>
            <p className="font-medium">{formatDate(timeslot.date, { withWeekday: true })}</p>
            {timeblock.subLabel ? (
              <p className="text-sm text-neutral-500">{timeblock.label}</p>
            ) : null}
            <div className="grow" />
            <TaskSizeSummaryChips
              tasks={timeslot.tasks}
              useOverdueColor={temporalStatus === "past"}
              consistentWeightVariant="medium"
              showEmptyChip
            />
          </GridListItem>
        )
      }}
    </GridList>
  )
}
