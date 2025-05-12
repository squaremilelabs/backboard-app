"use client"

import { useUser } from "@clerk/nextjs"
import { InboxIcon } from "lucide-react"
import { useFindManyTask, useFindUniqueUser, useUpdateUser } from "@/database/generated/hooks"
import TasksPanel from "@/components/tasks-panel"
import { iconBox } from "@/styles/class-names"

export default function TriageTasksPanel() {
  const { user: authUser, isLoaded: authUserIsLoaded } = useUser()

  const userQuery = useFindUniqueUser({
    where: { id: authUser?.id ?? "NO_USER" },
  })

  const tasksQuery = useFindManyTask({
    where: { tasklist_id: null, timeslot_id: null, archived_at: null },
  })

  const taskOrder = userQuery.data?.inbox_task_order ?? []

  const updateUserMutation = useUpdateUser()
  const handleReorder = (reorderedIds: string[]) => {
    updateUserMutation.mutate({
      where: { id: authUser?.id ?? "NO_USER" },
      data: { inbox_task_order: reorderedIds },
    })
  }

  const isLoading = !authUserIsLoaded || userQuery.isLoading || tasksQuery.isLoading

  return (
    <TasksPanel
      tasksQuery={tasksQuery}
      taskOrder={taskOrder}
      isLoading={isLoading}
      defaultTaskValues={{ status: "DRAFT", tasklist_id: null, timeslot_id: null }}
      selectableStatuses={[]}
      handleReorder={handleReorder}
      headerContent={
        <div className="flex items-center gap-4">
          <div className={iconBox()}>
            <InboxIcon />
          </div>
          <h2 className="font-medium">Triage</h2>
        </div>
      }
    />
  )
}
