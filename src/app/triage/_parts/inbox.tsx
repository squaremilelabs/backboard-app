"use client"
import { twMerge } from "tailwind-merge"
import { useId, useState } from "react"
import { Prisma, TaskStatus } from "@zenstackhq/runtime/models"
import { useUser } from "@clerk/nextjs"
import { createId } from "@paralleldrive/cuid2"
import CreateInput from "@/components/common/create-input"
import TaskStatusPopover from "@/components/task/task-status-popover"
import {
  useCreateTask,
  useFindManyTask,
  useFindUniqueUser,
  useUpdateTask,
  useUpdateUser,
} from "@/database/generated/hooks"
import useDragAndDropList from "@/hooks/useDragAndDropList"
import TaskList from "@/components/task/task-list"
import TaskStatusChip from "@/components/task/task-status-chip-OLD"
import { TaskSizeChip, TaskSizeSelect } from "@/components/task/task-size"
import { TaskStatusSelect } from "@/components/task/task-status"
import TaskGridList from "@/components/task/task-grid-list"

export default function Inbox() {
  const [newTaskValues, setNewTaskValues] = useState({
    status: "DRAFT" as TaskStatus,
    size_minutes: 5,
  })

  const { user: authUser } = useUser()

  const {
    data: user,
    isLoading: userIsLoading,
    isFetched: userIsFetched,
  } = useFindUniqueUser({
    where: { id: authUser?.id ?? "NO_AUTH" },
  })

  const {
    data: tasks,
    isLoading: tasksIsLoading,
    isFetched: tasksIsFetched,
  } = useFindManyTask({
    where: { tasklist_id: null, completed_at: null },
  })

  const updateUserMutation = useUpdateUser()
  const updateTaskMutation = useUpdateTask()
  const createTaskMutation = useCreateTask()

  const { list, dragAndDropHooks } = useDragAndDropList({
    listKey: "inbox/tasks",
    itemType: "task",
    items: tasks,
    isInitialized: userIsFetched && tasksIsFetched,
    order: user?.inbox_task_order,
    handleOrderChange: (order) => {
      updateUserMutation.mutate({ where: { id: user?.id }, data: { inbox_task_order: order } })
    },
    handleInsert: (tasks) => {
      const task = tasks[0]
      updateTaskMutation.mutate({
        where: { id: task.id },
        data: {
          tasklist: { disconnect: true },
          timeslot: { disconnect: true },
          status: "DRAFT",
          completed_at: null,
        },
      })
    },
  })

  const handleCreateTask = (title: string) => {
    const id = createId()
    createTaskMutation.mutate({
      data: { id, title, ...newTaskValues },
    })
  }

  const onUpdateTask = (id: string, values: Prisma.TaskUpdateInput) => {
    updateTaskMutation.mutate({
      where: { id },
      data: values,
    })
  }

  return (
    <div
      className={twMerge(
        "h-full w-full",
        "flex flex-col gap-16 p-16",
        "bg-canvas rounded-md border-2 border-neutral-200"
      )}
    >
      <h2 className="text-lg font-medium text-neutral-600">Inbox</h2>
      <div>
        <TaskGridList
          key={JSON.stringify({ tasks, order: user?.inbox_task_order })}
          tasks={tasks ?? []}
          order={user?.inbox_task_order ?? []}
          disabledStatuses={["DONE"]}
        />
      </div>
      {/* <CreateInput
        onSubmit={handleCreateTask}
        placeholder="Add task"
        endContent={
          <TaskStatusPopover
            initialValues={newTaskValues}
            onValuesChange={setNewTaskValues}
            disabledStatuses={["TODO", "DONE"]}
          />
        }
      />
      <TaskList
        label="Inbox Tasks"
        tasks={list.items}
        isLoading={tasksIsLoading || userIsLoading}
        dragAndDropHooks={dragAndDropHooks}
        onUpdateTask={onUpdateTask}
        disabledStatuses={["TODO", "DONE"]}
      /> */}
    </div>
  )
}
