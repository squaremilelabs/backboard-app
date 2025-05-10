import { Task, TaskStatus } from "@zenstackhq/runtime/models"
import { GripVerticalIcon, PlusIcon, SquareCheckIcon, SquareIcon, XIcon } from "lucide-react"
import {
  Button,
  Checkbox,
  Form,
  GridList,
  GridListItem,
  Input,
  TextField,
  useDragAndDrop,
} from "react-aria-components"
import { AsyncListData } from "react-stately"
import { twMerge } from "tailwind-merge"
import { useState } from "react"
import { createId } from "@paralleldrive/cuid2"
import TaskItem, { TaskItemValues } from "../primitives/task/task-item"
import BatchTaskActions from "./batch-actions"
import { iconBox, interactive } from "@/styles/class-names"
import { useCreateTask, useDeleteTask, useUpdateTask } from "@/database/generated/hooks"
import { draftTask } from "@/lib/utils-task"

export default function InnerTasksList({
  list,
  selectableStatuses,
  defaultTaskValues,
  handleReorder,
}: {
  list: AsyncListData<Task>
  selectableStatuses: TaskStatus[]
  defaultTaskValues: Partial<Task>
  handleReorder: (reorderedIds: string[]) => void
}) {
  const createTaskMutation = useCreateTask()
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
        <div className="bg-canvas rounded-xl border px-16 py-2">
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

  const onCreateTask = (title: string) => {
    const id = createId()
    list.prepend(draftTask({ id, title, ...defaultTaskValues }))
    createTaskMutation.mutate({
      data: {
        id,
        title,
        tasklist: defaultTaskValues.tasklist_id
          ? { connect: { id: defaultTaskValues.tasklist_id } }
          : undefined,
        timeslot: defaultTaskValues.timeslot_id
          ? { connect: { id: defaultTaskValues.timeslot_id } }
          : undefined,
      },
    })
  }

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

  const selectedIds = [...list.selectedKeys] as string[]

  return (
    <div className="flex flex-col gap-8">
      {selectedIds.length > 0 ? (
        <BatchTaskActions list={list} selectableStatuses={selectableStatuses} />
      ) : (
        <NewTaskInput onSubmit={onCreateTask} />
      )}
      <GridList
        aria-label="Editable Tasks"
        dragAndDropHooks={dragAndDropHooks}
        items={list.items}
        selectionMode="multiple"
        selectedKeys={list.selectedKeys}
        onSelectionChange={list.setSelectedKeys}
        className="flex flex-col"
      >
        {(task) => {
          return (
            <GridListItem
              id={task.id}
              textValue={task.title}
              className={twMerge("group", "flex items-start rounded-md p-4")}
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
    </div>
  )
}

function NewTaskInput({ onSubmit }: { onSubmit: (title: string) => void }) {
  const [title, setTitle] = useState("")
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(title)
        setTitle("")
      }}
      className={twMerge(
        "flex items-center gap-4 p-4",
        "rounded-md border border-transparent",
        "opacity-50",
        "focus-within:border-neutral-200 focus-within:opacity-100",
        "hover:opacity-100 not-focus-within:hover:bg-neutral-100"
      )}
    >
      <div className={iconBox()}>
        <PlusIcon />
      </div>
      <TextField
        aria-label="New task title"
        value={title}
        onChange={setTitle}
        className="flex grow"
        validate={(value) => Boolean(value) || "Title is required"}
      >
        <Input placeholder="Add" className="w-full !outline-0" />
      </TextField>
    </Form>
  )
}

function TaskSelectionControl({
  selectedCount,
  isAllSelected,
  onSelectAll,
  onUnselectAll,
}: {
  selectedCount: number
  isAllSelected: boolean
  onSelectAll: () => void
  onUnselectAll: () => void
}) {
  return (
    <div className="flex items-center gap-4 border border-transparent border-b-neutral-200 p-4">
      <div className="flex items-center gap-4">
        <Button onPress={onUnselectAll} className={twMerge(iconBox(), interactive())}>
          <XIcon />
        </Button>
        <p>{selectedCount} selected</p>
        {!isAllSelected && (
          <Button
            className={twMerge(
              interactive({ hover: "underline" }),
              "ml-4 text-sm text-neutral-500"
            )}
            onPress={onSelectAll}
          >
            Select all
          </Button>
        )}
      </div>
    </div>
  )
}
