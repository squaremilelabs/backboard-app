"use client"

import { Button, GridList, GridListItem, Link } from "react-aria-components"
import { GripVerticalIcon, InboxIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { Emoji } from "./primitives/common/emoji"
import TaskSummary from "./primitives/task/task-summary"
import { TaskSizeChip } from "./primitives/task/task-size"
import { useAggregateTask, useFindManyTasklist } from "@/database/generated/hooks"
import { defaultTasklistEmojiCode, sortTasklists } from "@/lib/utils-tasklist"
import { iconBox, interactive } from "@/styles/class-names"
import useModalControl from "@/lib/modal-control"

export default function TasklistSidebar() {
  const inboxMinutesQuery = useAggregateTask({
    _sum: { size_minutes: true },
    where: { tasklist_id: null },
  })
  const tasklistsQuery = useFindManyTasklist({
    where: { archived_at: null },
    include: { tasks: { where: { timeslot_id: null } } },
  })

  const { inboxModalHref, tasklistModalHref } = useModalControl()

  const inboxMinutes = inboxMinutesQuery.data?._sum.size_minutes ?? 0
  const sortedTasklists = sortTasklists(tasklistsQuery.data ?? [])

  return (
    <div className="flex flex-col gap-8 overflow-auto p-16">
      {/* INBOX */}
      <Link
        className={twMerge(
          interactive({ hover: "fade" }),
          "flex items-center p-8",
          "rounded-lg border border-neutral-200"
        )}
        href={inboxModalHref()}
      >
        <div className={iconBox({ className: "text-neutral-400" })}>
          <InboxIcon />
        </div>
        <p className="ml-4 grow font-medium">Inbox</p>
        {inboxMinutes ? <TaskSizeChip status="DRAFT" minutes={inboxMinutes} /> : null}
      </Link>
      {/* GRIDLIST */}
      <GridList
        aria-label="Tasklists"
        items={sortedTasklists}
        className="flex flex-col gap-8"
        renderEmptyState={() =>
          tasklistsQuery.isLoading ? <div className="p-8">Loading...</div> : null
        }
      >
        {(tasklist) => {
          return (
            <GridListItem
              id={tasklist.id}
              textValue={tasklist.title}
              href={tasklistModalHref(tasklist.id)}
              className={twMerge(
                interactive({ hover: "fade" }),
                "flex items-start px-4 py-6",
                "rounded-lg border border-neutral-200 bg-neutral-100"
              )}
            >
              <Button className={twMerge(iconBox(), "text-neutral-400")}>
                <GripVerticalIcon />
              </Button>
              <Emoji code={tasklist.emoji?.code ?? defaultTasklistEmojiCode} />
              <p className="ml-4 grow truncate font-medium">{tasklist.title}</p>
              <TaskSummary tasks={tasklist.tasks} />
            </GridListItem>
          )
        }}
      </GridList>
      {/* CREATION */}
    </div>
  )
}
