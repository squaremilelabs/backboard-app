import { Task, TaskStatus } from "@zenstackhq/runtime/models"
import { twMerge } from "tailwind-merge"
import { getTaskSizeChipWeight, getTaskStatusChipColor, getTaskSummary } from "@/lib/utils-task"
import { formatMinutes } from "@/lib/utils-common"
import { chip, ChipProps } from "@/styles/class-names"

export function TaskSizeChip({
  minutes,
  status,
  useOverdueColor,
  useCondensedMinutes,
  fixedWeight,
  className,
}: {
  minutes: number | null | undefined
  status: TaskStatus
  className?: string
  fixedWeight?: ChipProps["weight"]
  useOverdueColor?: boolean
  useCondensedMinutes?: boolean
}) {
  return (
    <div
      className={chip({
        shape: "pill",
        color: getTaskStatusChipColor(status, { useOverdueColor }),
        weight: fixedWeight ?? getTaskSizeChipWeight(minutes),
        className,
      })}
    >
      {formatMinutes(minutes, { condense: useCondensedMinutes })}
    </div>
  )
}

export function TaskSizeSummaryChips({
  tasks,
  useOverdueColor,
  consistentWeightVariant,
  showEmptyChip,
  showFullMinutes,
}: {
  tasks: Task[]
  consistentWeightVariant?: ChipProps["weight"]
  showEmptyChip?: boolean
  useOverdueColor?: boolean
  showFullMinutes?: boolean
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
            useCondensedMinutes={!showFullMinutes}
          />
        )
      })}
    </div>
  ) : showEmptyChip ? (
    <TaskSizeChip status="DRAFT" minutes={0} />
  ) : null
}
