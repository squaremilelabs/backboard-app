"use client"
import { useUser } from "@clerk/nextjs"
import TasksPanel from "../tasks-panel"
import { useFindManyTask, useFindUniqueUser, useUpdateUser } from "@/database/generated/hooks"

export default function TriagePage() {
  const { user: authUser, isLoaded: authIsLoaded } = useUser()
  const userQuery = useFindUniqueUser({ where: { id: authUser?.id ?? "NO_AUTH" } })
  const tasksQuery = useFindManyTask({ where: { tasklist_id: null } })
  const isLoading = !authIsLoaded || userQuery.isLoading || tasksQuery.isLoading
  const taskOrder = userQuery.data?.inbox_task_order ?? []

  const updateUserMutation = useUpdateUser()

  const handleReorder = (reorderedIds: string[]) => {
    updateUserMutation.mutate({
      where: { id: authUser?.id ?? "NO_AUTH" },
      data: { inbox_task_order: reorderedIds },
    })
  }

  return (
    <>
      <div className="w-sm p-16">
        <TasksPanel
          isLoading={isLoading}
          tasksQuery={tasksQuery}
          taskOrder={taskOrder}
          headerContent="inbox"
          selectableStatuses={["TODO", "DRAFT"]}
          handleReorder={handleReorder}
          defaultTaskValues={{ tasklist_id: null, status: "DRAFT" }}
        />
      </div>
      {/* <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-center">
        <InboxTasksPanel
          className={({ isExpanded }) =>
            twMerge(["md:sticky md:top-0", isExpanded ? "w-full md:w-sm" : "w-fit md:w-fit"])
          }
        />
        <div className="w-full md:w-md">
          <TasklistsList />
        </div>
      </div> */}
    </>
  )
}
