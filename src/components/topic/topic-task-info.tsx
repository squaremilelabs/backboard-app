import { twMerge } from "tailwind-merge"
import { Check } from "lucide-react"
import { TopicItem } from "@/lib/topic/item-data"
import { TASK_DONE_TARGET_DISPLAY_MAP } from "@/lib/task/constants"
import { formatDate } from "@/lib/utils"

export function TopicNextTaskBadge({
  topic,
  showEmptyDisplay,
}: {
  topic: TopicItem
  showEmptyDisplay?: boolean
}) {
  const nextTask = topic._next_task

  const baseClassName = "rounded py-0.5 text-sm min-w-fit"

  if (!nextTask) {
    if (showEmptyDisplay) {
      return <div className={twMerge(baseClassName, "text-neutral-400")}>No next task</div>
    } else {
      return null
    }
  }

  const nextTaskDisplay = TASK_DONE_TARGET_DISPLAY_MAP[nextTask.done_target]

  return (
    <div className={twMerge(baseClassName, nextTaskDisplay.className, "px-2")}>
      Next {"->"} {nextTaskDisplay.label}
    </div>
  )
}

export function TopicDoneTasksBadge({ topic }: { topic: TopicItem }) {
  const lastDoneTask = topic._last_done_task
  const countDoneTasks = topic._count_done_tasks

  const baseClassName = "rounded text-sm min-w-fit py-0.5 flex items-center"

  const lastDoneDateLabel = lastDoneTask?.done_at ? formatDate(lastDoneTask.done_at) : null

  return (
    <div className="flex items-stretch gap-2">
      <div className={twMerge(baseClassName, countDoneTasks ? "" : "text-neutral-400")}>
        {countDoneTasks ? <Check size={12} className="mr-1" /> : null}
        <span className="text-sm">{countDoneTasks ? countDoneTasks : "No tasks"} </span>
      </div>
      {lastDoneDateLabel ? (
        <div className={twMerge(baseClassName, "ml-1")}>Last: {lastDoneDateLabel}</div>
      ) : null}
    </div>
  )
}
