"use client"

import { Task, Tasklist } from "@zenstackhq/runtime/models"
import { TaskStatus } from "@prisma/client"
import TasksPanel, { TasksPanelProps } from "../task/tasks-panel"
import { useDeleteTask, useUpdateTask, useUpdateTasklist } from "@/database/generated/hooks"

export default function TimeslotTasklistTasksPanel({
  tasklist,
}: {
  tasklist: Tasklist & { tasks: Task[] }
}) {
  const updateTasklistMutation = useUpdateTasklist()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const selectableTaskStatuses: TaskStatus[] = ["TODO", "DONE", "DRAFT"]

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
    updateTasklistMutation.mutate({
      where: { id: tasklist.id },
      data: { task_order: reorderedIds },
    })
  }

  const handleInsert: TasksPanelProps["onInsert"] = ({ task }) => {
    updateTaskMutation.mutate({
      where: { id: task.id },
      data: {
        timeslot: { disconnect: true },
      },
    })
    return {
      ...task,
      timeslot_id: null,
      timeslot_tasklist_id: null,
    }
  }

  return (
    <TasksPanel
      isCollapsible
      uid={`schedule/tasklist/${tasklist.id}`}
      tasks={tasklist.tasks}
      order={tasklist.task_order}
      headerContent={<div>Unscheduled</div>}
      emptyContent={<div>None</div>}
      creatableTaskStatuses={[]}
      selectableTaskStatuses={selectableTaskStatuses}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onReorder={handleReorder}
      onInsert={handleInsert}
    />
  )
}
