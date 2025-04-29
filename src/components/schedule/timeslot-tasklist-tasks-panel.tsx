"use client"

import { Task, Tasklist } from "@zenstackhq/runtime/models"
import { TaskStatus } from "@prisma/client"
import { createId } from "@paralleldrive/cuid2"
import TasksPanel, { TasksPanelProps } from "../task/tasks-panel"
import {
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
  // useUpdateTasklist,
} from "@/database/generated/hooks"
import { draftTask } from "@/lib/utils-task"

export default function TimeslotTasklistTasksPanel({
  tasklist,
}: {
  tasklist: Tasklist & { tasks: Task[] }
}) {
  // const updateTasklistMutation = useUpdateTasklist()
  const creatTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const creatableTaskStatuses: TaskStatus[] = ["TODO"]
  const selectableTaskStatuses: TaskStatus[] = ["TODO", "DONE", "DRAFT"]

  const handleCreateTask: TasksPanelProps["onCreateTask"] = ({ values, list }) => {
    const id = createId()
    list.prepend(draftTask({ id, tasklist_id: tasklist.id, ...values }))
    creatTaskMutation.mutate({
      data: { id, ...values, tasklist: { connect: { id: tasklist.id } } },
    })
  }

  const handleUpdateTask: TasksPanelProps["onUpdateTask"] = ({ list, taskId, values }) => {
    const prevTask = list.getItem(taskId)
    if (prevTask) {
      if (values.status === "DRAFT") list.remove(taskId)
      else list.update(taskId, { ...prevTask, ...values })
    }
    updateTaskMutation.mutate({
      where: { id: taskId },
      data: values,
    })
  }

  const handleDeleteTask: TasksPanelProps["onDeleteTask"] = ({ list, taskId }) => {
    list.remove(taskId)
    deleteTaskMutation.mutate({ where: { id: taskId } })
  }

  const handleReorder: TasksPanelProps["onReorder"] = ({}) => {
    // Do not reorder in database in this view
    // updateTasklistMutation.mutate({
    //   where: { id: tasklist.id },
    //   data: { task_order: reorderedIds },
    // })
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
      creatableTaskStatuses={creatableTaskStatuses}
      selectableTaskStatuses={selectableTaskStatuses}
      onCreateTask={handleCreateTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onReorder={handleReorder}
      onInsert={handleInsert}
    />
  )
}
