"use client"
import { twMerge } from "tailwind-merge"
import { Button, Dialog, DialogTrigger, Link, Popover } from "react-aria-components"
import { Loader, PlusIcon } from "lucide-react"
import { Timeslot } from "@prisma/client"
import { Task, Tasklist } from "@zenstackhq/runtime/models"
import { useRef } from "react"
import { isTextDropItem, useDrop } from "react-aria"
import { formatDate } from "@/lib/utils-common"
import {
  getTemporalStatus,
  presetTimeblocks,
  TemporalStatus,
  Timeblock,
} from "@/lib/utils-temporal"
import { useWeekState } from "@/lib/week-state"
import { iconBox, interactive, popover } from "@/styles/class-names"
import {
  useCreateTimeslot,
  useFindManyTimeslot,
  useUpdateManyTask,
} from "@/database/generated/hooks"
import { TaskSizeSummaryChips } from "@/components/portables/task-size"
import { useRouterUtility } from "@/lib/router-utility"
import { useTimeblockDrop } from "@/lib/timeblock-drop"

type ExpandedTimeslot = Timeslot & { tasklist: Tasklist; tasks: Task[] }

export default function TasklistCalendarGrid({ tasklistId }: { tasklistId: string | undefined }) {
  const { activeWeekDates } = useWeekState()

  const { data: timeslots } = useFindManyTimeslot({
    where: {
      tasklist_id: tasklistId,
      date: { in: activeWeekDates },
    },
    include: { tasks: true },
  })

  return (
    <div className="flex flex-col gap-4">
      <div
        className="grid grid-rows-1 gap-4"
        style={{
          gridTemplateColumns: `repeat(${activeWeekDates.length}, minmax(72px, 1fr))`,
        }}
      >
        {activeWeekDates.map((date) => {
          const temporalStatus = getTemporalStatus({
            date,
            startTime: "00:00",
            endTime: "23:59",
          })
          return (
            <div
              key={date}
              className={twMerge(
                "box-content flex items-center justify-center",
                "rounded-md border border-transparent px-4 py-1",
                "font-medium text-neutral-600",
                temporalStatus === "current"
                  ? "text-gold-500 bg-canvas border-neutral-200 font-semibold"
                  : "",
                temporalStatus === "past" ? "bg-neutral-300" : "",
                temporalStatus === "future" ? "bg-neutral-200" : ""
              )}
            >
              <p className="text-sm">
                {temporalStatus === "current" ? "Today" : formatDate(date, { onlyWeekday: true })}
              </p>
            </div>
          )
        })}
      </div>
      <div
        className="grid grid-flow-col gap-4"
        style={{
          gridTemplateColumns: `repeat(${activeWeekDates.length}, minmax(72px, 1fr))`,
          gridTemplateRows: `repeat(${presetTimeblocks.length}, auto)`,
        }}
      >
        {activeWeekDates.map((date) => {
          return presetTimeblocks.map((timeblock) => {
            const timeslot = timeslots?.find(
              (timeslot) => timeslot.date === date && timeslot.start_time === timeblock.startTime
            )
            return (
              <TimeblockCell
                key={`${date}-${timeblock.startTime}`}
                date={date}
                timeblock={timeblock}
                tasklistId={tasklistId}
                timeslot={timeslot}
              />
            )
          })
        })}
      </div>
    </div>
  )
}

function TimeblockCell({
  date,
  timeslot,
  timeblock,
  tasklistId,
}: {
  date: string
  timeblock: Timeblock
  timeslot?: Timeslot & { tasks: Task[] }
  tasklistId: string | undefined
}) {
  const router = useRouterUtility()
  const isBacklogActive = !router.query.timeslot
  const isActive = !!router.query.timeslot && router.query.timeslot === timeslot?.id
  const temporalStatus = getTemporalStatus({
    date,
    startTime: timeblock.startTime,
    endTime: timeblock.endTime,
  })

  const createTimeslotMutation = useCreateTimeslot()
  const handleCreateTimeslot = () => {
    createTimeslotMutation.mutate({
      data: {
        tasklist: { connect: { id: tasklistId } },
        date,
        start_time: timeblock.startTime,
        end_time: timeblock.endTime,
      },
    })
  }

  const updateManyTasksMutation = useUpdateManyTask()
  const handleTasksDrop = (tasks: Task[]) => {
    // handle draft tasks (move to todo)
    const draftTasks = tasks.filter((task) => task.status === "DRAFT")
    if (draftTasks.length > 0) {
      updateManyTasksMutation.mutate({
        where: { id: { in: draftTasks.map((task) => task.id) } },
        data: {
          status: "TODO",
          tasklist_id: tasklistId,
          timeslot_id: timeslot?.id,
          timeslot_tasklist_id: tasklistId,
        },
      })
    }
    // handle non-draft tasks (maintain status)
    const nonDraftTasks = tasks.filter((task) => task.status !== "DRAFT")
    if (nonDraftTasks.length > 0) {
      updateManyTasksMutation.mutate({
        where: { id: { in: nonDraftTasks.map((task) => task.id) } },
        data: {
          tasklist_id: tasklistId,
          timeslot_id: timeslot?.id,
          timeslot_tasklist_id: tasklistId,
        },
      })
    }
  }

  const { handleTimeslotDrop } = useTimeblockDrop({ date, timeblock, disableAutoDelete: true })

  const ref = useRef<HTMLDivElement>(null)
  const { dropProps, isDropTarget } = useDrop({
    ref,
    getDropOperation: (draggedItemTypes) => {
      if (draggedItemTypes.has("task")) {
        if (timeslot) return "move"
        return "cancel"
      }
      if (draggedItemTypes.has("timeslot")) return "move"
      return "cancel"
    },
    onDrop: async (e) => {
      // handle tasks drop
      const tasks = await Promise.all<Task>(
        e.items
          .filter(isTextDropItem)
          .filter((item) => item.types.has("task"))
          .map(async (task) => {
            return JSON.parse(await task.getText("task"))
          })
      )
      if (tasks.length > 0) {
        handleTasksDrop(tasks)
      }
      // handle timeslots drop
      const timeslots = await Promise.all<ExpandedTimeslot>(
        e.items
          .filter(isTextDropItem)
          .filter((item) => item.types.has("timeslot"))
          .map(async (timeslot) => {
            return JSON.parse(await timeslot.getText("timeslot"))
          })
      )
      if (timeslots.length > 0) {
        handleTimeslotDrop(timeslots[0])
      }
    },
  })

  return (
    <div
      ref={ref}
      {...dropProps}
      className={twMerge(
        "group/timeblock-cell grid",
        "rounded-md border border-neutral-200",
        "cursor-pointer hover:scale-105",
        isBacklogActive ? "opacity-100" : isActive ? "opacity-100" : "opacity-60",
        [
          "has-[button[data-pressed]]:rounded-full",
          "has-[button[data-pressed]]:outline-1",
          "has-[button[data-pressed]]:-outline-offset-1",
          "has-[button[data-pressed]]:outline-neutral-400",
          "has-[button[data-pressed]]:opacity-100",
        ],
        timeslot ? "" : "",
        temporalStatus === "past" ? "bg-neutral-200" : "bg-neutral-100",
        isActive ? "bg-canvas border-2 border-neutral-300" : "",
        isDropTarget ? "outline" : ""
      )}
    >
      {timeslot ? (
        <Link
          className="rounded-md"
          href={`/tasklist/${timeslot.tasklist_id}?timeslot=${timeslot.id}`}
        >
          <TimeblockCellInnerContent
            timeblock={timeblock}
            timeslot={timeslot}
            temporalStatus={temporalStatus}
            isPending={updateManyTasksMutation.isPending}
          />
        </Link>
      ) : (
        <DialogTrigger>
          <Button className="group/inner-button cursor-pointer rounded-md">
            <TimeblockCellInnerContent
              timeblock={timeblock}
              timeslot={timeslot}
              isPending={createTimeslotMutation.isPending}
              temporalStatus={temporalStatus}
            />
          </Button>
          <Popover offset={4} placement="bottom left">
            <Dialog
              className={popover({
                className: [
                  "border-1 border-neutral-400 !outline-0",
                  "flex items-center gap-4",
                  "rounded-full px-12 py-4",
                ],
              })}
            >
              <Button
                onPress={handleCreateTimeslot}
                className={twMerge(
                  interactive({ hover: "underline", className: "min-w-fit text-sm text-nowrap" })
                )}
              >
                Add to calendar
              </Button>
            </Dialog>
          </Popover>
        </DialogTrigger>
      )}
    </div>
  )
}

function TimeblockCellInnerContent({
  timeblock,
  timeslot,
  isPending,
  temporalStatus,
}: {
  timeblock: Timeblock
  timeslot?: Timeslot & { tasks: Task[] }
  isPending: boolean
  temporalStatus: TemporalStatus
}) {
  return (
    <div className="flex items-center justify-between overflow-hidden p-4">
      <div
        className={iconBox({
          size: "small",
          className: [
            timeslot
              ? "text-neutral-950"
              : [
                  "text-transparent",
                  "group-hover/timeblock-cell:text-neutral-950",
                  "group-data-pressed/inner-button:text-neutral-950",
                ],
          ],
        })}
      >
        {isPending ? <Loader className="text-gold-500 animate-spin" /> : <timeblock.Icon />}
      </div>
      {timeslot ? (
        <TaskSizeSummaryChips
          tasks={timeslot?.tasks ?? []}
          size="small"
          showEmptyChip
          useOverdueColor={temporalStatus === "past"}
        />
      ) : (
        <div
          className={twMerge(
            iconBox({
              size: "small",
              className: [
                "hidden",
                "group-hover/timeblock-cell:flex",
                "group-data-pressed/inner-button:flex",
                "text-neutral-400",
                "group-data-pressed/inner-button:text-neutral-950",
              ],
            })
          )}
        >
          <PlusIcon />
        </div>
      )}
    </div>
  )
}
