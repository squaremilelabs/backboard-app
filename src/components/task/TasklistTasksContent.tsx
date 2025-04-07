import { Button, GridList, GridListItem, useDragAndDrop } from "react-aria-components"
import { ChevronDown, GripVertical } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Task } from "@prisma/client"
import { twMerge } from "tailwind-merge"
import { useAsyncList } from "react-stately"
import { Tasklist } from "@zenstackhq/runtime/models"
import { useCreateTask, useFindManyTask, useUpdateTasklist } from "@/database/generated/hooks"
import { isEqualArrays } from "@/lib/utils"
import CreateByTitleLine from "@/components/common/CreateByTitleLine"
import TaskItem from "@/components/task/TaskItem"

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
        <ReordableTasks tasks={undoneTasks} tasklist={tasklist} />
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

  const savedOrder = tasklist.later_task_order
  const list = useAsyncList({
    load: () => {
      const sortedTasks = tasks.sort((a, b) => {
        const aIndex = savedOrder.indexOf(a.id)
        const bIndex = savedOrder.indexOf(b.id)
        if (aIndex !== -1 && bIndex === -1) return -1
        if (aIndex === -1 && bIndex !== -1) return 1
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
        if (a.created_at < b.created_at) return -1
        if (a.created_at > b.created_at) return 1
        return 0
      })
      return { items: sortedTasks }
    },
    getKey: (task) => task.id,
  })

  // Reload list when items are added or removed
  useEffect(() => {
    if (list.loadingState === "idle") {
      if (tasks.length !== list.items.length) {
        list.reload()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks])

  // Function to be passed to onDragEnd to save task order
  const saveTaskOrder = (newOrder: string[]) => {
    if (isEqualArrays(newOrder, savedOrder)) return
    updateTaskList.mutate({
      where: { id: tasklist.id },
      data: { later_task_order: newOrder },
    })
  }

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ "text/plain": list.getItem(key as string)?.title ?? "" })),
    onReorder: (e) => {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys)
      }
      if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys)
      }
    },
    onDragEnd: () => {
      const newOrder = list.items.map(({ id }) => id)
      saveTaskOrder(newOrder)
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
