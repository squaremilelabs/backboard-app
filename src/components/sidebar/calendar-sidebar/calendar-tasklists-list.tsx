"use client"

import { useParams } from "next/navigation"
import { Button, GridList, GridListItem, useDragAndDrop } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { GripVerticalIcon } from "lucide-react"
import { useFindManyTasklist } from "@/database/generated/hooks"
import { getISOWeekDates, getTimeslotStatus } from "@/lib/utils-timeslot"
import { defaultTasklistEmojiCode, sortTasklists } from "@/lib/utils-tasklist"
import { Emoji } from "@/components/primitives/common/emoji"
import { iconBox, interactive } from "@/styles/class-names"
import { TaskSizeSummaryChips } from "@/components/primitives/task/task-size"
import { getTaskSummary } from "@/lib/utils-task"

export default function CalendarTasklistGridList() {
  const { iso_week: isoWeek } = useParams<{ iso_week: string }>()
  const weekDates = getISOWeekDates(isoWeek)
  const tasklistsQuery = useFindManyTasklist({
    where: { archived_at: null },
    include: {
      tasks: {
        where: { timeslot: { date: { in: weekDates } } },
      },
    },
  })
  const sortedTasklists = sortTasklists(tasklistsQuery.data ?? [])

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => {
      return [...keys].map((key) => {
        const tasklist = tasklistsQuery.data?.find((t) => t.id === key)
        return {
          "text/plain": tasklist?.title ?? "-",
          "tasklist": JSON.stringify(tasklist),
        }
      })
    },
  })

  const weekStatus = getTimeslotStatus({
    date: weekDates[6],
    startTime: "23:59",
    endTime: "23:59",
  })

  return (
    <GridList
      aria-label="Tasklists"
      dragAndDropHooks={dragAndDropHooks}
      items={sortedTasklists}
      className="flex flex-col gap-2"
    >
      {(tasklist) => {
        const taskSummary = getTaskSummary(tasklist.tasks)
        return (
          <GridListItem
            id={tasklist.id}
            textValue={tasklist.title}
            className={twMerge(
              "flex items-start px-4 py-6",
              "rounded-lg bg-neutral-50",
              taskSummary.total.count === 0 ? "opacity-60" : "",
              "hover:opacity-100"
            )}
          >
            <Button
              slot="drag"
              className={twMerge(interactive(), iconBox({ className: "text-neutral-400" }))}
            >
              <GripVerticalIcon />
            </Button>
            <Emoji code={tasklist.emoji?.code ?? defaultTasklistEmojiCode} />
            <p className="ml-4 grow truncate font-medium">{tasklist.title}</p>
            <TaskSizeSummaryChips
              tasks={tasklist.tasks}
              useOverdueColor={weekStatus === "past"}
              consistentWeightVariant="medium"
            />
          </GridListItem>
        )
      }}
    </GridList>
  )
}
