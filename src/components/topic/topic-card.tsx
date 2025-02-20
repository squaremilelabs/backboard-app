import { Task, TaskTarget, Topic } from "@prisma/client"
import { Circle, CircleCheckBig, CircleDashed } from "lucide-react"
import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

const taskTimingDisplayMap: Record<TaskTarget, { label: string; colorClassName: string }> = {
  NO_TARGET: { label: "No target", colorClassName: "bg-neutral-50 text-neutral-600" },
  TODAY: { label: "Today", colorClassName: "bg-gold-100 text-gold-600" },
  THIS_WEEK: { label: "This week", colorClassName: "bg-gold-100 text-gold-600" },
  NEXT_WEEK: { label: "This week", colorClassName: "bg-gold-100 text-gold-600" },
  THIS_MONTH: { label: "This week", colorClassName: "bg-gold-100 text-gold-600" },
  NEXT_MONTH: { label: "This week", colorClassName: "bg-gold-100 text-gold-600" },
  SOMEDAY: { label: "Someday", colorClassName: "bg-neutral-50 text-gold-600" },
}

export interface TopicCardExtendedTopic extends Topic {
  child_tasks: Array<Task>
}

export default function TopicCard({
  topic,
  href,
  isFocused,
}: {
  topic: TopicCardExtendedTopic
  href: string
  isFocused?: boolean
}) {
  const allTasks = topic.child_tasks
  const todoTasks = topic.child_tasks
    .filter((task) => !task.is_done)
    .sort((a, b) => a.parent_topic_order - b.parent_topic_order)
  const doneTasks = topic.child_tasks
    .filter((task) => task.is_done)
    .sort((a, b) => b.parent_topic_order - a.parent_topic_order)
  const nextTask = todoTasks[0] ?? null
  const lastTask = doneTasks[0] ?? null

  const hasNoTasks = allTasks.length === 0

  const nextTaskTimingDisplay = nextTask ? taskTimingDisplayMap[nextTask.target] : null
  const lastTaskDateDisplay =
    lastTask && lastTask.done_at ? format(lastTask.done_at, "MMM do") : null

  return (
    <Link
      href={href}
      scroll={false}
      className={twMerge(
        "bg-canvas rounded border",
        `flex flex-col space-y-2 p-4 @sm:flex-row @sm:items-center @sm:justify-between @sm:space-y-0
        @sm:space-x-2`,
        isFocused ? "ring-1 ring-blue-500 focus-visible:ring-2" : "",
        "hover:bg-canvas/50"
      )}
    >
      <div
        className="flex items-center justify-between space-x-2 @sm:flex-col @sm:items-start @sm:space-y-1 @sm:space-x-0
          @sm:truncate"
      >
        <p className="truncate">{topic.title}</p>
        <span className="min-w-fit text-sm text-neutral-400">
          {format(topic.created_at, "MMM d")}
        </span>
      </div>
      {hasNoTasks ? (
        <div className="flex min-w-fit items-center space-x-1 self-end text-sm text-neutral-500 @sm:self-center">
          <span className="text-sm">No tasks</span>
          <CircleDashed size={16} />
        </div>
      ) : (
        <div className="flex min-w-fit items-center space-x-2 self-end @sm:self-center">
          {nextTaskTimingDisplay ? (
            <div
              className={twMerge(
                "rounded px-2 py-0.5 text-sm",
                nextTaskTimingDisplay.colorClassName
              )}
            >
              Next {`->`} {nextTaskTimingDisplay.label}
            </div>
          ) : lastTaskDateDisplay ? (
            <div className={twMerge("rounded px-2 py-0.5 text-sm", "bg-blue-100 text-blue-600")}>
              Last {`->`} {lastTaskDateDisplay}
            </div>
          ) : null}
          <div
            className={twMerge(
              "flex items-center space-x-1 text-sm",
              doneTasks.length === allTasks.length ? "text-blue-500" : null,
              todoTasks.length ? "text-gold-500" : ""
            )}
          >
            <span className="text-sm">
              {doneTasks.length} / {allTasks.length}
            </span>
            {todoTasks.length ? <Circle size={16} /> : <CircleCheckBig size={16} />}
          </div>
        </div>
      )}
    </Link>
  )
}
