import { twMerge } from "tailwind-merge"
import { useAsyncList } from "react-stately"
import { Task, TaskStatus } from "@zenstackhq/runtime/models"
import { useEffect } from "react"
import TaskSummary from "../primitives/task/task-summary"
import InnerTasksList from "./inner-tasks-list"
import BatchActions from "./batch-actions"
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

  return (
    <div className={twMerge("flex flex-col", "rounded-lg border-2 bg-neutral-100 p-4")}>
      <div className="flex items-center p-8">
        {headerContent}
        <div className="grow" />
        <TaskSummary tasks={list.items} />
      </div>
      <div className="bg-canvas flex flex-col gap-8 rounded-md border p-16">
        <InnerTasksList
          list={list}
          selectableStatuses={selectableStatuses}
          handleReorder={handleReorder}
          defaultTaskValues={defaultTaskValues}
        />
      </div>
    </div>
  )
}
