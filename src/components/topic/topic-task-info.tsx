import { Task, Topic } from "@prisma/client"
import { twMerge } from "tailwind-merge"
import { CircleCheckBig, CircleDashed, CircleGauge } from "lucide-react"
import { sortUndoneTasks } from "@/lib/task-utils"
import { formatDate } from "@/lib/utils"

interface TopicWithChildTasks extends Topic {
  child_tasks: Array<Task>
}

const nextTaskTargetDisplayMap: Record<string, { label: string; className: string }> = {
  NO_TARGET: { label: "Next -> No target", className: "bg-neutral-50 text-neutral-600" },
  TODAY: { label: "Next -> Today", className: "bg-gold-100 text-gold-600" },
  THIS_WEEK: { label: "Next -> This week", className: "bg-gold-100 text-gold-600" },
  NEXT_WEEK: { label: "Next -> Next week", className: "bg-neutral-100 text-gold-600" },
  THIS_MONTH: { label: "Next -> This month", className: "bg-neutral-100 text-gold-600" },
  NEXT_MONTH: { label: "Next -> Next month", className: "bg-neutral-100 text-gold-600" },
  SOMEDAY: { label: "Next -> Someday", className: "bg-neutral-50 text-gold-600" },
}

export function TopicTaskTemporalBadge({ topic }: { topic: TopicWithChildTasks }) {
  const undoneTasks = topic.child_tasks.filter((task) => !task.is_done)
  const doneTasks = topic.child_tasks.filter((task) => task.is_done)
  const sortedUndoneTasks = sortUndoneTasks({ tasks: undoneTasks })
  const sortedDoneTasks = doneTasks.sort(
    (a, b) =>
      (b?.done_at?.getTime() ?? doneTasks.length + 1) -
      (a?.done_at?.getTime() ?? doneTasks.length + 1)
  )
  const nextTask = sortedUndoneTasks[0] ?? null
  const lastTask = sortedDoneTasks[0] ?? null

  // If there are no tasks, return null
  if (!nextTask && !lastTask) {
    return null
  }

  const baseClassName = "rounded px-2 py-0.5 text-sm min-w-fit"

  // If there are no undone tasks, and only done tasks
  if (!nextTask && !!lastTask) {
    return (
      <div className={twMerge(baseClassName, "bg-blue-100 text-blue-600")}>
        Last {"->"} {lastTask?.done_at ? formatDate(lastTask.done_at) : "?"}
      </div>
    )
  }

  const nextTaskDisplay = nextTaskTargetDisplayMap[nextTask.target]

  return (
    <div className={twMerge(baseClassName, nextTaskDisplay.className)}>{nextTaskDisplay.label}</div>
  )
}

export function TopicTaskCountBadge({ topic }: { topic: TopicWithChildTasks }) {
  const undoneTasks = topic.child_tasks.filter((task) => !task.is_done)
  const doneTasks = topic.child_tasks.filter((task) => task.is_done)

  const undoneCount = undoneTasks.length
  const doneCount = doneTasks.length
  const totalCount = undoneCount + doneCount

  const label = totalCount === 0 ? "No tasks" : `${doneCount} / ${totalCount}`
  const Icon =
    totalCount === 0 ? CircleDashed : doneCount === totalCount ? CircleCheckBig : CircleGauge

  return (
    <div
      className={twMerge(
        "bg-canvas flex min-w-fit items-center space-x-1 rounded text-sm",
        doneCount === totalCount ? "border-blue-300 text-blue-600" : null,
        undoneCount > 0 ? "text-gold-500 border-gold-300" : null,
        totalCount === 0 ? "p-0 text-neutral-500" : null
      )}
    >
      <Icon size={16} />
      <span className="text-sm">{label}</span>
    </div>
  )
}
