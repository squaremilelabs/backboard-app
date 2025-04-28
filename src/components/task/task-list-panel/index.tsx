"use client"

import { Task } from "@zenstackhq/runtime/models"
import { useListData } from "react-stately"
import { createId } from "@paralleldrive/cuid2"
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
import TaskSummary from "../task-summary"
import TaskListPanelCreate, { TaskCreateValues } from "./internal/task-list-panel-create"
import TaskListPanelItem, { TaskItemValues } from "./internal/task-list-panel-item"
import { sortItemsByOrder } from "@/lib/utils"
import { useDragAndDropHooks, useDroppableProps } from "@/lib/common/drag-and-drop"

export default function TaskListPanel({
  uid,
  tasks,
  order,
  onCreateTask,
  onUpdateTask,
  onReorder,
  onInsert,
  onDeleteTask,
  defaultTaskValues,
  disabledStatuses,
  isCollapsible,
  headerContent,
  isLoading,
}: {
  uid: string
  tasks: Task[]
  order: string[]
  onCreateTask?: (values: TaskCreateValues & { id: string }) => void
  onUpdateTask: (taskId: string, values: TaskItemValues) => void
  onDeleteTask: (taskId: string) => void
  onReorder: (reorderedIds: string[]) => void
  onInsert?: (insertedTask: Task) => void
  defaultTaskValues?: Partial<Task>
  disabledStatuses?: TaskStatus[]
  headerContent?: React.ReactNode
  isCollapsible?: boolean
  isLoading?: boolean
}) {
  const list = useListData({
    initialItems: sortItemsByOrder({ items: tasks, order }),
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
      ...defaultTaskValues,
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

  const handleInsert = onInsert
    ? (tasks: Task[]) => {
        onInsert(tasks[0])
      }
    : undefined

  const handleReorder = onReorder

  const dragAndDropHooks = useDragAndDropHooks({
    list,
    itemKind: "task",
    handleReorder,
    handleInsert,
  })

  const dropRef = useRef<HTMLDivElement>(null)
  const { dropProps, isDropTarget } = useDroppableProps<Task>({
    ref: dropRef,
    acceptedItemKind: onInsert ? "task" : "NONE",
    handleDrop: (tasks) => {
      const task = tasks[0]
      if (onInsert) {
        list.prepend(task)
        onInsert(task)
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
        "rounded-lg border-2 bg-neutral-100",
        "data-expanded:rounded-xl data-expanded:border-2 data-expanded:p-4",
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
              "flex size-24 items-center justify-center",
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
              {onCreateTask ? (
                <TaskListPanelCreate
                  onSubmit={handleCreate}
                  disabledStatuses={disabledStatuses}
                  tasklistUid={uid}
                  tasklistIsEmpty={isEmpty}
                />
              ) : isEmpty ? (
                <div>No completed tasks...</div>
              ) : null}
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
                      <TaskListPanelItem
                        task={task}
                        onUpdate={(values) => handleUpdate(task.id, values)}
                        onDelete={() => handleDelete(task.id)}
                        disabledStatuses={disabledStatuses}
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
