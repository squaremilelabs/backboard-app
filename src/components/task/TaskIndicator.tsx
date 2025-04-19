"use client"

import { TaskStatus } from "@prisma/client"
import { Prisma } from "@zenstackhq/runtime/models"
import { twMerge } from "tailwind-merge"
import { useGroupByTask } from "@/database/generated/hooks"
import { taskStatusBadge } from "@/lib/class-names"

export default function TaskIndicator({
  whereClause,
  size = "lg",
}: {
  whereClause: Prisma.TaskWhereInput
  size?: "sm" | "lg"
}) {
  const taskStatsQuery = useGroupByTask({
    by: "status",
    where: { ...whereClause, archived_at: null, tasklist: { archived_at: null } },
    _count: true,
  })

  const taskCountsByStatus = taskStatsQuery.data?.reduce(
    (obj, stat) => {
      obj[stat.status] = stat._count
      return obj
    },
    { NOW: 0, LATER: 0, DONE: 0 }
  ) ?? { NOW: 0, LATER: 0, DONE: 0 }

  const displayedStatuses: TaskStatus[] = ["NOW", "LATER"]

  return (
    <div className={twMerge("flex items-center", size === "sm" ? "gap-1" : "gap-2")}>
      {displayedStatuses.map((status) => {
        const count = taskCountsByStatus[status]
        const className = taskStatusBadge({
          status: status as "NOW" | "LATER",
          size,
          hasCount: count > 0,
        })
        return (
          <div
            key={status}
            className={twMerge(
              className,
              taskStatsQuery.isLoading ? "animate-pulse bg-neutral-300" : ""
            )}
          >
            {count}
          </div>
        )
      })}
    </div>
  )
}
