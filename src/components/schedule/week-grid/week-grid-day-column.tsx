import { Button, Link } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { useRef, useState } from "react"
import { PlusIcon, XIcon } from "lucide-react"
import { Task, Tasklist, Timeslot } from "@zenstackhq/runtime/models"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { PresetTimeslot, presetTimeslots, useScheduleParams } from "../utilities"
import TasklistPopover from "@/components/tasklist/tasklist-popover"
import {
  useCreateTimeslot,
  useDeleteTimeslot,
  useFindManyTimeslot,
} from "@/database/generated/hooks"
import { EmojiDynamic } from "@/components/common/emoji-dynamic"
import { defaultTasklistEmojiCode } from "@/components/tasklist/utilities"
import { getTaskSummary } from "@/components/task/utilities"
import { TaskSizeChip } from "@/components/task/task-size"
import { getTimeslotStatus } from "@/lib/utils"

export default function WeekGridDayColumn({ date }: { date: Date }) {
  const dateString = format(date, "yyyy-MM-dd")
  const timeslotsQuery = useFindManyTimeslot({
    where: { date_string: dateString, archived_at: null },
    include: {
      tasklist: {
        include: {
          tasks: {
            where: { status: { in: ["TODO"] } },
          },
        },
      },
      tasks: true,
    },
  })

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateRows: `repeat(${presetTimeslots.length}, 1fr)` }}
    >
      {presetTimeslots.map((presetTimeslot) => {
        const existingTimeslot = timeslotsQuery.data?.find(
          (ts) => presetTimeslot.startTime === ts.start_time_string
        )
        return (
          <div key={presetTimeslot.startTime} className={twMerge("grid")}>
            {existingTimeslot ? (
              <AssignedTimeslot timeslot={existingTimeslot} />
            ) : (
              <EmptyTimeslot date={date} presetTimeslot={presetTimeslot} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function EmptyTimeslot({ date, presetTimeslot }: { date: Date; presetTimeslot: PresetTimeslot }) {
  const dateString = format(date, "yyyy-MM-dd")
  const [tasklistPopoverOpen, setTasklistPopoverOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const createTimeslot = useCreateTimeslot()

  const handleCreateTimeslot = (tasklist: Tasklist) => {
    createTimeslot.mutate({
      data: {
        date_string: dateString,
        start_time_string: presetTimeslot.startTime,
        end_time_string: presetTimeslot.endTime,
        tasklist: {
          connect: { id: tasklist.id },
        },
      },
    })
  }

  const timeslotStatus = getTimeslotStatus({
    date: dateString,
    ...presetTimeslot,
  })

  return (
    <>
      <Button
        ref={buttonRef}
        onPress={() => setTasklistPopoverOpen(true)}
        className={twMerge(
          "group flex items-end justify-start",
          "!outline-0",
          "rounded-lg p-8",
          "cursor-pointer",
          "not-hover:focus-visible:bg-neutral-200",
          tasklistPopoverOpen ? "bg-canvas" : "",
          timeslotStatus === "past"
            ? [tasklistPopoverOpen ? "bg-neutral-300" : "hover:bg-neutral-300"]
            : ["border", tasklistPopoverOpen ? "bg-canvas" : "hover:bg-canvas"]
        )}
      >
        <span
          className={twMerge(
            "flex items-center justify-center gap-4 text-sm text-neutral-500",
            "invisible group-hover:visible",
            tasklistPopoverOpen ? "visible" : ""
          )}
        >
          Assign Tasklist
          <PlusIcon size={14} />
        </span>
      </Button>
      <TasklistPopover
        triggerRef={buttonRef}
        isOpen={tasklistPopoverOpen}
        onOpenChange={setTasklistPopoverOpen}
        selectedId={null}
        onSelectionChange={handleCreateTimeslot}
      />
    </>
  )
}

function AssignedTimeslot({
  timeslot,
}: {
  timeslot: Timeslot & { tasklist: Tasklist & { tasks: Task[] }; tasks: Task[] }
}) {
  const router = useRouter()
  const { timeslotId: activeTimeslotId, getTimeslotHref, closeTimeslotHref } = useScheduleParams()
  const tasklist = timeslot.tasklist
  const tasklistTaskSummary = getTaskSummary(tasklist.tasks)
  const timeslotTaskSummary = getTaskSummary(timeslot.tasks)
  const todoMinutes = tasklistTaskSummary.status.TODO.minutes
  const doneMinutes = timeslotTaskSummary.status.DONE.minutes

  const deleteTimeslot = useDeleteTimeslot()

  const handleDelete = () => {
    deleteTimeslot.mutate({
      where: { id: timeslot.id },
    })
    if (activeTimeslotId === timeslot.id) {
      router.push(closeTimeslotHref)
    }
  }

  const isActive = activeTimeslotId === timeslot.id
  const timeslotHref = getTimeslotHref(timeslot.id)

  const timeslotStatus = getTimeslotStatus({
    date: timeslot.date_string,
    startTime: timeslot.start_time_string,
    endTime: timeslot.end_time_string,
  })

  const deleteDisabled = timeslotStatus === "past" && doneMinutes > 0

  return (
    <div
      className={twMerge(
        "group flex flex-col gap-8 p-8",
        "rounded-lg border",
        isActive ? "border-gold-500 border-2" : null,
        timeslotStatus === "past"
          ? [doneMinutes > 0 ? "border-blue-300 bg-blue-50" : "bg-neutral-200"]
          : ["bg-canvas"]
      )}
    >
      <Link
        href={timeslotHref}
        className={twMerge("flex items-start gap-4 rounded", "cursor-pointer hover:underline")}
      >
        <span className="inline-flex h-20 min-w-fit items-center">
          <EmojiDynamic unified={tasklist.emoji?.code ?? defaultTasklistEmojiCode} size={16} />
        </span>
        <span className="line-clamp-2 text-left font-medium">{timeslot.tasklist.title}</span>
      </Link>
      <div className="flex gap-2">
        {timeslotStatus === "past" && !doneMinutes ? (
          <span className="text-sm text-neutral-500">No tasks completed</span>
        ) : null}
        {timeslotStatus !== "past" && todoMinutes ? (
          <TaskSizeChip minutes={todoMinutes} status="TODO" />
        ) : null}
        {doneMinutes ? <TaskSizeChip minutes={doneMinutes} status="DONE" /> : null}
      </div>
      <div className="grow" />
      {deleteDisabled ? null : (
        <div className="flex">
          <Button
            onPress={handleDelete}
            className={twMerge(
              "flex items-center gap-4 rounded-md px-2 text-sm",
              "cursor-pointer",
              "text-neutral-400 hover:text-red-700",
              "invisible group-focus-within:visible group-hover:visible"
            )}
          >
            Remove
            <XIcon size={12} />
          </Button>
        </div>
      )}
    </div>
  )
}
