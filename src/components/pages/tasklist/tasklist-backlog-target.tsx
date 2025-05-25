"use client"
import { Task } from "@zenstackhq/runtime/models"
import { LayersIcon } from "lucide-react"
import { useRef } from "react"
import { isTextDropItem, useDrop } from "react-aria"
import { Link } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { TaskSizeSummaryChips } from "@/components/portables/task-size"
import { iconBox } from "@/styles/class-names"
import { useFindManyTask, useUpdateManyTask } from "@/database/generated/hooks"
import { useRouterUtility } from "@/lib/router-utility"

export function TasklistBacklogTarget({ tasklistId }: { tasklistId: string | undefined }) {
  const router = useRouterUtility()
  const isActive = !router.query.timeslot

  const backlogTasksQuery = useFindManyTask({
    where: { tasklist_id: tasklistId, timeslot_id: null },
  })

  const ref = useRef<HTMLDivElement>(null)

  const { dropProps, isDropTarget } = useDrop({
    ref,
    isDisabled: isActive,
    getDropOperation: (draggedItemTypes) => {
      return draggedItemTypes.has("task") ? "move" : "cancel"
    },
    onDrop: async (e) => {
      const tasks = await Promise.all<Task>(
        e.items.filter(isTextDropItem).map(async (task) => {
          return JSON.parse(await task.getText("task"))
        })
      )
      handleTasksDrop(tasks)
    },
  })

  const updateTasksMutation = useUpdateManyTask()
  const handleTasksDrop = (tasks: Task[]) => {
    // handle done tasks
    const doneTasks = tasks.filter((task) => task.status === "DONE")
    if (doneTasks.length > 0) {
      updateTasksMutation.mutate({
        where: { id: { in: doneTasks.map((task) => task.id) } },
        data: { status: "TODO", tasklist_id: tasklistId, timeslot_id: null },
      })
    }
    // handle undone tasks
    const undoneTasks = tasks.filter((task) => task.status !== "DONE")
    if (undoneTasks.length > 0) {
      updateTasksMutation.mutate({
        where: { id: { in: undoneTasks.map((task) => task.id) } },
        data: { tasklist_id: tasklistId, timeslot_id: null },
      })
    }
  }

  return (
    <div ref={ref} {...dropProps}>
      <Link
        href={`/tasklist/${tasklistId}`}
        className={twMerge(
          "flex h-24 max-h-24 items-center gap-4 p-4",
          "rounded-md",
          "cursor-pointer",
          "border border-transparent",
          isActive ? "bg-canvas rounded-lg border-neutral-300 px-8" : "hover:scale-105",
          isDropTarget ? "outline" : ""
        )}
      >
        <div className={iconBox({ size: "small" })}>
          <LayersIcon />
        </div>
        <p className={twMerge("mr-4 text-sm", isActive ? "text-neutral-950" : "text-neutral-500")}>
          Backlog
        </p>
        <TaskSizeSummaryChips tasks={backlogTasksQuery.data ?? []} size="small" />
      </Link>
    </div>
  )
}
