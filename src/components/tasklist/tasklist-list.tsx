"use client"
import { twMerge } from "tailwind-merge"
import { sub } from "date-fns"
import { useEffect, useState } from "react"
import { sortTasklists } from "./utilities"
import TasklistCreate from "./tasklist-create"
import { TasklistItemContent } from "./tasklist-item-content"
import {
  useCreateTask,
  useDeleteTask,
  useFindManyTasklist,
  useUpdateTask,
  useUpdateTasklist,
} from "@/database/generated/hooks"
import TaskListPanel from "@/components/task/task-list-panel"

const sevenDaysAgo = sub(new Date(), { days: 7 })

export default function TasklistList() {
  const tasklistsQuery = useFindManyTasklist({
    where: { archived_at: null },
    include: {
      tasks: {
        where: {
          OR: [{ completed_at: null }, { completed_at: { gte: sevenDaysAgo } }],
        },
      },
    },
    orderBy: { created_at: "asc" },
  })

  const [tasklistIdOrder, setTasklistIdOrder] = useState<string[] | null>(null)

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

  const updateTasklistMutation = useUpdateTasklist()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

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
              return (
                <TaskListPanel
                  uid={`triage/tasklist/${tasklist.id}`}
                  key={JSON.stringify({ [tasklist.id]: tasklistsQuery.dataUpdatedAt })}
                  tasks={tasklist.tasks}
                  order={tasklist.task_order}
                  isCollapsible
                  headerContent={<TasklistItemContent tasklist={tasklist} />}
                  defaultTaskValues={{
                    tasklist_id: tasklist.id,
                  }}
                  onCreateTask={(values) => {
                    createTaskMutation.mutate({
                      data: { ...values, tasklist: { connect: { id: tasklist.id } } },
                    })
                  }}
                  onUpdateTask={(id, values) => {
                    updateTaskMutation.mutate({
                      where: { id },
                      data: {
                        ...values,
                        completed_at: values.status === "DONE" ? new Date() : undefined,
                      },
                    })
                  }}
                  onDeleteTask={(id) => {
                    deleteTaskMutation.mutate({ where: { id } })
                  }}
                  onReorder={(reorderedIds) => {
                    updateTasklistMutation.mutate({
                      where: { id: tasklist.id },
                      data: { task_order: reorderedIds },
                    })
                  }}
                  onInsert={(task) => {
                    updateTaskMutation.mutate({
                      where: { id: task.id },
                      data: {
                        tasklist: { connect: { id: tasklist.id } },
                        timeslot: { disconnect: true },
                      },
                    })
                  }}
                />
              )
            })}
            <TasklistCreate />
          </div>
        </>
      )}
    </div>
  )
}
