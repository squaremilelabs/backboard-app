import { Button, GridList, GridListItem, useDragAndDrop } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { GripVerticalIcon, LoaderIcon, XIcon } from "lucide-react"
import { Task, Tasklist, Timeslot } from "@zenstackhq/runtime/models"
import { Emoji } from "@/components/primitives/emoji"
import { TaskSizeSummaryChips } from "@/components/portables/task-size"
import { ConfirmationButton } from "@/components/primitives/confirmation-button"
import { useDeleteTimeslot } from "@/database/generated/hooks"
import { getTemporalStatus, sortTimeslots, TemporalStatus, Timeblock } from "@/lib/utils-temporal"
import { defaultTasklistEmojiCode } from "@/lib/utils-tasklist"
import { iconBox, interactive } from "@/styles/class-names"
import { useTimeslotsQuery } from "@/lib/query-timeslots"

type ExpandedTimeslot = Timeslot & { tasklist: Tasklist; tasks: Task[] }

export function CalendarTimeblockTimeslots({
  date,
  timeblock,
}: {
  date: string
  timeblock: Timeblock
}) {
  const temporalStatus = getTemporalStatus({
    date: date,
    startTime: timeblock.startTime,
    endTime: timeblock.endTime,
  })
  const { getTimeblockTimeslots, timeslotsQuery } = useTimeslotsQuery()
  const timeslots = getTimeblockTimeslots(date, timeblock)

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => {
      return [...keys].map((key) => {
        const timeslot = timeslots?.find((t) => t.id === key)
        return {
          "text/plain": timeslot?.tasklist.title ?? "-",
          "timeslot": JSON.stringify(timeslot),
        }
      })
    },
  })

  const sortedTimeslots = sortTimeslots(timeslots ?? [], {
    doneSort: temporalStatus === "past" ? "desc" : "asc",
  })

  return (
    <GridList
      aria-label="Timeslots"
      dragAndDropHooks={dragAndDropHooks}
      items={sortedTimeslots}
      className="flex flex-col gap-2 px-8 pb-8"
      renderEmptyState={() =>
        timeslotsQuery.isLoading ? <div className="text-neutral px-16 py-8">Loading...</div> : null
      }
    >
      {(timeslot) => <TimeslotItem timeslot={timeslot} timeblockTemporalStatus={temporalStatus} />}
    </GridList>
  )
}

function TimeslotItem({
  timeslot,
  timeblockTemporalStatus,
}: {
  timeslot: ExpandedTimeslot
  timeblockTemporalStatus: TemporalStatus
}) {
  const deleteTimeslotMutation = useDeleteTimeslot()
  const handleDelete = () => {
    deleteTimeslotMutation.mutate({
      where: { id: timeslot.id },
    })
  }

  const hasNoDoneTasks = timeslot.tasks.every((task) => task.status !== "DONE")
  const hasNoTasks = timeslot.tasks.length === 0

  return (
    <GridListItem
      id={timeslot.id}
      href={`/tasklist/${timeslot.tasklist_id}?timeslot=${timeslot.id}`}
      textValue={timeslot.tasklist.title}
      className={twMerge(interactive(), "flex items-center gap-2", "py-6", "group")}
    >
      <Button
        slot="drag"
        className={twMerge(iconBox(), interactive({ hover: "background" }), "text-neutral-400")}
      >
        <GripVerticalIcon />
      </Button>
      <Emoji code={timeslot.tasklist.emoji?.code ?? defaultTasklistEmojiCode} />
      <p className="grow truncate font-medium">{timeslot.tasklist.title}</p>
      {hasNoDoneTasks &&
        (hasNoTasks ? (
          <UnscheduleButton onPress={handleDelete} />
        ) : (
          <ConfirmationButton
            onConfirm={handleDelete}
            content="All tasks will be moved to the Backlog."
            confirmButtonText="Unschedule"
            isDestructive
          >
            <UnscheduleButton />
          </ConfirmationButton>
        ))}
      {deleteTimeslotMutation.isPending && (
        <div className={iconBox({ className: "text-gold-500", size: "small" })}>
          <LoaderIcon className="animate-spin" />
        </div>
      )}
      <TaskSizeSummaryChips
        tasks={timeslot.tasks}
        useOverdueColor={timeblockTemporalStatus === "past"}
        showEmptyChip
      />
    </GridListItem>
  )
}

function UnscheduleButton({ onPress }: { onPress?: () => void }) {
  return (
    <Button
      onPress={onPress}
      className={twMerge(
        iconBox(),
        interactive({ hover: "background" }),
        "hidden group-data-hovered:flex",
        "opacity-100 starting:opacity-0",
        "transition-opacity"
      )}
    >
      <XIcon />
    </Button>
  )
}
