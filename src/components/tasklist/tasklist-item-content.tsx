import { useState } from "react"
import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components"
import { Prisma, Task, Tasklist } from "@zenstackhq/runtime/models"
import { twMerge } from "tailwind-merge"
import { ChevronRightIcon } from "lucide-react"
import TaskList from "../task/task-list"
import EditableText from "../common/editable-text"
import CreateInput from "../common/create-input"
import { useUpdateTask, useUpdateTasklist } from "@/database/generated/hooks"
import useDragAndDropList from "@/hooks/useDragAndDropList"

export default function TasklistItemContent({
  tasklist,
}: {
  tasklist: Tasklist & { tasks: Task[] }
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const updateTasklistMutation = useUpdateTasklist()

  return (
    <Disclosure
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
      className={twMerge(
        "bg-canvas rounded-md border-2",
        "flex flex-col",
        isExpanded ? "gap-8 p-8" : "p-4"
      )}
    >
      <Heading className="flex grow items-start">
        <Button
          slot="trigger"
          className={twMerge(
            "flex cursor-pointer items-center rounded-lg p-8 hover:bg-neutral-100"
          )}
        >
          <ChevronRightIcon
            className={twMerge(
              "size-20 transition-transform",
              isExpanded ? "rotate-90" : "rotate-0"
            )}
          />
        </Button>
        <EditableText
          initialValue={tasklist.title}
          onSave={(title) =>
            updateTasklistMutation.mutate({ where: { id: tasklist.id }, data: { title } })
          }
          className={({}) => ["text-semibold grow rounded-lg p-8 hover:bg-neutral-100"]}
        />
      </Heading>
      <DisclosurePanel className={twMerge("flex flex-col gap-16", isExpanded ? "p-8 pt-0" : "")}>
        <div className="h-1 bg-neutral-200" />
        <CreateInput />
        <TasklistTasks tasklist={tasklist} />
      </DisclosurePanel>
    </Disclosure>
  )
}

function TasklistTasks({ tasklist }: { tasklist: Tasklist & { tasks: Task[] } }) {
  const updateTaskMutation = useUpdateTask()
  const onUpdateTask = (id: string, values: Prisma.TaskUpdateInput) => {
    updateTaskMutation.mutate({
      where: { id },
      data: values,
    })
  }

  const updateTasklistMutation = useUpdateTasklist()
  const { list: tasksList, dragAndDropHooks: tasksDragAndDropHooks } = useDragAndDropList({
    listKey: `tasklist/${tasklist.id}/tasks`,
    itemType: "task",
    items: tasklist.tasks,
    isPreintialized: true,
    isInitialized: true,
    order: tasklist.task_order,
    handleOrderChange: (order) => {
      updateTasklistMutation.mutate({ where: { id: tasklist.id }, data: { task_order: order } })
    },
    handleInsert: (tasks) => {
      const task = tasks[0]
      updateTaskMutation.mutate({
        where: { id: task.id },
        data: {
          tasklist: { connect: { id: tasklist.id } },
          timeslot: { disconnect: true },
          completed_at: null,
        },
      })
    },
  })
  return (
    <TaskList
      label={`${tasklist.title} Tasks`}
      tasks={tasksList.items}
      isLoading={false}
      dragAndDropHooks={tasksDragAndDropHooks}
      onUpdateTask={(id, input) => onUpdateTask(id, input)}
    />
  )
}
