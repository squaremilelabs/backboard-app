"use client"

import { Task } from "@zenstackhq/runtime/models"
import { TaskStatus, Timeslot } from "@prisma/client"
import { parse } from "date-fns"
import { createId } from "@paralleldrive/cuid2"
import { EmojiStyle } from "emoji-picker-react"
import { useRouter } from "next/navigation"
import { Button } from "react-aria-components"
import { CalendarX2Icon } from "lucide-react"
import TasksPanel, { TasksPanelProps } from "@/components/primitives/task/tasks-panel"
import { EmojiDynamic } from "@/components/primitives/common/emoji"
import {
  useCreateTask,
  useDeleteTask,
  useDeleteTimeslot,
  useUpdateTask,
  useUpdateTimeslot,
} from "@/database/generated/hooks"
import { formatDate } from "@/lib/utils-common"
import { draftTask } from "@/lib/utils-task"
import { getTimeslotStatus } from "@/lib/utils-timeslot"
import { useScheduleParams } from "@/lib/schedule-params"

export default function TimslotTasksPanel({
  timeslot,
  className,
}: {
  timeslot: Timeslot & { tasks: Task[] }
  className: TasksPanelProps["className"]
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
  const selectableTaskStatuses: TaskStatus[] = ["TODO", "DRAFT", "DONE"]

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

  // Delete timeslot
  const router = useRouter()
  const { closeTimeslotHref } = useScheduleParams()
  const deleteTimeslot = useDeleteTimeslot()
  const handleDeleteTimeslot = () => {
    router.push(closeTimeslotHref)
    deleteTimeslot.mutate({
      where: { id: timeslot.id },
    })
  }

  const timeslotTitle = formatDate(parse(timeslot.date_string, "yyyy-MM-dd", new Date()), {
    withWeekday: true,
  })

  return (
    <TasksPanel
      isCollapsible
      defaultExpanded
      uid={`schedule/timeslot/${timeslot.id}`}
      className={className}
      tasks={timeslot.tasks}
      order={timeslot.task_order}
      headerContent={
        <div className="flex grow items-center gap-8">
          <EmojiDynamic unified="1f5d3-fe0f" size={16} emojiStyle={EmojiStyle.APPLE} />
          <p className="font-medium">{timeslotTitle}</p>
          <div className="grow" />
          <Button
            onPress={handleDeleteTimeslot}
            className="flex cursor-pointer items-center gap-4 rounded-md px-4 text-neutral-500 hover:text-red-700"
          >
            <CalendarX2Icon size={14} />
            Unschedule
          </Button>
        </div>
      }
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
