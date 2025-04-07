import { Button, GridList, GridListItem } from "react-aria-components"
import { ChevronDown, GripVertical } from "lucide-react"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Task } from "@prisma/client"
import { twMerge } from "tailwind-merge"
import { Tasklist } from "@zenstackhq/runtime/models"
import {
  useCreateTask,
  useFindManyTask,
  useUpdateTask,
  useUpdateTasklist,
} from "@/database/generated/hooks"
import CreateByTitleLine from "@/components/common/CreateByTitleLine"
import TaskItem from "@/components/task/TaskItem"
import useDragAndDropList from "@/hooks/useDragAndDropList"

export default function TasklistTasksContent({ tasklist }: { tasklist: Tasklist }) {
  const { user } = useUser()
  const createTask = useCreateTask()
  const [doneTasksExpanded, setDoneTasksExpanded] = useState(false)

  const undoneTasksQuery = useFindManyTask({
    where: { tasklist_id: tasklist.id, status: { not: "DONE" }, archived_at: null },
  })
  const undoneTasks = undoneTasksQuery.data ?? []

  const doneTasksQuery = useFindManyTask({
    where: { tasklist_id: tasklist.id, status: "DONE", archived_at: null },
    orderBy: { done_at: "desc" },
  })
  const doneTasks = doneTasksQuery.data ?? []

  const hasDoneTasks = doneTasks.length > 0
  const hasTasks = undoneTasks.length > 0 || hasDoneTasks

  return (
    <div className="bg-canvas flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex flex-col">
        {undoneTasksQuery.isSuccess ? (
          <ReordableTasks tasks={undoneTasks} tasklist={tasklist} />
        ) : null}
        <CreateByTitleLine
          createMutation={createTask}
          additionalData={{
            topic: { connect: { id: tasklist.topic_id } },
            tasklist: { connect: { id: tasklist.id, topic_id: tasklist.topic_id } },
            created_by: { connect: { id: user?.id } },
          }}
          placeholder={hasTasks ? "New Task" : "Add First Task"}
        />
      </div>
      {hasDoneTasks && (
        <div className="flex flex-col gap-2">
          <Button
            onPress={() => setDoneTasksExpanded((prev) => !prev)}
            className={twMerge(
              "flex items-center gap-1 rounded-lg px-2 py-1",
              "focus-visible:text-gold-500 !outline-0",
              doneTasksExpanded
                ? "mt-2 rounded-b-none border-b pb-2 font-semibold text-neutral-950"
                : "self-start border text-neutral-500"
            )}
          >
            <ChevronDown
              size={16}
              className={twMerge(doneTasksExpanded ? "rotate-0" : "-rotate-90")}
            />
            <p className="text-sm">{doneTasks.length} done</p>
          </Button>
          {doneTasksExpanded ? <DoneTasks tasklist={tasklist} tasks={doneTasks} /> : null}
        </div>
      )}
    </div>
  )
}

const taskGridListClassName = twMerge(
  "flex items-start p-2 rounded-lg outline-neutral-200 hover:outline-2"
)

function ReordableTasks({ tasklist, tasks }: { tasklist: Tasklist; tasks: Task[] }) {
  const updateTaskList = useUpdateTasklist()
  const updateTask = useUpdateTask()
  const savedOrder = tasklist.later_task_order
  const { list, dragAndDropHooks } = useDragAndDropList({
    itemType: "task",
    items: tasks,
    savedOrder,
    handleOrderChange: (newOrder) => {
      updateTaskList.mutate({
        where: { id: tasklist.id },
        data: { later_task_order: newOrder },
      })
    },
    handleInsert: ([task]) => {
      updateTask.mutate({
        where: { id: task.id },
        data: {
          tasklist: { connect: { id: tasklist.id } },
        },
      })
    },
  })
  return (
    <GridList
      aria-label="Reorderable To-Do Tasks"
      items={list.items}
      dragAndDropHooks={dragAndDropHooks}
    >
      {(task) => (
        <GridListItem className={taskGridListClassName} textValue={task.title}>
          <Button
            slot="drag"
            className="focus-visible:text-gold-500 cursor-grab text-neutral-500 !outline-0"
          >
            <GripVertical size={20} />
          </Button>
          <TaskItem task={task} tasklist={tasklist} />
        </GridListItem>
      )}
    </GridList>
  )
}

function DoneTasks({ tasklist, tasks }: { tasklist: Tasklist; tasks: Task[] }) {
  return (
    <GridList aria-label="Done Tasks by Done Date" className="flex flex-col" items={tasks}>
      {(task) => (
        <GridListItem className={taskGridListClassName} textValue={task.title}>
          <TaskItem task={task} tasklist={tasklist} />
        </GridListItem>
      )}
    </GridList>
  )
}
