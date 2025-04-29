import { Task, Tasklist, Timeslot } from "@zenstackhq/runtime/models"
import { createId } from "@paralleldrive/cuid2"
import { TaskStatus } from "@prisma/client"
import TasksPanel, { TasksPanelProps } from "../task/tasks-panel"
import TasklistItem from "../tasklist/tasklist-item"
import { getTimeslotStatus } from "@/lib/utils-timeslot"
import { draftTask } from "@/lib/utils-task"
import {
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
  useUpdateTimeslot,
} from "@/database/generated/hooks"

export default function TimeslotTasksPanel({
  timeslot,
}: {
  timeslot: Timeslot & { tasklist: Tasklist & { tasks: Task[] } }
}) {
  const updateTimeslotMutation = useUpdateTimeslot()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const timeslotOrder = timeslot?.task_order || []
  const tasklistOrder = timeslot.tasklist?.task_order || []
  const order = timeslotOrder.length > 0 ? timeslotOrder : tasklistOrder

  const timeslotStatus = getTimeslotStatus({
    date: timeslot?.date_string,
    startTime: timeslot?.start_time_string,
    endTime: timeslot?.end_time_string,
  })

  const displayedTasks =
    timeslotStatus === "past"
      ? timeslot.tasklist.tasks.filter((task) => task.status === "DONE")
      : timeslot.tasklist.tasks

  const creatableTaskStatuses: TaskStatus[] = timeslotStatus === "past" ? ["DONE"] : ["TODO"]

  const selectableTaskStatuses: TaskStatus[] =
    timeslotStatus !== "future" ? ["TODO", "DONE", "DRAFT"] : ["TODO", "DRAFT"]

  const handleCreateTask: TasksPanelProps["onCreateTask"] =
    timeslotStatus === "past"
      ? undefined
      : ({ list, values }) => {
          const id = createId()
          list.prepend(
            draftTask({
              id,
              tasklist_id: timeslot.tasklist.id,
              timeslot_id: values.status === "DONE" ? timeslot.id : undefined,
              timeslot_tasklist_id: values.status === "DONE" ? timeslot.tasklist.id : undefined,
              ...values,
            })
          )
          createTaskMutation.mutate({
            data: {
              ...values,
              tasklist: { connect: { id: timeslot.tasklist.id } },
              timeslot:
                values.status === "DONE" ? { connect: { id: timeslot.tasklist.id } } : undefined,
            },
          })
        }

  return (
    <TasksPanel
      uid={`schedule/timeslot/${timeslot.id}`}
      tasks={displayedTasks}
      order={order}
      headerContent={<TasklistItem tasklist={timeslot.tasklist} />}
      emptyContent={
        timeslotStatus === "past" ? <p>No tasks were completed in this timeslot 👎</p> : undefined
      }
      creatableTaskStatuses={creatableTaskStatuses}
      selectableTaskStatuses={selectableTaskStatuses}
      onCreateTask={handleCreateTask}
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
                ? { connect: { id: timeslot.id } }
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
          where: { id: timeslot.id },
          data: { task_order: reorderedIds },
        })
      }}
    />
  )
}
