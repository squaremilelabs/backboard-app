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
  size,
}: {
  minutes: number | null | undefined
  status: TaskStatus
  className?: string
  fixedWeight?: ChipProps["weight"]
  useOverdueColor?: boolean
  useCondensedMinutes?: boolean
  size?: ChipProps["size"]
}) {
  return (
    <div
      className={chip({
        size,
        shape: "pill",
        color: getTaskStatusChipColor(status, { useOverdueColor }),
        weight: fixedWeight ?? getTaskSizeChipWeight(minutes),
        className: twMerge(className),
      })}
    >
      <span className="text-inherit !no-underline">
        {formatMinutes(minutes, { condense: useCondensedMinutes })}
      </span>
    </div>
  )
}

export function TaskSizeSummaryChips({
  tasks,
  useOverdueColor,
  consistentWeightVariant,
  showEmptyChip,
  showFullMinutes,
  size,
}: {
  tasks: Task[]
  consistentWeightVariant?: ChipProps["weight"]
  showEmptyChip?: boolean
  useOverdueColor?: boolean
  showFullMinutes?: boolean
  size?: ChipProps["size"]
}) {
  const taskSummary = getTaskSummary(tasks)
  const displayedStatuses: TaskStatus[] = [
    taskSummary.status.TODO.minutes > 0 ? ("TODO" as TaskStatus) : null,
    taskSummary.status.DRAFT.minutes > 0 ? ("DRAFT" as TaskStatus) : null,
    taskSummary.status.DONE.minutes > 0 ? ("DONE" as TaskStatus) : null,
  ].filter((t) => t !== null)

  return displayedStatuses.length ? (
    <div className={twMerge("flex items-center -space-x-4", size === "small" ? "-space-x-6" : "")}>
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
            size={size}
          />
        )
      })}
    </div>
  ) : showEmptyChip ? (
    <TaskSizeChip status="DRAFT" minutes={0} size={size} />
  ) : null
}

export function TaskSizeSummaryText({
  tasks,
  useOverdueColor,
}: {
  tasks: Task[]
  useOverdueColor?: boolean
}) {
  const taskSummary = getTaskSummary(tasks)

  const totalMinutes = taskSummary.total.minutes
  const undoneMinutes = taskSummary.status.TODO.minutes + taskSummary.status.DRAFT.minutes
  const doneMinutes = taskSummary.status.DONE.minutes

  const allDone = totalMinutes !== 0 && tasks.every((task) => task.status === "DONE")
  const allUndone = totalMinutes !== 0 && tasks.every((task) => task.status !== "DONE")
  const mixedStatuses = totalMinutes !== 0 && !allDone && !allUndone

  const undoneColor = useOverdueColor ? "text-red-700" : "text-gold-500"

  return (
    <div className="flex min-w-fit items-center gap-2">
      {allDone && (
        <span className={twMerge("min-w-fit text-sm font-semibold text-blue-600")}>
          {formatMinutes(doneMinutes)}
        </span>
      )}
      {allUndone && (
        <span className={twMerge("min-w-fit text-sm font-semibold", undoneColor)}>
          {formatMinutes(undoneMinutes)}
        </span>
      )}
      {mixedStatuses && (
        <>
          <span className={twMerge("min-w-fit text-sm font-semibold", undoneColor)}>
            {formatMinutes(undoneMinutes)}
          </span>
          <span className="text-sm text-neutral-400">/</span>
          <span className={twMerge("min-w-fit text-sm text-neutral-500")}>
            {formatMinutes(totalMinutes)}
          </span>
        </>
      )}
    </div>
  )
}
