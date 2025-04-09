import { TaskStatus } from "@prisma/client"
import { Prisma } from "@zenstackhq/runtime/models"
import { twMerge } from "tailwind-merge"
import { useGroupByTask } from "@/database/generated/hooks"

export default function TaskIndicator({
  whereClause,
  size = "lg",
}: {
  whereClause: Prisma.TaskWhereInput
  size?: "sm" | "lg"
}) {
  const taskStatsQuery = useGroupByTask({
    by: "status",
    where: { ...whereClause, archived_at: null },
    _count: true,
  })

  const taskCountsByStatus = taskStatsQuery.data?.reduce(
    (obj, stat) => {
      obj[stat.status] = stat._count
      return obj
    },
    { NOW: 0, LATER: 0, DONE: 0 }
  ) ?? { NOW: 0, LATER: 0, DONE: 0 }

  const displayedCountStatus: TaskStatus | null =
    taskCountsByStatus.NOW > 0 ? "NOW" : taskCountsByStatus.LATER > 0 ? "LATER" : null

  const displayedCount =
    displayedCountStatus === null ? null : taskCountsByStatus[displayedCountStatus]

  return displayedCount === null ? null : (
    <div
      className={twMerge(
        "rounded-full border",
        size === "lg" ? "size-[20px]" : "size-[16px]",
        displayedCountStatus === "NOW"
          ? "from-gold-500 to-gold-300 border-gold-200 bg-linear-to-br"
          : null,
        displayedCountStatus === "LATER" ? "border border-neutral-300 bg-neutral-200" : null
      )}
    />
  )
}
