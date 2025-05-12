import { Task, TaskStatus } from "@zenstackhq/runtime/models"
import { GripVerticalIcon, SquareCheckIcon, SquareIcon } from "lucide-react"
import { Button, Checkbox, GridList, GridListItem, useDragAndDrop } from "react-aria-components"
import { AsyncListData } from "react-stately"
import { twMerge } from "tailwind-merge"
import TaskItem, { TaskItemValues } from "./task-item"
import { iconBox, interactive } from "@/styles/class-names"
import { useDeleteTask, useUpdateTask } from "@/database/generated/hooks"

export default function TaskGridList({
  list,
  selectableStatuses,
  handleReorder,
  isLoading,
}: {
  list: AsyncListData<Task>
  selectableStatuses: TaskStatus[]
  handleReorder: (reorderedIds: string[]) => void
  isLoading: boolean
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
      aria-label="Editable Tasks"
      dragAndDropHooks={dragAndDropHooks}
      items={list.items}
      selectionMode="multiple"
      selectedKeys={list.selectedKeys}
      onSelectionChange={list.setSelectedKeys}
      className="flex flex-col gap-2"
      renderEmptyState={() => (
        <div className={"p-8 text-neutral-500"}>{isLoading ? "Loading..." : "No tasks"}</div>
      )}
    >
      {(task) => {
        return (
          <GridListItem
            id={task.id}
            textValue={task.title}
            className={twMerge(
              "group",
              "flex items-start rounded-md p-4",
              "data-selected:bg-neutral-100",
              "hover:bg-neutral-50",
              "-outline-offset-2 outline-neutral-300 focus-visible:outline-2"
            )}
          >
            <Button slot="drag" className={twMerge(iconBox(), interactive(), "text-neutral-400")}>
              <GripVerticalIcon />
            </Button>
            <Checkbox
              slot="selection"
              className={twMerge(
                iconBox(),
                interactive({ hover: "background" }),
                "mr-2 text-neutral-400 data-selected:text-neutral-700"
              )}
            >
              {({ isSelected }) => (isSelected ? <SquareCheckIcon /> : <SquareIcon />)}
            </Checkbox>
            <TaskItem
              task={task}
              onDelete={() => onDeleteTask(task.id)}
              onUpdate={(values) => onUpdateTask(task.id, values)}
              selectableStatuses={selectableStatuses}
            />
          </GridListItem>
        )
      }}
    </GridList>
  )
}
