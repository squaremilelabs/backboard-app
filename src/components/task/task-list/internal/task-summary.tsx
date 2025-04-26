import { Task } from "@zenstackhq/runtime/models"
import { TaskSizeChip } from "../../task-size"
import { taskStatuses } from "../../constants"
import { getTaskSummary } from "@/lib/task/utils"

export default function TaskSummary({ tasks }: { tasks: Task[] }) {
  const taskSummary = getTaskSummary(tasks)
  const displayedStatuses = taskStatuses.filter((status) => taskSummary.status[status].count > 0)
  return (
    <div className="flex items-center gap-4">
      {displayedStatuses.map((status) => {
        const summary = taskSummary.status[status]
        return (
          <TaskSizeChip
            key={status}
            status={status}
            minutes={summary.minutes}
            tierOverride="medium"
          />
        )
      })}
    </div>
  )
}
