import { twMerge } from "tailwind-merge"
import { Check } from "lucide-react"
import { TopicListItemData } from "@/lib/topic-utils"
import { TASK_TARGET_DISPLAY_MAP } from "@/lib/task-utils"
import { formatDate } from "@/lib/utils"

export function TopicNextTaskBadge({ topic }: { topic: TopicListItemData }) {
  const nextTask = topic._next_task

  const baseClassName = "rounded px-2 py-0.5 text-sm min-w-fit"

  if (!nextTask) {
    return <div className={twMerge(baseClassName, "text-neutral-400")}>No next task</div>
  }

  const nextTaskDisplay = TASK_TARGET_DISPLAY_MAP[nextTask.target]

  return (
    <div className={twMerge(baseClassName, nextTaskDisplay.className)}>
      Next {"->"} {nextTaskDisplay.label}
    </div>
  )
}

export function TopicDoneTasksBadge({ topic }: { topic: TopicListItemData }) {
  const lastDoneTask = topic._last_done_task
  const countDoneTasks = topic._count_done_tasks

  const baseClassName = "rounded px-2 py-0.5 text-sm min-w-fit flex items-center"

  // if (!countDoneTasks) {
  //   return <div className={twMerge(baseClassName, "bg-neutral-50 text-neutral-500")}>None done</div>
  // }

  const lastDoneDateLabel = lastDoneTask?.done_at ? formatDate(lastDoneTask.done_at) : null

  return (
    <div className="flex items-stretch">
      <div
        className={twMerge(
          baseClassName,
          countDoneTasks ? "px-1 text-green-600" : "text-neutral-400"
        )}
      >
        {countDoneTasks ? <Check size={12} className="mr-1" /> : null}
        <span className="text-sm">{countDoneTasks ? countDoneTasks : "No tasks done"} </span>
      </div>
      {lastDoneDateLabel ? (
        <div className={twMerge(baseClassName, "ml-1 bg-green-50 text-green-600")}>
          Last {"->"} {lastDoneDateLabel}
        </div>
      ) : null}
    </div>
  )
}
