import { Button, GridList, GridListItem, useDragAndDrop } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { GripVerticalIcon, LoaderIcon, XIcon } from "lucide-react"
import { parse } from "date-fns"
import { Emoji } from "../primitives/common/emoji"
import { TaskSizeSummaryChips } from "../primitives/task/task-size"
import { useDeleteTimeslot, useFindManyTimeslot } from "@/database/generated/hooks"
import { getISOWeekString, getTimeslotStatus, sortTimeslots, Timeblock } from "@/lib/utils-timeslot"
import { defaultTasklistEmojiCode } from "@/lib/utils-tasklist"
import { iconBox, interactive } from "@/styles/class-names"

export default function TimeblockTimeslots({
  dateString,
  timeblock,
}: {
  dateString: string
  timeblock: Timeblock
}) {
  const timeblockStatus = getTimeslotStatus({
    date: dateString,
    startTime: timeblock.startTime,
    endTime: timeblock.endTime,
  })
  const timeslotsQuery = useFindManyTimeslot({
    where: { date_string: dateString, start_time_string: timeblock.startTime },
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

  const isoWeekString = getISOWeekString(parse(dateString, "yyyy-MM-dd", new Date()))

  const sortedTimeslots = sortTimeslots(timeslotsQuery.data ?? [], {
    doneSort: timeblockStatus === "past" ? "desc" : "asc",
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
    >
      {(timeslot) => {
        return (
          <GridListItem
            id={timeslot.id}
            href={`/calendar/${isoWeekString}/timeslot/${timeslot.tasklist_id}-${timeslot.id}`}
            textValue={timeslot.tasklist.title}
            className={twMerge(
              interactive(),
              "flex items-center gap-2",
              "rounded-lg border bg-neutral-100",
              "px-4 py-6",
              "group"
            )}
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
            <Button
              onPress={() => handleDelete(timeslot.id)}
              className={twMerge(
                iconBox(),
                interactive({ hover: "background" }),
                "text-red-700",
                "hidden group-data-hovered:flex",
                "opacity-100 starting:opacity-0",
                "transition-opacity",
                deleteTimeslotMutation.isPending ? "hidden" : ""
              )}
            >
              <XIcon />
            </Button>
            {deleteTimeslotMutation.isPending && (
              <div className={iconBox({ className: "text-gold-500", size: "small" })}>
                <LoaderIcon className="animate-spin" />
              </div>
            )}
            <TaskSizeSummaryChips
              tasks={timeslot.tasks}
              useOverdueColor={timeblockStatus === "past"}
              showEmptyChip
            />
          </GridListItem>
        )
      }}
    </GridList>
  )
}
