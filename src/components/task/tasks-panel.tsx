"use client"
import { Task } from "@zenstackhq/runtime/models"
import { ListData, useListData } from "react-stately"
import {
  Button,
  Disclosure,
  DisclosurePanel,
  GridList,
  GridListItem,
  Heading,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { ChevronDownIcon, GripVerticalIcon } from "lucide-react"
import { TaskStatus } from "@prisma/client"
import { useSessionStorage } from "usehooks-ts"
import { useRef } from "react"
import TaskSummary from "./task-summary"
import TaskCreate, { TaskCreateValues } from "./task-create"
import TaskItem, { TaskItemValues } from "./task-item"
import { sortItemsByOrder } from "@/lib/utils-common"
import { useDragAndDropHooks, useDroppableProps } from "@/lib/drag-and-drop"

export interface TasksPanelProps {
  uid: string
  tasks: Task[]
  order: string[]
  onCreateTask: (params: { list: ListData<Task>; values: TaskCreateValues }) => void
  onUpdateTask: (params: { list: ListData<Task>; taskId: string; values: TaskItemValues }) => void
  onDeleteTask: (params: { list: ListData<Task>; taskId: string }) => void
  onReorder: (params: { reorderedIds: string[] }) => void
  onInsert?: (params: { task: Task }) => Task
  headerContent: React.ReactNode
  isCollapsible?: boolean
  isLoading?: boolean
  selectableTaskStatuses: TaskStatus[]
  creatableTaskStatuses: TaskStatus[]
}

export default function TasksPanel({
  uid,
  tasks,
  order,
  onCreateTask,
  onUpdateTask,
  onReorder,
  onInsert,
  onDeleteTask,
  selectableTaskStatuses,
  creatableTaskStatuses,
  isCollapsible,
  headerContent,
  isLoading,
}: TasksPanelProps) {
  const list = useListData({
    initialItems: sortItemsByOrder({ items: tasks, order }),
  })

  const handleCreate = (values: TaskCreateValues) => {
    onCreateTask({ list, values })
  }

  const handleUpdate = (taskId: string, values: TaskItemValues) => {
    onUpdateTask({ list, values, taskId })
  }

  const handleDelete = (taskId: string) => {
    onDeleteTask({ list, taskId })
  }

  const handleInsert = onInsert
    ? (tasks: Task[]) => {
        const updatedTask = onInsert({ task: tasks[0] })
        return [updatedTask]
      }
    : undefined

  const handleReorder = (reorderedIds: string[]) => {
    onReorder({ reorderedIds })
  }

  const dragAndDropHooks = useDragAndDropHooks({
    list,
    itemKind: "task",
    handleReorder,
    handleInsert,
    renderDragPreview: (tasks) => {
      const task = tasks[0]
      return <div className="bg-canvas rounded-xl border px-8 py-4">{task.title}</div>
    },
  })

  const dropRef = useRef<HTMLDivElement>(null)
  const { dropProps, isDropTarget } = useDroppableProps<Task>({
    ref: dropRef,
    acceptedItemKind: onInsert ? "task" : "NONE",
    handleDrop: (tasks) => {
      const task = tasks[0]
      if (onInsert) {
        list.prepend(task)
        onInsert({ task })
      }
    },
  })

  const isEmpty = !isLoading && list.items.length === 0

  const [isExpanded, setIsExpanded] = useSessionStorage(
    `expanded/task-list-${uid}`,
    isCollapsible ? false : true
  )

  return (
    <Disclosure
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
      className={twMerge(
        "group",
        "flex flex-col",
        "rounded-xl border-2 bg-neutral-100 p-4",
        "box-content",
        isDropTarget ? "outline" : null
      )}
    >
      <Heading
        ref={dropRef}
        tabIndex={onInsert ? 0 : undefined}
        role={onInsert ? "list" : undefined}
        {...dropProps}
        className={twMerge(
          "flex items-center px-8 py-4",
          "gap-4 rounded-xl",
          "group-data-expanded:outline-0"
        )}
      >
        <div className="flex grow">{headerContent}</div>
        <TaskSummary tasks={list.items} />
        {isCollapsible ? (
          <Button
            slot="trigger"
            className={twMerge(
              "flex size-20 items-center justify-center",
              "cursor-pointer rounded-md hover:bg-neutral-200"
            )}
          >
            <ChevronDownIcon
              size={20}
              className={twMerge(
                "rotate-90",
                "group-data-expanded:rotate-0",
                "transition-transform"
              )}
            />
          </Button>
        ) : null}
      </Heading>
      <DisclosurePanel>
        <div
          className={twMerge(
            "bg-canvas flex flex-col rounded-[12px] border p-16",
            isEmpty ? "gap-0" : "gap-8"
          )}
        >
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              <TaskCreate onSubmit={handleCreate} selectableTaskStatuses={creatableTaskStatuses} />
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
                        selectableStatuses={selectableTaskStatuses}
                      />
                    </GridListItem>
                  )
                }}
              </GridList>
            </>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
