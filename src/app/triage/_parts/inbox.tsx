"use client"
import { useUser } from "@clerk/nextjs"
import {
  useCreateTask,
  useDeleteTask,
  useFindManyTask,
  useFindUniqueUser,
  useUpdateTask,
  useUpdateUser,
} from "@/database/generated/hooks"
import TaskList from "@/components/task/task-list"

export default function Inbox() {
  const { user: authUser } = useUser()

  const userQuery = useFindUniqueUser({
    where: { id: authUser?.id ?? "NO_AUTH" },
  })

  const tasksQuery = useFindManyTask({
    where: { tasklist_id: null, completed_at: null },
  })

  const updateUserMutation = useUpdateUser()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const tasks = tasksQuery.data ?? []
  const user = userQuery.data ?? null
  const order = user?.inbox_task_order ?? []
  const isLoading = tasksQuery.isLoading || userQuery.isLoading

  return (
    <TaskList
      uid={"TRIAGE-INBOX"}
      key={JSON.stringify({ tasks: tasksQuery.dataUpdatedAt, order: userQuery.dataUpdatedAt })}
      tasks={tasks}
      order={order}
      isLoading={isLoading}
      disabledStatuses={["DONE"]}
      headerContent={
        <div className="flex items-center gap-4 text-lg font-medium">
          <span className="flex size-24 items-center justify-center rounded-md text-lg">📥</span>
          <span className="text-lg">Inbox</span>
        </div>
      }
      defaultTaskValues={{
        tasklist_id: null,
        timeslot_tasklist_id: null,
        timeslot_id: null,
        completed_at: null,
      }}
      onCreateTask={(values) => {
        createTaskMutation.mutate({
          data: values,
        })
      }}
      onUpdateTask={(id, values) => {
        updateTaskMutation.mutate({
          where: { id },
          data: values,
        })
      }}
      onDeleteTask={(id) => {
        deleteTaskMutation.mutate({ where: { id } })
      }}
      onReorder={(reorderedIds) => {
        updateUserMutation.mutate({
          where: { id: user?.id ?? "NO_USER" },
          data: { inbox_task_order: reorderedIds },
        })
      }}
      onInsert={(task) => {
        updateTaskMutation.mutate({
          where: { id: task.id },
          data: {
            tasklist: { disconnect: true },
            timeslot: { disconnect: true },
            completed_at: null,
          },
        })
      }}
    />
  )
}
