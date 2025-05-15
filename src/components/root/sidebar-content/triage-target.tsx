import { ArrowRightIcon, InboxIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { Link } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { isTextDropItem, useDrop } from "react-aria"
import { useRef } from "react"
import { Task } from "@zenstackhq/runtime/models"
import { iconBox, interactive } from "@/styles/class-names"
import { useFindManyTask, useUpdateManyTask } from "@/database/generated/hooks"
import { TaskSizeSummaryChips } from "@/components/primitives/task-size"

export function TriageTarget() {
  const pathname = usePathname()
  const triageTasksQuery = useFindManyTask({
    where: { tasklist_id: null, timeslot_id: null, archived_at: null },
  })
  const isActive = pathname === `/triage`

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
          "rounded-lg",
          "-outline-offset-2",
          isDropTarget ? "outline" : ""
        )}
      >
        <div className={iconBox({ className: "text-neutral-400" })}>
          <InboxIcon />
        </div>
        <p className={twMerge("ml-4 truncate font-medium")}>Triage</p>
        <div className="grow" />
        <TaskSizeSummaryChips
          tasks={triageTasksQuery.data ?? []}
          consistentWeightVariant="medium"
        />
        {isActive && (
          <div className={iconBox({ className: "text-neutral-500" })}>
            <ArrowRightIcon />
          </div>
        )}
      </Link>
    </div>
  )
}
