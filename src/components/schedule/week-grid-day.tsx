import { Button, Link } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { useRef, useState } from "react"
import { PlusIcon, XIcon } from "lucide-react"
import { Task, Tasklist, Timeslot } from "@zenstackhq/runtime/models"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import TasklistItem from "../tasklist/tasklist-item"
import { PresetTimeslot, presetTimeslots, getTimeslotStatus } from "@/lib/utils-timeslot"
import { useScheduleParams } from "@/lib/schedule"
import TasklistSelect from "@/components/tasklist/tasklist-select"
import {
  useCreateTimeslot,
  useDeleteTimeslot,
  useFindManyTimeslot,
} from "@/database/generated/hooks"
import { getTaskSummary } from "@/lib/utils-task"
import { TaskSizeChip } from "@/components/task/task-size"

export default function WeekGridDay({ date }: { date: Date }) {
  const dateString = format(date, "yyyy-MM-dd")
  const timeslotsQuery = useFindManyTimeslot({
    where: { date_string: dateString, archived_at: null },
    include: {
      tasklist: {
        include: {
          tasks: {
            where: { status: "TODO" },
          },
        },
      },
      tasks: { where: { status: "DONE" } },
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
        const timeslotStatus = getTimeslotStatus({
          date: dateString,
          ...presetTimeslot,
        })
        return (
          <div
            key={presetTimeslot.startTime}
            className={twMerge(
              "grid rounded-lg",
              timeslotStatus === "past" ? "bg-neutral-200" : null,
              timeslotStatus === "current" ? "border-gold-300 border" : null
            )}
          >
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

  const timeslotHref = getTimeslotHref(timeslot.id)

  const timeslotStatus = getTimeslotStatus({
    date: timeslot.date_string,
    startTime: timeslot.start_time_string,
    endTime: timeslot.end_time_string,
  })

  const deleteDisabled = timeslotStatus === "past"

  return (
    <div
      className={twMerge(
        "group flex flex-col gap-8 truncate p-8",
        "rounded-lg border",
        timeslotStatus === "past" ? [doneMinutes > 0 ? "bg-blue-50" : "bg-neutral-200"] : null,
        timeslotStatus !== "past" ? "bg-canvas" : null
      )}
    >
      <Link
        href={timeslotHref}
        className={twMerge(
          "flex items-start gap-4 truncate rounded",
          "cursor-pointer hover:underline"
        )}
      >
        <TasklistItem tasklist={tasklist} />
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

function EmptyTimeslot({ date, presetTimeslot }: { date: Date; presetTimeslot: PresetTimeslot }) {
  const dateString = format(date, "yyyy-MM-dd")
  const [tasklistSelectOpen, setTasklistSelectOpen] = useState(false)
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

  const isDisabled = timeslotStatus === "past"

  return (
    <>
      <Button
        ref={buttonRef}
        isDisabled={timeslotStatus === "past"}
        onPress={() => setTasklistSelectOpen(true)}
        className={twMerge(
          "group flex items-end justify-start",
          "!outline-0",
          "rounded-lg p-8",
          "not-disabled:cursor-pointer",
          "not-hover:focus-visible:bg-neutral-200",
          tasklistSelectOpen ? "bg-canvas" : "",
          timeslotStatus === "past"
            ? [tasklistSelectOpen ? "bg-neutral-300" : "hover:bg-neutral-300"]
            : ["border", tasklistSelectOpen ? "bg-canvas" : "hover:bg-canvas"]
        )}
      >
        <span
          className={twMerge(
            "flex items-center justify-center gap-4 text-sm text-neutral-500",
            "invisible group-hover:visible",
            tasklistSelectOpen ? "visible" : "",
            isDisabled ? "!invisible" : ""
          )}
        >
          Add
          <PlusIcon size={14} />
        </span>
      </Button>
      <TasklistSelect
        triggerRef={buttonRef}
        isOpen={tasklistSelectOpen}
        onOpenChange={setTasklistSelectOpen}
        selectedId={null}
        onSelectionChange={handleCreateTimeslot}
      />
    </>
  )
}
