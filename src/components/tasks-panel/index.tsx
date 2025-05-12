import { twMerge } from "tailwind-merge"
import { useAsyncList } from "react-stately"
import { Task, TaskStatus } from "@zenstackhq/runtime/models"
import { useEffect } from "react"
import { TaskSizeSummaryChips } from "../primitives/task/task-size"
import TaskGridList from "./task-grid-list"
import TaskCreate from "./task-create"
import TaskSelection from "./task-selection"
import TaskBatchActions from "./task-batch-actions"
import { useFindManyTask } from "@/database/generated/hooks"
import { sortItemsByOrder } from "@/lib/utils-common"

export default function TasksPanel({
  headerContent,
  isLoading,
  tasksQuery,
  taskOrder,
  selectableStatuses,
  defaultTaskValues,
  handleReorder,
}: {
  headerContent: React.ReactNode
  isLoading: boolean
  tasksQuery: ReturnType<typeof useFindManyTask>
  taskOrder: string[]
  selectableStatuses: TaskStatus[]
  defaultTaskValues: Partial<Task>
  handleReorder: (reorderedIds: string[]) => void
}) {
  const list = useAsyncList({
    load: () => {
      if (isLoading) return { items: [] }
      const tasks = (tasksQuery.data ?? []) as Task[]
      const sortedTasks = sortItemsByOrder({ items: tasks, order: taskOrder })
      return { items: sortedTasks }
    },
    getKey: (item) => item.id,
  })

  useEffect(() => {
    if (!isLoading) list.reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- don't run every time list changes
  }, [isLoading])

  useEffect(() => {
    if (tasksQuery.isFetchedAfterMount) list.reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- don't run every time list changes
  }, [tasksQuery.isFetchedAfterMount])

  const hasSelections = [...list.selectedKeys].length > 0

  return (
    <div
      className={twMerge("flex flex-col", "max-h-full", "rounded-lg border-2 bg-neutral-100 p-4")}
    >
      <div className="flex items-center p-8">
        {headerContent}
        <div className="grow" />
        <TaskSizeSummaryChips tasks={list.items} />
      </div>
      <div className="bg-canvas flex grow flex-col overflow-auto rounded-md border">
        <div
          className={twMerge(
            "bg-canvas/30 sticky top-0 z-10 p-16 pb-8 backdrop-blur-lg",
            hasSelections ? "border-b" : ""
          )}
        >
          {hasSelections ? (
            <TaskSelection list={list} />
          ) : (
            <TaskCreate list={list} defaultTaskValues={defaultTaskValues} />
          )}
        </div>
        <div className={twMerge("px-16", hasSelections ? "py-8" : "pb-16")}>
          <TaskGridList
            list={list}
            selectableStatuses={selectableStatuses}
            handleReorder={handleReorder}
            isLoading={isLoading}
          />
        </div>
        {hasSelections && (
          <div className="bg-canvas/30 sticky bottom-0 z-10 border-t p-16 pt-8 backdrop-blur-lg">
            <TaskBatchActions list={list} selectableStatuses={selectableStatuses} />
          </div>
        )}
      </div>
    </div>
  )
}
