import { InboxIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { Link } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { isTextDropItem, useDrop } from "react-aria"
import { useRef } from "react"
import { Task } from "@zenstackhq/runtime/models"
import { iconBox, interactive } from "@/styles/class-names"
import { useFindManyTask, useUpdateManyTask } from "@/database/generated/hooks"
import { TaskSizeSummaryChips } from "@/components/primitives/task/task-size"

export default function BacklogTriageItem() {
  const pathname = usePathname()
  const triageTasksQuery = useFindManyTask({
    where: { tasklist_id: null, timeslot_id: null, archived_at: null },
  })
  const isActive = pathname === `/backlog/triage`

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
        href="/backlog/triage"
        className={twMerge(
          interactive({ hover: "fade" }),
          "flex items-center px-4 py-6",
          "rounded-lg border border-neutral-200",
          isActive ? "border-l-gold-500 rounded-l-none border-l-4" : "",
          isDropTarget ? "outline" : ""
        )}
      >
        <div className={iconBox()}>
          <InboxIcon />
        </div>
        <p className="ml-4 grow font-medium">Triage</p>
        <TaskSizeSummaryChips tasks={triageTasksQuery.data ?? []} />
      </Link>
    </div>
  )
}
