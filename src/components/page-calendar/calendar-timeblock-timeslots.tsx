import { Button, GridList, GridListItem, useDragAndDrop } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { GripVerticalIcon, LoaderIcon, XIcon } from "lucide-react"
import { Emoji } from "../primitives/emoji"
import { TaskSizeSummaryChips } from "../primitives/task-size"
import ConfirmationButton from "../primitives/confirmation-button"
import { useDeleteTimeslot, useFindManyTimeslot } from "@/database/generated/hooks"
import { getTemporalStatus, sortTimeslots, Timeblock } from "@/lib/utils-temporal"
import { defaultTasklistEmojiCode } from "@/lib/utils-tasklist"
import { iconBox, interactive } from "@/styles/class-names"

export function CalendarTimeblockTimeslots({
  dateString,
  timeblock,
}: {
  dateString: string
  timeblock: Timeblock
}) {
  const temporalStatus = getTemporalStatus({
    date: dateString,
    startTime: timeblock.startTime,
    endTime: timeblock.endTime,
  })
  const timeslotsQuery = useFindManyTimeslot({
    where: { date: dateString, start_time: timeblock.startTime },
    include: { tasklist: true, tasks: true },
  })

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => {
      return [...keys].map((key) => {
        const timeslot = timeslotsQuery.data?.find((t) => t.id === key)
        return {
          "text/plain": timeslot?.tasklist.title ?? "-",
          "timeslot": JSON.stringify(timeslot),
        }
      })
    },
  })

  const sortedTimeslots = sortTimeslots(timeslotsQuery.data ?? [], {
    doneSort: temporalStatus === "past" ? "desc" : "asc",
  })

  const deleteTimeslotMutation = useDeleteTimeslot()
  const handleDelete = (timeslotId: string) => {
    deleteTimeslotMutation.mutate({
      where: { id: timeslotId },
    })
  }

  return (
    <GridList
      aria-label="Timeslots"
      dragAndDropHooks={dragAndDropHooks}
      items={sortedTimeslots}
      className="flex flex-col gap-2 px-8 pb-8"
      dependencies={[deleteTimeslotMutation]}
      renderEmptyState={() =>
        timeslotsQuery.isLoading ? <div className="text-neutral px-16 py-8">Loading...</div> : null
      }
    >
      {(timeslot) => {
        return (
          <GridListItem
            id={timeslot.id}
            href={`/tasklist/${timeslot.tasklist_id}?timeslot=${timeslot.id}`}
            textValue={timeslot.tasklist.title}
            className={twMerge(interactive(), "flex items-center gap-2", "py-6", "group")}
          >
            <Button
              slot="drag"
              className={twMerge(
                iconBox(),
                interactive({ hover: "background" }),
                "text-neutral-400"
              )}
            >
              <GripVerticalIcon />
            </Button>
            <Emoji code={timeslot.tasklist.emoji?.code ?? defaultTasklistEmojiCode} />
            <p className="grow truncate font-medium">{timeslot.tasklist.title}</p>
            <ConfirmationButton
              onConfirm={() => handleDelete(timeslot.id)}
              helpText="Are you sure you want to remove this tasklist from your calendar? Any tasks will be moved to the Backlog."
              confirmButtonText="Remove"
              isDestructive
            >
              <Button
                className={twMerge(
                  iconBox(),
                  interactive({ hover: "background" }),
                  "hidden group-data-hovered:flex",
                  "opacity-100 starting:opacity-0",
                  "transition-opacity",
                  deleteTimeslotMutation.isPending ? "hidden" : ""
                )}
              >
                <XIcon />
              </Button>
            </ConfirmationButton>
            {deleteTimeslotMutation.isPending && (
              <div className={iconBox({ className: "text-gold-500", size: "small" })}>
                <LoaderIcon className="animate-spin" />
              </div>
            )}
            <TaskSizeSummaryChips
              tasks={timeslot.tasks}
              useOverdueColor={temporalStatus === "past"}
              showEmptyChip
            />
          </GridListItem>
        )
      }}
    </GridList>
  )
}
