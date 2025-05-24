"use client"

import { Task, TaskStatus } from "@zenstackhq/runtime/models"
import { GripVerticalIcon } from "lucide-react"
import { Button, GridList, GridListItem, useDragAndDrop } from "react-aria-components"
import { AsyncListData } from "react-stately"
import { twMerge } from "tailwind-merge"
import { TaskItem, TaskItemValues } from "./task-item"
import { iconBox, interactive } from "@/styles/class-names"
import { useDeleteTask, useUpdateTask } from "@/database/generated/hooks"
import { taskStatusUIMap } from "@/lib/utils-task"

export function TaskGridList({
  list,
  selectableStatuses,
  handleReorder,
  isLoading,
  useOverdueColor,
}: {
  list: AsyncListData<Task>
  selectableStatuses: TaskStatus[]
  handleReorder: (reorderedIds: string[]) => void
  isLoading: boolean
  useOverdueColor?: boolean
}) {
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => {
      return [...keys].map((key) => {
        const item = list.getItem(key)
        return {
          "text/plain": item?.title ?? "-",
          "task": JSON.stringify(item),
        }
      })
    },
    renderDragPreview: (dragItems) => {
      const processedItems = dragItems
        .filter((item) => item.task)
        .map((item) => {
          return JSON.parse(item.task)
        })
      return (
        <div className="max-w-xs truncate rounded-md border bg-neutral-100 px-8 py-2 font-semibold">
          {processedItems.length > 1 ? `${processedItems.length} tasks` : processedItems[0].title}
        </div>
      )
    },
    onReorder: (e) => {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys)
      }
      if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys)
      }
    },
    onDragEnd: (e) => {
      let newOrder = list.items.map((item) => item.id)
      if (e.dropOperation === "move" && !e.isInternal) {
        list.remove(...e.keys)
        newOrder = newOrder.filter((id) => ![...e.keys].includes(id))
      }
      handleReorder(newOrder)
    },
  })

  const onUpdateTask = (taskId: string, values: TaskItemValues) => {
    const prevTask = list.getItem(taskId)
    if (!prevTask) return
    list.update(taskId, { ...prevTask, ...values })
    updateTaskMutation.mutate({
      where: { id: taskId },
      data: values,
    })
  }

  const onDeleteTask = (taskId: string) => {
    list.remove(taskId)
    deleteTaskMutation.mutate({ where: { id: taskId } })
  }

  return (
    <GridList
      aria-label="Tasks"
      dragAndDropHooks={dragAndDropHooks}
      items={list.items}
      selectionMode="multiple"
      selectedKeys={list.selectedKeys}
      onSelectionChange={list.setSelectedKeys}
      selectionBehavior="replace"
      className="flex flex-col gap-2"
      renderEmptyState={() => (
        <div className={"p-8 text-neutral-500"}>{isLoading ? "Loading..." : "No tasks"}</div>
      )}
    >
      {(task) => {
        const statusUI = taskStatusUIMap[task.status]
        return (
          <GridListItem
            id={task.id}
            textValue={task.title}
            className={twMerge(
              "group/task-grid-list-item",
              "flex items-start rounded-md p-4",
              "data-selected:rounded-l-none data-selected:border-l-2",
              "hover:bg-neutral-50",
              "!outline-0 focus-visible:bg-neutral-100",
              "box-content"
            )}
            style={{
              borderColor: `var(--bb-${statusUI.color}-500)`,
            }}
          >
            <Button slot="drag" className={twMerge(iconBox(), interactive(), "text-neutral-400")}>
              <GripVerticalIcon />
            </Button>
            <TaskItem
              task={task}
              onDelete={() => onDeleteTask(task.id)}
              onUpdate={(values) => onUpdateTask(task.id, values)}
              selectableStatuses={selectableStatuses}
              useOverdueColor={useOverdueColor}
            />
          </GridListItem>
        )
      }}
    </GridList>
  )
}
