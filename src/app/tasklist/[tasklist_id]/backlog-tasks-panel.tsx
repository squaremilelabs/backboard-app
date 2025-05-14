"use client"

import { LayersIcon } from "lucide-react"
import TasksPanel from "@/components/tasks-panel"
import {
  useFindManyTask,
  useFindUniqueTasklist,
  useUpdateTasklist,
} from "@/database/generated/hooks"
import { iconBox } from "@/styles/class-names"

export default function BacklogTasksPanel({ tasklistId }: { tasklistId: string }) {
  const tasklistQuery = useFindUniqueTasklist({ where: { id: tasklistId } })
  const tasksQuery = useFindManyTask({ where: { tasklist_id: tasklistId, timeslot_id: null } })
  const taskOrder = tasklistQuery.data?.task_order ?? []

  const updatetasklistMutation = useUpdateTasklist()
  const handleReorder = (reorderedIds: string[]) => {
    updatetasklistMutation.mutate({
      where: { id: tasklistId },
      data: { task_order: reorderedIds },
    })
  }

  const isLoading = tasklistQuery.isLoading || tasksQuery.isLoading

  return (
    <TasksPanel
      tasksQuery={tasksQuery}
      taskOrder={taskOrder}
      isLoading={isLoading}
      handleReorder={handleReorder}
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
