import { format, parse } from "date-fns"
import { twMerge } from "tailwind-merge"
import { Timeslot } from "@prisma/client"
import { Task, Tasklist } from "@zenstackhq/runtime/models"
import { Button, GridList, GridListItem } from "react-aria-components"
import { Loader, PlusIcon } from "lucide-react"
import { useRef, useState } from "react"
import TaskSummary from "../primitives/task/task-summary"
import TasklistItem from "../primitives/tasklist/tasklist-item"
import TasklistSelect from "../primitives/tasklist/tasklist-select"
import { TaskSizeChip } from "../primitives/task/task-size"
import { useScheduleParams } from "@/lib/schedule-params"
import { getTimeslotStatus, sortTimeslots } from "@/lib/utils-timeslot"
import { formatDate } from "@/lib/utils-common"
import { useCreateTimeslot, useFindManyTimeslot } from "@/database/generated/hooks"
import { getTaskSummary } from "@/lib/utils-task"

interface ExpandedTimeslot extends Timeslot {
  tasklist: Tasklist
  tasks: Task[]
}

interface WeekColumnData {
  dateString: string
  timeslots: ExpandedTimeslot[]
}

export default function Week() {
  const { activeWeekDays } = useScheduleParams()
  const activeWeekDateStrings = activeWeekDays.map((date) => format(date, "yyyy-MM-dd"))
  const timeslotsQuery = useFindManyTimeslot({
    where: { date_string: { in: activeWeekDateStrings }, archived_at: null },
    include: {
      tasks: true,
      tasklist: true,
    },
  })
  const weekColumns: WeekColumnData[] = activeWeekDateStrings.map((dateString) => {
    return {
      dateString,
      timeslots: sortTimeslots(
        timeslotsQuery.data?.filter((timeslot) => timeslot.date_string === dateString) ?? []
      ),
    }
  })

  return (
    <div className="flex h-full max-h-full w-fit items-stretch gap-8">
      {weekColumns.map(({ dateString, timeslots }) => {
        return <WeekColumn key={dateString} dateString={dateString} timeslots={timeslots} />
      })}
      <div className="text-transparent">.</div>
    </div>
  )
}

function WeekColumn({ dateString, timeslots }: WeekColumnData) {
  const tasks = timeslots.flatMap((timeslot) => timeslot.tasks)

  const date = parse(dateString, "yyyy-MM-dd", new Date())
  const dateStatus = getTimeslotStatus({
    date: dateString,
    startTime: "00:00",
    endTime: "23:59",
  })

  const createTimeslot = useCreateTimeslot()

  const handleCreateTimeslot = (tasklist: Tasklist) => {
    createTimeslot.mutate({
      data: {
        date_string: dateString,
        start_time_string: "00:00",
        end_time_string: "23:59",
        tasklist: {
          connect: { id: tasklist.id },
        },
      },
    })
  }

  const tasklistSelectTriggerRef = useRef<HTMLButtonElement>(null)
  const [tasklistSelectOpen, setTasklistSelectOpen] = useState(false)

  return (
    <div
      className={twMerge(
        "flex w-xs flex-col rounded-xl border-2 bg-neutral-100",
        "overflow-auto",
        dateStatus === "past" ? "bg-neutral-100" : "bg-canvas"
      )}
    >
      {/* Header */}
      <div
        className={twMerge(
          "sticky top-0 z-10",
          "flex items-center p-16",
          "rounded-xl rounded-b-none",
          "backdrop-blur-lg",
          dateStatus === "past" ? "bg-neutral-100/50" : "bg-canvas/50"
        )}
      >
        <p
          className={twMerge(
            "grow font-medium text-neutral-950",
            dateStatus === "current" ? "text-gold-600" : ""
          )}
        >
          {formatDate(date, { withWeekday: true })}
        </p>
      </div>
      {/* Body */}
      <div className="flex w-full grow flex-col gap-8 px-8">
        {timeslots.length ? (
          <GridList
            aria-label={`Tasklists for ${dateString}`}
            className="flex w-full flex-col gap-8"
            items={timeslots}
          >
            {(timeslot) => <TimeslotItem timeslot={timeslot} />}
          </GridList>
        ) : null}
        <Button
          ref={tasklistSelectTriggerRef}
          isDisabled={createTimeslot.isPending}
          onPress={() => setTasklistSelectOpen(true)}
          className={twMerge(
            "flex items-center gap-4 p-8",
            "rounded-xl text-sm text-neutral-500",
            "cursor-pointer hover:text-neutral-950",
            "-outline-offset-1",
            dateStatus === "past" ? "hover:bg-neutral-200" : "hover:bg-neutral-100"
          )}
        >
          {createTimeslot.isPending ? (
            <Loader size={16} className="text-gold-500 animate-spin" />
          ) : (
            <>
              <PlusIcon size={16} />
              Add
            </>
          )}
        </Button>
        <TasklistSelect
          triggerRef={tasklistSelectTriggerRef}
          isOpen={tasklistSelectOpen}
          onOpenChange={setTasklistSelectOpen}
          selectedId={null}
          onSelectionChange={handleCreateTimeslot}
        />
      </div>
      <div
        className={twMerge(
          "sticky bottom-0 z-10",
          "flex items-center justify-end p-16",
          "rounded-xl rounded-t-none",
          "backdrop-blur-lg",
          dateStatus === "past" ? "bg-neutral-100/50" : "bg-canvas/50"
        )}
      >
        <TaskSummary tasks={tasks} showOverdue={dateStatus === "past"} />
      </div>
    </div>
  )
}

function TimeslotItem({
  timeslot,
}: {
  timeslot: Timeslot & { tasklist: Tasklist; tasks: Task[] }
}) {
  const tasksSummary = getTaskSummary(timeslot.tasks)
  const doneMinutes = tasksSummary.status.DONE.minutes
  const totalMinutes = tasksSummary.total.minutes
  const hasNoTasks = totalMinutes === 0
  const isAllDone = totalMinutes > 0 && totalMinutes === doneMinutes

  const { getTimeslotHref } = useScheduleParams()
  const timeslotHref = getTimeslotHref(timeslot.id)

  const timeslotStatus = getTimeslotStatus({
    date: timeslot.date_string,
    // using full date for MVP (until full calendar is implemented)
    startTime: "00:00",
    endTime: "23:59",
  })

  const isPast = timeslotStatus === "past"

  return (
    <GridListItem
      id={timeslot.id}
      textValue={timeslot.tasklist.title}
      href={timeslotHref}
      className={twMerge(
        "group flex flex-col gap-8 truncate p-8",
        "rounded-xl border",
        "cursor-pointer",
        "-outline-offset-1",
        isPast ? "border-neutral-300 hover:bg-neutral-200" : "hover:bg-neutral-100",
        hasNoTasks ? "bg-transparent" : "",
        isAllDone
          ? [
              "border-blue-200",
              isPast ? "bg-blue-50 hover:bg-blue-100" : "bg-canvas hover:bg-blue-50",
            ]
          : ""
      )}
    >
      <TasklistItem tasklist={timeslot.tasklist} />
      <div className="flex">
        {hasNoTasks ? (
          <TaskSizeChip minutes={0} status="DRAFT" />
        ) : (
          <TaskSummary tasks={timeslot.tasks} showTiers showOverdue={timeslotStatus === "past"} />
        )}
      </div>
    </GridListItem>
  )
}
