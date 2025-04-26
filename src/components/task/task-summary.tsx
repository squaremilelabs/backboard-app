import { Task } from "@zenstackhq/runtime/models"
import { useState } from "react"
import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { TaskSizeChip } from "./task-size"
import { taskStatuses } from "./utilities"
import { getTaskSummary } from "@/lib/task/utils"

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

  return (
    <Button
      className={twMerge(
        "flex items-center gap-4",
        "cursor-pointer rounded-lg p-4 hover:bg-neutral-200"
      )}
      onPress={() => setShowAll((prev) => !prev)}
    >
      {showAll ? (
        taskStatuses.map((status) => {
          const summary = taskSummary.status[status]
          return <TaskSizeChip key={status} status={status} minutes={summary.minutes} />
        })
      ) : (
        <TaskSizeChip
          status={primaryStatus}
          minutes={taskSummary.status[primaryStatus].minutes}
          tierOverride={
            primaryStatus === "DONE" ? "zero" : primaryStatus === "DRAFT" ? "medium" : undefined
          }
          className={taskSummary.total.minutes === 0 ? "bg-transparent" : undefined}
        />
      )}
    </Button>
  )
}
