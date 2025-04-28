import { Task } from "@zenstackhq/runtime/models"
import { useState } from "react"
import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { TaskStatus } from "@prisma/client"
import { TaskSizeChip } from "./task-size"
import { getTaskSummary } from "./utilities"

export default function TaskSummary({ tasks }: { tasks: Task[] }) {
  const [showAll, setShowAll] = useState(false)

  const taskSummary = getTaskSummary(tasks)

  const primaryStatus =
    taskSummary.total.minutes === 0
      ? "DRAFT"
      : taskSummary.status.TODO.minutes > 0
        ? "TODO"
        : taskSummary.status.DRAFT.minutes > 0
          ? "DRAFT"
          : "DONE"

  const allStatuses: TaskStatus[] = [
    taskSummary.status.TODO.minutes > 0 ? ("TODO" as TaskStatus) : null,
    taskSummary.status.DRAFT.minutes > 0 ? ("DRAFT" as TaskStatus) : null,
    taskSummary.status.DONE.minutes > 0 ? ("DONE" as TaskStatus) : null,
  ].filter((t) => t !== null)

  return (
    <Button
      className={twMerge(
        "flex items-center gap-4",
        "cursor-pointer rounded-lg p-4 hover:bg-neutral-200"
      )}
      onPress={() => setShowAll((prev) => !prev)}
    >
      {showAll ? (
        allStatuses.map((status) => {
          const summary = taskSummary.status[status]
          return (
            <TaskSizeChip
              key={status}
              status={status}
              minutes={summary.minutes}
              tierOverride="medium"
              className={summary.minutes === 0 ? "bg-transparent" : undefined}
            />
          )
        })
      ) : (
        <TaskSizeChip
          status={primaryStatus}
          minutes={taskSummary.status[primaryStatus].minutes}
          tierOverride="medium"
          className={taskSummary.total.minutes === 0 ? "bg-transparent" : undefined}
        />
      )}
    </Button>
  )
}
