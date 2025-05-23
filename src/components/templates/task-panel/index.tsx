"use client"

import { twMerge } from "tailwind-merge"
import { useAsyncList } from "react-stately"
import { Task, TaskStatus } from "@zenstackhq/runtime/models"
import { useEffect, useMemo, useState } from "react"
import { Button } from "react-aria-components"
import { ArrowDownNarrowWideIcon, Loader } from "lucide-react"
import { TaskGridList } from "./task-grid-list"
import { TaskCreate } from "./task-create"
import { TaskSelection } from "./task-selection"
import { TaskBatchActions } from "./task-batch-actions"
import { TaskSizeSummaryChips } from "@/components/portables/task-size"
import { useFindManyTask } from "@/database/generated/hooks"
import { sortItemsByOrder } from "@/lib/utils-common"
import { iconBox, interactive } from "@/styles/class-names"

export function TaskPanel({
  headerContent,
  isLoading,
  tasksQuery,
  taskOrder,
  selectableStatuses,
  defaultTaskValues,
  useOverdueColor,
  handleReorder,
  isReorderPending,
}: {
  headerContent: React.ReactNode
  isLoading: boolean
  tasksQuery: ReturnType<typeof useFindManyTask>
  taskOrder: string[]
  selectableStatuses: TaskStatus[]
  defaultTaskValues: Partial<Task>
  useOverdueColor?: boolean
  handleReorder: (reorderedIds: string[]) => void
  isReorderPending: boolean
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

  // Handle auto-sorting
  const [isAutoSorting, setIsAutoSorting] = useState(false)
  const autoSortedTaskIds = useMemo(
    () => autoSortTasks(list.items).map((task) => task.id),
    [list.items]
  )
  const handleAutoSort = () => {
    setIsAutoSorting(true)
    handleReorder(autoSortedTaskIds)
  }

  useEffect(() => {
    if (isAutoSorting) {
      if (!isReorderPending) {
        list.reload()
        setIsAutoSorting(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- don't run every time list or autosort state changes
  }, [isReorderPending])

  const showAutoSortButton =
    !isLoading && list.items.length > 1 && !isSameOrders(taskOrder, autoSortedTaskIds)

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
          showEmptyChip
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
          <div className="flex items-center p-16 pb-8">
            <TaskCreate list={list} defaultTaskValues={defaultTaskValues} />
            {showAutoSortButton && (
              <div className="px-4">
                {isReorderPending && isAutoSorting ? (
                  <div className={iconBox({ className: "text-gold-500 animate-spin" })}>
                    <Loader />
                  </div>
                ) : (
                  <Button
                    className={twMerge(
                      iconBox(),
                      interactive(),
                      "-scale-x-100 text-neutral-400",
                      "opacity-100 starting:opacity-0",
                      "transition-opacity"
                    )}
                    onPress={handleAutoSort}
                  >
                    <ArrowDownNarrowWideIcon />
                  </Button>
                )}
              </div>
            )}
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

function autoSortTasks(tasks: Task[]) {
  const orderedStatuses: TaskStatus[] = ["TODO", "DONE", "DRAFT"]
  return [...tasks].sort((a, b) => {
    const aStatusIndex = orderedStatuses.indexOf(a.status)
    const bStatusIndex = orderedStatuses.indexOf(b.status)
    if (aStatusIndex !== bStatusIndex) {
      return aStatusIndex - bStatusIndex
    }
    if (a.size_minutes !== b.size_minutes) {
      return a.size_minutes - b.size_minutes
    }
    return a.created_at.getTime() - b.created_at.getTime()
  })
}

function isSameOrders(left: string[], right: string[]) {
  if (left.length !== right.length) return false
  return left.every((id, index) => id === right[index])
}
