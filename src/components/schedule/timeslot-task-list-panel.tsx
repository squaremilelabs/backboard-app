"use client"

import { Link } from "react-aria-components"
import { XIcon } from "lucide-react"
import { EmojiStyle } from "emoji-picker-react"
import TaskListPanel from "../task/task-list-panel"
import { EmojiDynamic } from "../common/emoji-dynamic"
import { defaultTasklistEmojiCode } from "../tasklist/utilities"
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
      key={JSON.stringify({ [timeslotId]: timeslotQuery.dataUpdatedAt })}
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
      defaultTaskValues={{
        timeslot_id: timeslotId,
        tasklist_id: tasklist?.id,
        timeslot_tasklist_id: tasklist?.id,
      }}
      disabledStatuses={["DRAFT"]}
      onCreateTask={
        timeslotStatus !== "past"
          ? (values) => {
              createTaskMutation.mutate({
                data: {
                  ...values,
                  tasklist: { connect: { id: tasklist.id } },
                },
              })
            }
          : undefined
      }
      onUpdateTask={(id, values) => {
        updateTaskMutation.mutate({
          where: { id },
          data: {
            ...values,
            completed_at: values.status
              ? values.status === "DONE"
                ? new Date()
                : null
              : undefined,
            timeslot: values.status
              ? values.status === "DONE"
                ? { connect: { id: timeslotId } }
                : { disconnect: true }
              : undefined,
          },
        })
      }}
      onDeleteTask={(id) => {
        deleteTaskMutation.mutate({ where: { id } })
      }}
      onReorder={(reorderedIds) => {
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
