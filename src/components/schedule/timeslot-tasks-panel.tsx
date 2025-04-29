"use client"

import { Task } from "@zenstackhq/runtime/models"
import { TaskStatus, Timeslot } from "@prisma/client"
import { parse } from "date-fns"
import { createId } from "@paralleldrive/cuid2"
import TasksPanel, { TasksPanelProps } from "../task/tasks-panel"
import {
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
  useUpdateTimeslot,
} from "@/database/generated/hooks"
import { formatDate, formatTimeString } from "@/lib/utils-common"
import { draftTask } from "@/lib/utils-task"
import { getTimeslotStatus } from "@/lib/utils-timeslot"

export default function TimslotTasksPanel({
  timeslot,
}: {
  timeslot: Timeslot & { tasks: Task[] }
}) {
  const timeslotStatus = getTimeslotStatus({
    date: timeslot.date_string,
    startTime: timeslot.start_time_string,
    endTime: timeslot.end_time_string,
  })

  const updateTimeslotMutation = useUpdateTimeslot()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const creatableTaskStatuses: TaskStatus[] = ["TODO"]
  const selectableTaskStatuses: TaskStatus[] = ["TODO", "DRAFT"]

  const handleCreateTask: TasksPanelProps["onCreateTask"] = ({ values, list }) => {
    const id = createId()
    list.prepend(draftTask({ id, timeslot_id: timeslot.id, ...values }))
    createTaskMutation.mutate({
      data: {
        id,
        ...values,
        tasklist: { connect: { id: timeslot.tasklist_id } },
        timeslot: { connect: { id: timeslot.id } },
      },
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
      data: {
        ...values,
        timeslot: values.status === "DRAFT" ? { disconnect: true } : undefined,
      },
    })
  }

  const handleDeleteTask: TasksPanelProps["onDeleteTask"] = ({ list, taskId }) => {
    list.remove(taskId)
    deleteTaskMutation.mutate({ where: { id: taskId } })
  }

  const handleReorder: TasksPanelProps["onReorder"] = ({ reorderedIds }) => {
    updateTimeslotMutation.mutate({
      where: { id: timeslot.id },
      data: { task_order: reorderedIds },
    })
  }

  const handleInsert: TasksPanelProps["onInsert"] = ({ task }) => {
    updateTaskMutation.mutate({
      where: { id: task.id },
      data: {
        timeslot: { connect: { id: timeslot.id } },
      },
    })
    return {
      ...task,
      timeslot_id: timeslot.id,
      timeslot_tasklist_id: timeslot.tasklist_id,
    }
  }

  const timeslotTitle = [
    formatDate(parse(timeslot.date_string, "yyyy-MM-dd", new Date()), { withWeekday: true }),
    formatTimeString(timeslot.start_time_string),
    "-",
    formatTimeString(timeslot.end_time_string),
  ].join(" ")

  return (
    <TasksPanel
      isCollapsible
      uid={`schedule/tasklist/${timeslot.id}`}
      tasks={timeslot.tasks}
      order={timeslot.task_order}
      headerContent={<div>{timeslotTitle}</div>}
      emptyContent={timeslotStatus === "past" ? <div>None</div> : undefined}
      creatableTaskStatuses={creatableTaskStatuses}
      selectableTaskStatuses={selectableTaskStatuses}
      onCreateTask={timeslotStatus !== "past" ? handleCreateTask : undefined}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onReorder={handleReorder}
      onInsert={handleInsert}
    />
  )
}
