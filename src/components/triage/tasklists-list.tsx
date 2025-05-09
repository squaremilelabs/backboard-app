"use client"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import TasklistTasksPanel from "./tasklist-tasks-panel"
import { sortTasklists } from "@/lib/utils-tasklist"
import TasklistCreate from "@/components/primitives/tasklist/tasklist-create"
import { useFindManyTasklist } from "@/database/generated/hooks"

export default function TasklistsList() {
  const tasklistsQuery = useFindManyTasklist({
    where: { archived_at: null },
    include: {
      tasks: {
        where: {
          timeslot_id: null,
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

  const [tasklistRefreshKey, setTasklistRefreshKey] = useState(0)
  useEffect(() => {
    if (tasklistsQuery.isFetchedAfterMount) {
      setTasklistRefreshKey(new Date().getTime())
    }
    return () => setTasklistRefreshKey(0)
  }, [tasklistsQuery.isFetchedAfterMount])

  return (
    <div className={twMerge("flex h-full w-full flex-col")}>
      {tasklistsQuery.isLoading ? (
        <div className="p-8">Loading lists...</div>
      ) : (
        <>
          <div className={twMerge("flex flex-col gap-8")}>
            {tasklistIdOrder?.map((tasklistId) => {
              const tasklist = tasklistsQuery.data?.find((tl) => tl.id === tasklistId)
              if (!tasklist) return null
              return (
                <TasklistTasksPanel
                  key={tasklistId}
                  tasklist={tasklist}
                  refreshKey={tasklistRefreshKey}
                />
              )
            })}
            <TasklistCreate />
            <div className="text-transparent">.</div>
          </div>
        </>
      )}
    </div>
  )
}
