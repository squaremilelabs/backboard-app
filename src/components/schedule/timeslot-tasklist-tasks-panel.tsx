"use client"
import { Task, Tasklist, Timeslot } from "@zenstackhq/runtime/models"
import { TaskStatus } from "@prisma/client"
import TasksPanel, { TasksPanelProps } from "../task/tasks-panel"
import { EmojiDynamic } from "../common/emoji"
import { useDeleteTask, useUpdateTask } from "@/database/generated/hooks"

export default function TimeslotTasklistTasksPanel({
  tasklist,
  timeslot,
  refreshKey,
  className,
}: {
  tasklist: Tasklist & { tasks: Task[] }
  timeslot: Timeslot
  refreshKey: number
  className: TasksPanelProps["className"]
}) {
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const selectableTaskStatuses: TaskStatus[] = ["TODO", "DRAFT"]

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
      defaultExpanded={false}
      className={className}
      uid={`schedule/timeslot/${timeslot.id}/tasklist/${tasklist.id}`}
      key={refreshKey}
      tasks={tasklist.tasks}
      order={tasklist.task_order}
      headerContent={
        <div className="flex items-center gap-8">
          <EmojiDynamic unified="1f4dd" size={16} />
          <p className="font-medium text-neutral-700">Triage</p>
        </div>
      }
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
