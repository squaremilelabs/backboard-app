import { InboxIcon } from "lucide-react"
import { Link } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { isTextDropItem, useDrop } from "react-aria"
import { useRef } from "react"
import { Task } from "@zenstackhq/runtime/models"
import { iconBox, interactive } from "@/styles/class-names"
import { useFindManyTask, useUpdateManyTask } from "@/database/generated/hooks"
import { TaskSizeSummaryChips } from "@/components/portables/task-size"
import { useRouterUtility } from "@/lib/router-utility"

export function TriageTarget() {
  const router = useRouterUtility()
  const triageTasksQuery = useFindManyTask({
    where: { tasklist_id: null, timeslot_id: null, archived_at: null },
  })
  const isActive = router.basePath === `triage`

  const ref = useRef<HTMLDivElement>(null)
  const { dropProps, isDropTarget } = useDrop({
    ref,
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
    updateTasksMutation.mutate({
      where: { id: { in: tasks.map((task) => task.id) } },
      data: { status: "DRAFT", tasklist_id: null, timeslot_id: null },
    })
  }

  return (
    <div ref={ref} {...dropProps}>
      <Link
        href="/triage"
        className={twMerge(
          interactive(),
          "flex items-center px-4 py-6",
          "rounded-lg border border-transparent",
          "-outline-offset-2",
          isDropTarget ? "outline" : "",
          isActive ? "border-neutral-300 bg-neutral-100" : ""
        )}
      >
        <div
          className={iconBox({
            className: ["text-neutral-400", isActive ? "text-neutral-950" : null],
          })}
        >
          <InboxIcon />
        </div>
        <p className={twMerge("ml-4 truncate font-medium")}>Triage</p>
        <div className="grow" />
        <TaskSizeSummaryChips
          tasks={triageTasksQuery.data ?? []}
          consistentWeightVariant="medium"
        />
      </Link>
    </div>
  )
}
