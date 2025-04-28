"use client"
import { Link } from "react-aria-components"
import { XIcon } from "lucide-react"
import { createId } from "@paralleldrive/cuid2"
import TaskListPanel from "../task/tasks-panel"
import TasklistItem from "../tasklist/tasklist-item"
import { draftTask } from "@/lib/utils-task"
import {
  useCreateTask,
  useDeleteTask,
  useFindUniqueTimeslot,
  useUpdateTask,
  useUpdateTimeslot,
} from "@/database/generated/hooks"
import { useScheduleParams } from "@/lib/schedule"
import { getTimeslotStatus } from "@/lib/utils-timeslot"

export default function TimeslotTasksPanel({ timeslotId }: { timeslotId: string }) {
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
            <XIcon size={20} />
          </Link>
          <TasklistItem tasklist={tasklist} />
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
