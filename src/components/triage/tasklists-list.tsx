"use client"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import { sortTasklists } from "../../lib/utils-tasklist"
import TasklistCreate from "../tasklist/tasklist-create"
import TasklistTasksPanel from "./tasklist-tasks-panel"
import { useFindManyTasklist } from "@/database/generated/hooks"

export default function TasklistsList() {
  const tasklistsQuery = useFindManyTasklist({
    where: { archived_at: null },
    include: {
      tasks: {
        where: {
          status: { in: ["TODO", "DRAFT"] },
        },
      },
    },
    orderBy: { created_at: "asc" },
  })

  const [tasklistIdOrder, setTasklistIdOrder] = useState<string[] | null>(null)

  // maintains tasklsit order while task sizes are actively changing
  useEffect(() => {
    if (!tasklistsQuery.data) return
    const sortedTasklists = sortTasklists(tasklistsQuery.data)
    // If order not set, set for the first time
    const orderNotInitialized = tasklistIdOrder === null
    const tasklistSizeChanged = tasklistIdOrder?.length !== sortedTasklists.length
    if (orderNotInitialized || tasklistSizeChanged) {
      const sortedTasklistIds = sortedTasklists.map((tasklist) => tasklist.id)
      setTasklistIdOrder(sortedTasklistIds)
    }
  }, [tasklistsQuery, tasklistIdOrder, setTasklistIdOrder])

  return (
    <div className={twMerge("flex h-full w-full flex-col")}>
      {tasklistsQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={twMerge("flex flex-col gap-8")}>
            {tasklistIdOrder?.map((tasklistId) => {
              const tasklist = tasklistsQuery.data?.find((tl) => tl.id === tasklistId)
              if (!tasklist) return null
              return <TasklistTasksPanel key={tasklistId} tasklist={tasklist} />
            })}
            <TasklistCreate />
          </div>
        </>
      )}
    </div>
  )
}
