"use client"

import { Task } from "@zenstackhq/runtime/models"
import { LayersIcon } from "lucide-react"
import { useRef } from "react"
import { isTextDropItem, useDrop } from "react-aria"
import { Link } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { TaskSizeSummaryChips } from "../primitives/task/task-size"
import { iconBox, interactive } from "@/styles/class-names"
import { useFindManyTask, useUpdateManyTask } from "@/database/generated/hooks"
import useRouterUtility from "@/lib/router-utility"

export default function BacklogDropTarget({ tasklistId }: { tasklistId: string }) {
  const backlogTasksQuery = useFindManyTask({
    where: { tasklist_id: tasklistId, timeslot_id: null },
  })

  const router = useRouterUtility<{ timeslot: string | null }>()
  const isActive = !router.query.timeslot

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
          interactive({ hover: "fade" }),
          "flex items-center gap-4 px-4 py-6",
          "rounded-lg border bg-neutral-100",
          isDropTarget ? "outline" : "",
          isActive ? "bg-canvas border-2" : ""
        )}
      >
        <div className={iconBox({ size: "small" })}>
          <LayersIcon />
        </div>
        <p className="font-medium">Backlog</p>
        <div className="grow" />
        <TaskSizeSummaryChips tasks={backlogTasksQuery.data ?? []} showEmptyChip />
      </Link>
    </div>
  )
}
