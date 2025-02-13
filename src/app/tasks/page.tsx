"use client"

import TasksList from "@/components/task/tasks-list"
import { useFindManyTask } from "@/database/generated/hooks"

export default function Page() {
  const tasksQuery = useFindManyTask()
  return (
    <div className="grid">
      <TasksList tasks={tasksQuery?.data ?? []} />
    </div>
  )
}
