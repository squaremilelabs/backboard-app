"use client"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import { createId } from "@paralleldrive/cuid2"
import { draftTask } from "../../lib/utils-task"
import { sortTasklists } from "../../lib/utils-tasklist"
import TasklistCreate from "./tasklist-create"
import TasklistItem from "./tasklist-item"
import {
  useCreateTask,
  useDeleteTask,
  useFindManyTasklist,
  useUpdateTask,
  useUpdateTasklist,
} from "@/database/generated/hooks"
import TaskListPanel from "@/components/task/tasks-panel"

export default function TasklistList() {
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

  // maintains tasklsit order in local state
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
                  uid={`tasklist/${tasklist.id}`}
                  key={tasklist.id}
                  tasks={tasklist.tasks}
                  order={tasklist.task_order}
                  isCollapsible
                  headerContent={
                    <TasklistItem
                      tasklist={tasklist}
                      onUpdate={(values) =>
                        updateTasklistMutation.mutate({ where: { id: tasklist.id }, data: values })
                      }
                      onArchive={() => {
                        updateTasklistMutation.mutate({
                          where: { id: tasklist.id },
                          data: { archived_at: new Date() },
                        })
                      }}
                    />
                  }
                  selectableTaskStatuses={["DRAFT", "TODO"]}
                  creatableTaskStatuses={["DRAFT", "TODO"]}
                  onCreateTask={({ values, list }) => {
                    const id = createId()
                    list.prepend(draftTask({ id, tasklist_id: tasklist.id, ...values }))
                    createTaskMutation.mutate({
                      data: { id, ...values, tasklist: { connect: { id: tasklist.id } } },
                    })
                  }}
                  onUpdateTask={({ list, taskId, values }) => {
                    const prevTask = list.getItem(taskId)
                    if (prevTask) list.update(taskId, { ...prevTask, ...values })
                    updateTaskMutation.mutate({
                      where: { id: taskId },
                      data: values,
                    })
                  }}
                  onDeleteTask={({ list, taskId }) => {
                    list.remove(taskId)
                    deleteTaskMutation.mutate({ where: { id: taskId } })
                  }}
                  onReorder={({ reorderedIds }) => {
                    updateTasklistMutation.mutate({
                      where: { id: tasklist.id },
                      data: { task_order: reorderedIds },
                    })
                  }}
                  onInsert={({ task }) => {
                    updateTaskMutation.mutate({
                      where: { id: task.id },
                      data: {
                        tasklist: { connect: { id: tasklist.id } },
                        timeslot: { disconnect: true },
                      },
                    })
                    return {
                      ...task,
                      tasklist_id: tasklist.id,
                    }
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
