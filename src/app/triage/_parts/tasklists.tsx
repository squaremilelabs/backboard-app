"use client"
import { twMerge } from "tailwind-merge"
import { sub } from "date-fns"
import { Tasklist } from "@zenstackhq/runtime/models"
import { Task } from "@prisma/client"
import CreateInput from "@/components/common/create-input"
import {
  useCreateTask,
  useCreateTasklist,
  useDeleteTask,
  useFindManyTasklist,
  useUpdateTask,
  useUpdateTasklist,
} from "@/database/generated/hooks"
import TaskList from "@/components/task/task-list"
import { getTaskSummary } from "@/lib/task/utils"

const sevenDaysAgo = sub(new Date(), { days: 7 })

export default function Tasklists() {
  const tasklistsQuery = useFindManyTasklist({
    where: { archived_at: null },
    include: {
      tasks: {
        where: {
          OR: [{ completed_at: null }, { completed_at: { gte: sevenDaysAgo } }],
        },
      },
    },
  })

  const sortedTasklists = sortTasklists(tasklistsQuery.data ?? [])

  const createTasklistMutation = useCreateTasklist()
  const updateTasklistMutation = useUpdateTasklist()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const handleCreateTasklist = (title: string) => {
    createTasklistMutation.mutate({ data: { title } })
  }

  return (
    <div className={twMerge("h-full w-full", "flex flex-col gap-8")}>
      {tasklistsQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {sortedTasklists.map((tasklist) => {
            return (
              <TaskList
                uid={`TRIAGE-TASKLIST-${tasklist.id}`}
                key={JSON.stringify({ [tasklist.id]: tasklistsQuery.dataUpdatedAt })}
                tasks={tasklist.tasks}
                order={tasklist.task_order}
                isCollapsible
                headerContent={<div>{tasklist.title}</div>}
                defaultTaskValues={{
                  tasklist_id: tasklist.id,
                }}
                onCreateTask={(values) => {
                  createTaskMutation.mutate({
                    data: { ...values, tasklist: { connect: { id: tasklist.id } } },
                  })
                }}
                onUpdateTask={(id, values) => {
                  updateTaskMutation.mutate({
                    where: { id },
                    data: {
                      ...values,
                      completed_at: values.status === "DONE" ? new Date() : undefined,
                    },
                  })
                }}
                onDeleteTask={(id) => {
                  deleteTaskMutation.mutate({ where: { id } })
                }}
                onReorder={(reorderedIds) => {
                  updateTasklistMutation.mutate({
                    where: { id: tasklist.id },
                    data: { task_order: reorderedIds },
                  })
                }}
                onInsert={(task) => {
                  updateTaskMutation.mutate({
                    where: { id: task.id },
                    data: {
                      tasklist: { connect: { id: tasklist.id } },
                      timeslot: { disconnect: true },
                    },
                  })
                }}
              />
            )
          })}
          <CreateInput
            placeholder="Add Tasklist"
            className="px-8 py-8"
            onSubmit={handleCreateTasklist}
          />
        </>
      )}
    </div>
  )
}

const sortTasklists = (tasklists: (Tasklist & { tasks: Task[] })[]) => {
  return tasklists.sort((a, b) => {
    const aTasksSummary = getTaskSummary(a.tasks)
    const bTasksSummary = getTaskSummary(b.tasks)
    const aTodoMinutes = aTasksSummary.status.TODO.minutes
    const bTodoMinutes = bTasksSummary.status.TODO.minutes
    const aDraftMinutes = aTasksSummary.status.DRAFT.minutes
    const bDraftMinutes = bTasksSummary.status.DRAFT.minutes
    const aDoneMinutes = aTasksSummary.status.DONE.minutes
    const bDoneMinutes = bTasksSummary.status.DONE.minutes

    // Compare by TODO minutes in descending order
    if (bTodoMinutes !== aTodoMinutes) {
      return bTodoMinutes - aTodoMinutes
    }

    // Compare by DRAFT minutes in descending order
    if (bDraftMinutes !== aDraftMinutes) {
      return bDraftMinutes - aDraftMinutes
    }

    // Compare by DONE minutes in descending order
    if (bDoneMinutes !== aDoneMinutes) {
      return bDoneMinutes - aDoneMinutes
    }

    // Fallback to comparing by created_at in ascending order
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}
