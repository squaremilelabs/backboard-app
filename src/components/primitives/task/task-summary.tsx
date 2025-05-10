import { Task } from "@zenstackhq/runtime/models"
import { twMerge } from "tailwind-merge"
import { TaskStatus } from "@prisma/client"
import { TaskSizeChip } from "./task-size"
import { getTaskSummary } from "@/lib/utils-task"
import { ChipProps } from "@/styles/class-names"

export default function TaskSummary({
  tasks,
  useOverdueColor,
  consistentWeightVariant,
}: {
  tasks: Task[]
  consistentWeightVariant?: ChipProps["weight"]
  useOverdueColor?: boolean
}) {
  const taskSummary = getTaskSummary(tasks)
  const displayedStatuses: TaskStatus[] = [
    taskSummary.status.TODO.minutes > 0 ? ("TODO" as TaskStatus) : null,
    taskSummary.status.DRAFT.minutes > 0 ? ("DRAFT" as TaskStatus) : null,
    taskSummary.status.DONE.minutes > 0 ? ("DONE" as TaskStatus) : null,
  ].filter((t) => t !== null)

  return displayedStatuses.length ? (
    <div className={twMerge("flex items-center -space-x-4")}>
      {displayedStatuses.map((status) => {
        const summary = taskSummary.status[status]
        return (
          <TaskSizeChip
            key={status}
            status={status}
            minutes={summary.minutes}
            fixedWeight={consistentWeightVariant}
            useOverdueColor={useOverdueColor}
            useCondensedMinutes
          />
        )
      })}
    </div>
  ) : null
}
