"use client"

import { Link } from "react-aria-components"
import { XIcon } from "lucide-react"
import { EmojiStyle } from "emoji-picker-react"
import { createId } from "@paralleldrive/cuid2"
import TaskListPanel from "../task/task-list-panel"
import { EmojiDynamic } from "../common/emoji-dynamic"
import { defaultTasklistEmojiCode } from "../tasklist/utilities"
import { draftTask } from "../task/utilities"
import { useScheduleParams } from "./utilities"
import {
  useCreateTask,
  useDeleteTask,
  useFindUniqueTimeslot,
  useUpdateTask,
  useUpdateTimeslot,
} from "@/database/generated/hooks"
import { getTimeslotStatus } from "@/lib/utils"

export default function TimeslotPanel({ timeslotId }: { timeslotId: string }) {
  const timeslotQuery = useFindUniqueTimeslot({
    where: { id: timeslotId },
    include: {
      tasklist: {
        include: {
          tasks: {
            where: {
              OR: [{ status: "TODO" }, { status: "DONE", timeslot_id: timeslotId }],
            },
          },
        },
      },
    },
  })

  const updateTimeslotMutation = useUpdateTimeslot()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const timeslot = timeslotQuery.data
  const tasklist = timeslotQuery.data?.tasklist
  const tasks = tasklist?.tasks || []

  const timeslotOrder = timeslot?.task_order || []
  const tasklistOrder = tasklist?.task_order || []
  const order = timeslotOrder.length > 0 ? timeslotOrder : tasklistOrder

  const { closeTimeslotHref } = useScheduleParams()

  const timeslotStatus = timeslot
    ? getTimeslotStatus({
        date: timeslot?.date_string,
        startTime: timeslot?.start_time_string,
        endTime: timeslot?.end_time_string,
      })
    : null

  const displayedTasks =
    timeslotStatus === "past" ? tasks.filter((task) => task.status === "DONE") : tasks

  return timeslot && tasklist ? (
    <TaskListPanel
      uid={`schedule/timeslot/${timeslotId}`}
      key={`schedule/timeslot/${timeslotId}`}
      tasks={displayedTasks}
      order={order}
      headerContent={
        <div className="flex items-start gap-8">
          <Link href={closeTimeslotHref} className="cursor-pointer rounded-md hover:opacity-70">
            <XIcon size={16} />
          </Link>
          <EmojiDynamic
            unified={tasklist?.emoji?.code ?? defaultTasklistEmojiCode}
            emojiStyle={EmojiStyle.APPLE}
            size={16}
          />
          <p className="font-medium wrap-break-word">{tasklist?.title}</p>
        </div>
      }
      creatableTaskStatuses={timeslotStatus === "past" ? ["DONE"] : ["TODO"]}
      selectableTaskStatuses={
        timeslotStatus !== "future" ? ["TODO", "DONE", "DRAFT"] : ["TODO", "DRAFT"]
      }
      onCreateTask={({ list, values }) => {
        const id = createId()
        list.prepend(
          draftTask({
            id,
            tasklist_id: tasklist.id,
            timeslot_id: values.status === "DONE" ? timeslotId : undefined,
            timeslot_tasklist_id: values.status === "DONE" ? tasklist.id : undefined,
            ...values,
          })
        )
        createTaskMutation.mutate({
          data: {
            ...values,
            tasklist: { connect: { id: tasklist.id } },
            timeslot: values.status === "DONE" ? { connect: { id: timeslotId } } : undefined,
          },
        })
      }}
      onUpdateTask={({ list, taskId, values }) => {
        const prevTask = list.getItem(taskId)
        if (prevTask) list.update(taskId, { ...prevTask, ...values })
        if (timeslotStatus === "past" && values.status !== "DONE") {
          list.remove(taskId)
        }
        if (values.status === "DRAFT") {
          list.remove(taskId)
        }
        updateTaskMutation.mutate({
          where: { id: taskId },
          data: {
            ...values,
            timeslot: values.status
              ? values.status === "DONE"
                ? { connect: { id: timeslotId } }
                : { disconnect: true }
              : undefined,
          },
        })
      }}
      onDeleteTask={({ list, taskId }) => {
        list.remove(taskId)
        deleteTaskMutation.mutate({ where: { id: taskId } })
      }}
      onReorder={({ reorderedIds }) => {
        updateTimeslotMutation.mutate({
          where: { id: timeslotId },
          data: { task_order: reorderedIds },
        })
      }}
    />
  ) : (
    <div>Loading...</div>
  )
}
