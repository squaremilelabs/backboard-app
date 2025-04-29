"use client"
import { createId } from "@paralleldrive/cuid2"
import { Task, Tasklist } from "@zenstackhq/runtime/models"
import TasklistItem from "../tasklist/tasklist-item"
import { draftTask } from "@/lib/utils-task"
import {
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
  useUpdateTasklist,
} from "@/database/generated/hooks"
import TaskListPanel from "@/components/task/tasks-panel"

export default function TasklistTasksPanel({
  tasklist,
}: {
  tasklist: Tasklist & { tasks: Task[] }
}) {
  const updateTasklistMutation = useUpdateTasklist()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

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
      selectableTaskStatuses={["TODO", "DRAFT", "DONE"]}
      creatableTaskStatuses={["TODO", "DRAFT"]}
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
}
