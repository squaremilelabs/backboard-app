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
  useOverdueColor,
}: {
  headerContent: React.ReactNode
  isLoading: boolean
  tasksQuery: ReturnType<typeof useFindManyTask>
  taskOrder: string[]
  selectableStatuses: TaskStatus[]
  defaultTaskValues: Partial<Task>
  useOverdueColor?: boolean
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
      className={twMerge(
        "flex flex-col",
        "max-h-full w-full",
        "rounded-lg border-2 bg-neutral-100 p-4"
      )}
    >
      <div className="flex items-center p-8">
        {headerContent}
        <div className="grow" />
        <TaskSizeSummaryChips
          tasks={list.items}
          consistentWeightVariant="medium"
          useOverdueColor={useOverdueColor}
          showFullMinutes
        />
      </div>
      <div className="bg-canvas flex grow flex-col overflow-auto rounded-md border">
        {hasSelections ? (
          <div
            className={twMerge(
              "flex flex-col gap-8",
              "bg-canvas/50 sticky top-0 z-10 border-b p-16 backdrop-blur-lg"
            )}
          >
            <TaskSelection list={list} />
            <TaskBatchActions list={list} selectableStatuses={selectableStatuses} />
          </div>
        ) : (
          <div className="p-16 pb-8">
            <TaskCreate list={list} defaultTaskValues={defaultTaskValues} />
          </div>
        )}
        <div className={twMerge("px-16", hasSelections ? "py-8" : "pb-16")}>
          <TaskGridList
            list={list}
            selectableStatuses={selectableStatuses}
            handleReorder={handleReorder}
            isLoading={isLoading}
            useOverdueColor={useOverdueColor}
          />
        </div>
      </div>
    </div>
  )
}
