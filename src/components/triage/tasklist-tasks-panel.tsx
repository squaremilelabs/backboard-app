"use client"
import { createId } from "@paralleldrive/cuid2"
import { Task, Tasklist } from "@zenstackhq/runtime/models"
import TasklistItem from "@/components/primitives/tasklist/tasklist-item"
import { draftTask } from "@/lib/utils-task"
import {
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
  useUpdateTasklist,
} from "@/database/generated/hooks"
import TasksPanel, { TasksPanelProps } from "@/components/primitives/task/tasks-panel"

export default function TasklistTasksPanel({
  tasklist,
  refreshKey,
}: {
  tasklist: Tasklist & { tasks: Task[] }
  refreshKey: number
}) {
  const updateTasklistMutation = useUpdateTasklist()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const handleCreateTask: TasksPanelProps["onCreateTask"] = ({ values, list }) => {
    const id = createId()
    list.prepend(draftTask({ id, tasklist_id: tasklist.id, ...values }))
    createTaskMutation.mutate({
      data: { id, ...values, tasklist: { connect: { id: tasklist.id } } },
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
    updateTasklistMutation.mutate({
      where: { id: tasklist.id },
      data: { task_order: reorderedIds },
    })
  }

  const handleInsert: TasksPanelProps["onInsert"] = ({ task }) => {
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
  }

  return (
    <TasksPanel
      uid={`triage/tasklist/${tasklist.id}`}
      key={refreshKey}
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
      selectableTaskStatuses={["TODO", "DRAFT", "DONE"]}
      creatableTaskStatuses={["DRAFT", "TODO"]}
      onCreateTask={handleCreateTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onReorder={handleReorder}
      onInsert={handleInsert}
    />
  )
}
