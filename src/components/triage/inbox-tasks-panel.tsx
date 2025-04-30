"use client"
import { createId } from "@paralleldrive/cuid2"
import { useUser } from "@clerk/nextjs"
import { EmojiStyle } from "emoji-picker-react"
import { useEffect, useState } from "react"
import {
  useCreateTask,
  useDeleteTask,
  useFindManyTask,
  useFindUniqueUser,
  useUpdateTask,
  useUpdateUser,
} from "@/database/generated/hooks"
import TasksPanel, { TasksPanelProps } from "@/components/task/tasks-panel"
import { EmojiDynamic } from "@/components/common/emoji"
import { draftTask } from "@/lib/utils-task"

export default function InboxTasksPanel({
  className,
}: {
  className: TasksPanelProps["className"]
}) {
  const { user: authUser } = useUser()

  const userQuery = useFindUniqueUser({
    where: { id: authUser?.id ?? "NO_AUTH" },
  })

  const tasksQuery = useFindManyTask({
    where: { tasklist_id: null },
  })

  const updateUserMutation = useUpdateUser()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const tasks = tasksQuery.data ?? []
  const user = userQuery.data ?? null
  const order = user?.inbox_task_order ?? []
  const isLoading = tasksQuery.isLoading || userQuery.isLoading

  const handleCreateTask: TasksPanelProps["onCreateTask"] = ({ list, values }) => {
    const id = createId()
    list.prepend(draftTask({ id, ...values }))
    createTaskMutation.mutate({
      data: { id, ...values },
    })
  }

  const handleUpdateTask: TasksPanelProps["onUpdateTask"] = ({ list, taskId, values }) => {
    const prevTask = list.getItem(taskId)
    if (prevTask) list.update(taskId, { ...prevTask, ...values })
    updateTaskMutation.mutate({
      where: { id: taskId },
      data: values,
    })
  }

  const handleDeleteTask: TasksPanelProps["onDeleteTask"] = ({ list, taskId }) => {
    list.remove(taskId)
    deleteTaskMutation.mutate({ where: { id: taskId } })
  }

  const handleReorder: TasksPanelProps["onReorder"] = ({ reorderedIds }) => {
    updateUserMutation.mutate({
      where: { id: user?.id ?? "NO_USER" },
      data: { inbox_task_order: reorderedIds },
    })
  }

  const handleInsert: TasksPanelProps["onInsert"] = ({ task }) => {
    updateTaskMutation.mutate({
      where: { id: task.id },
      data: {
        tasklist: { disconnect: true },
        timeslot: { disconnect: true },
        status: "DRAFT",
      },
    })
    return {
      ...task,
      tasklist_id: null,
      timeslot_tasklist_id: null,
      timeslot_id: null,
      status: "DRAFT",
    }
  }

  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
    if (tasksQuery.isFetchedAfterMount) {
      setRefreshKey(new Date().getTime())
    }
    return () => setRefreshKey(0)
  }, [tasksQuery.isFetchedAfterMount])

  return (
    <TasksPanel
      uid={"triage/inbox"}
      key={refreshKey} // force re-render on success
      tasks={tasks}
      order={order}
      isLoading={isLoading}
      selectableTaskStatuses={["DRAFT"]}
      creatableTaskStatuses={["DRAFT"]}
      headerContent={
        <div className="flex items-center gap-8 text-lg font-medium">
          <EmojiDynamic unified="1f4e5" emojiStyle={EmojiStyle.APPLE} size={16} />
          <span className="font-medium">Inbox</span>
        </div>
      }
      onCreateTask={handleCreateTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onReorder={handleReorder}
      onInsert={handleInsert}
      isCollapsible
      defaultExpanded={false}
      className={className}
    />
  )
}
