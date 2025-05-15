"use client"

import { LayersIcon } from "lucide-react"
import { TaskPanel } from "@/components/templates/task-panel"
import {
  useFindManyTask,
  useFindUniqueTasklist,
  useUpdateTasklist,
} from "@/database/generated/hooks"
import { iconBox } from "@/styles/class-names"

export function TasklistBacklogPanel({ tasklistId }: { tasklistId: string | undefined }) {
  const tasklistQuery = useFindUniqueTasklist({ where: { id: tasklistId } })
  const tasksQuery = useFindManyTask({ where: { tasklist_id: tasklistId, timeslot_id: null } })
  const tasklist = tasklistQuery.data

  const updateTasklistMutation = useUpdateTasklist()
  const handleReorder = (reorderedIds: string[]) => {
    updateTasklistMutation.mutate({
      where: { id: tasklistId },
      data: { task_order: reorderedIds },
    })
  }

  return (
    <TaskPanel
      tasksQuery={tasksQuery}
      taskOrder={tasklist?.task_order ?? []}
      isLoading={tasklistQuery.isLoading || tasksQuery.isLoading}
      handleReorder={handleReorder}
      isReorderPending={updateTasklistMutation.isPending}
      defaultTaskValues={{
        status: "DRAFT",
        tasklist_id: tasklistId,
        timeslot_id: null,
      }}
      selectableStatuses={["TODO", "DRAFT"]}
      headerContent={
        <div className="flex items-center gap-4">
          <div className={iconBox()}>
            <LayersIcon />
          </div>
          <h2 className="font-medium">Backlog</h2>
        </div>
      }
    />
  )
}
