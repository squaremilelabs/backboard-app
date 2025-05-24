import { Task, TaskStatus } from "@zenstackhq/runtime/models"
import { Button } from "react-aria-components"
import { AsyncListData } from "react-stately"
import { twMerge } from "tailwind-merge"
import { interactive } from "@/styles/class-names"
import { taskStatusUIMap } from "@/lib/utils-task"

export function TaskSelection({ list }: { list: AsyncListData<Task> }) {
  const selectedTasks =
    list.selectedKeys === "all"
      ? [...list.items]
      : [...list.selectedKeys].map((key) => list.getItem(key) as Task)

  const selectionCount = selectedTasks.length
  const isAllSelected = selectedTasks.length === list.items.length

  const statusSelectionOptions = [...new Set(selectedTasks.map((task) => task.status))].filter(
    (status) => {
      const listTasksWithStatus = list.items.filter((task) => task.status === status)
      const selectedTasksWithStatus = selectedTasks.filter((task) => task.status === status)
      if (listTasksWithStatus.length > selectedTasksWithStatus.length) return true
      return false
    }
  )

  const handleSelectByStatus = (status: TaskStatus) => {
    const taskIds = list.items.filter((task) => task.status === status).map((task) => task.id)
    if (taskIds.length > 0) {
      list.setSelectedKeys(new Set(taskIds))
    }
  }

  return (
    <div className="flex items-center gap-8 p-4">
      <p className="font-medium">{selectionCount} selected</p>
      <div className="flex items-center divide-x divide-neutral-300">
        {!isAllSelected && (
          <Button
            className={twMerge(
              interactive({ hover: "underline" }),
              "px-8 text-sm text-neutral-950"
            )}
            onPress={() => list.setSelectedKeys("all")}
          >
            Select all
          </Button>
        )}
        {statusSelectionOptions.map((status) => {
          const statusUI = taskStatusUIMap[status]
          return (
            <Button
              key={status}
              className={twMerge(
                interactive({ hover: "underline" }),
                "px-8 text-sm text-neutral-500"
              )}
              style={{ color: `var(--bb-${statusUI.color}-500)` }}
              onPress={() => handleSelectByStatus(status)}
            >
              Select all {statusUI.label.toLowerCase()}
            </Button>
          )
        })}
        <Button
          className={twMerge(interactive({ hover: "underline" }), "px-8 text-sm text-neutral-500")}
          onPress={() => list.setSelectedKeys(new Set())}
        >
          Unselect all
        </Button>
      </div>
    </div>
  )
}
