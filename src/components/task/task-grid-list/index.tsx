import { Task } from "@zenstackhq/runtime/models"
import { useListData } from "react-stately"
import { createId } from "@paralleldrive/cuid2"
import { Button, GridList, GridListItem } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { GripVerticalIcon } from "lucide-react"
import { TaskStatus } from "@prisma/client"
import TaskCreateInput, { TaskCreateValues } from "./internal/task-create-input"
import TaskItem, { TaskItemValues } from "./internal/task-item"
import { sortItemsByOrder } from "@/lib/utils"
import { useDragAndDropHooks } from "@/lib/common/drag-and-drop"

export default function TaskGridList({
  tasks,
  order,
  onCreateTask,
  onUpdateTask,
  onReorder,
  onInsert,
  onDeleteTask,
  defaultValues,
  disabledStatuses,
}: {
  tasks: Task[]
  order: string[]
  onCreateTask?: (values: TaskCreateValues & { id: string }) => void
  defaultValues?: Partial<Task>
  onUpdateTask?: (taskId: string, values: TaskItemValues) => void
  onDeleteTask?: (taskId: string) => void
  onReorder?: (reorderedIds: string[]) => void
  onInsert?: (insertedTask: Task) => void
  disabledStatuses?: TaskStatus[]
}) {
  const list = useListData({
    initialItems: sortItemsByOrder({ items: tasks, order }),
  })

  const dragAndDropHooks = useDragAndDropHooks({
    list,
    itemKind: "task",
    handleReorder: onReorder,
    handleInsert: (tasks) => {
      if (onInsert) onInsert(tasks[0])
    },
  })

  const handleCreate = (values: TaskCreateValues) => {
    const id = createId()
    list.prepend({
      id,
      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: "UNKNOWN",
      archived_at: null,
      content: null,
      tasklist_id: null,
      timeslot_tasklist_id: null,
      completed_at: null,
      timeslot_id: null,
      ...defaultValues,
      ...values,
    })
    if (onCreateTask) onCreateTask({ id, ...values })
  }

  const handleUpdate = (taskId: string, values: TaskItemValues) => {
    const prevItem = list.getItem(taskId)
    if (prevItem) {
      list.update(taskId, { ...prevItem, updated_at: new Date(), ...values })
    }
    if (onUpdateTask) onUpdateTask(taskId, values)
  }

  const handleDelete = (taskId: string) => {
    list.remove(taskId)
    if (onDeleteTask) onDeleteTask(taskId)
  }

  return (
    <div className="flex flex-col gap-8">
      <TaskCreateInput onSubmit={handleCreate} disabledStatuses={disabledStatuses} />
      <GridList
        aria-label="Task List"
        items={list.items}
        selectionMode="none"
        dragAndDropHooks={dragAndDropHooks}
        className={"flex flex-col"}
      >
        {(task) => {
          return (
            <GridListItem
              id={task.id}
              textValue={task.title}
              className={twMerge("flex items-start gap-4 rounded-md p-4")}
            >
              <Button
                slot="drag"
                className={twMerge(
                  "flex h-20 min-w-fit items-center rounded-md",
                  "!pointer-events-auto cursor-move hover:bg-neutral-100",
                  "text-neutral-400"
                )}
              >
                <GripVerticalIcon size={16} />
              </Button>
              <TaskItem
                task={task}
                onUpdate={(values) => handleUpdate(task.id, values)}
                onDelete={() => handleDelete(task.id)}
                disabledStatuses={disabledStatuses}
              />
            </GridListItem>
          )
        }}
      </GridList>
    </div>
  )
}
