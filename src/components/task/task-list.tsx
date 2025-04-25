import { Task, TaskStatus } from "@prisma/client"
import { Button, DragAndDropHooks, GridList, GridListItem } from "react-aria-components"
import { GripVerticalIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { Prisma } from "@zenstackhq/runtime/models"
import TaskItemContent from "./task-item-content"

export default function TaskList({
  label,
  tasks,
  isLoading,
  dragAndDropHooks,
  onUpdateTask,
  disabledStatuses,
}: {
  label: string
  tasks: Task[] | undefined
  isLoading: boolean
  dragAndDropHooks?: DragAndDropHooks
  onUpdateTask: (id: string, input: Prisma.TaskUpdateInput) => void
  disabledStatuses?: TaskStatus[]
}) {
  return (
    <GridList
      aria-label={label}
      items={tasks}
      selectionMode="none"
      dragAndDropHooks={dragAndDropHooks}
      className={"flex flex-col gap-4"}
      renderEmptyState={() => (
        <div
          className={twMerge(
            "flex items-center justify-center rounded-md border p-16",
            isLoading ? "text-neutral-600" : "text-neutral-950"
          )}
        >
          {isLoading ? "Loading..." : "None"}
        </div>
      )}
    >
      {(task) => {
        return (
          <GridListItem
            id={task.id}
            textValue={task.title}
            className={twMerge(
              "flex items-start rounded-md",
              "outline-neutral-300",
              "focus-within:outline-2",
              "has-[button[data-pressed]]:outline-2"
            )}
          >
            <Button
              slot="drag"
              className="!pointer-events-auto flex size-28 min-w-28 cursor-move items-center justify-center rounded-md
                hover:bg-neutral-100"
            >
              <GripVerticalIcon size={16} className="cursor-move text-neutral-400" />
            </Button>
            <TaskItemContent
              task={task}
              onValuesChange={(values) => onUpdateTask(task.id, values)}
              disabledStatuses={disabledStatuses}
            />
          </GridListItem>
        )
      }}
    </GridList>
  )
}
