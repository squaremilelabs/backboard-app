"use client"

import { TaskCreateForm } from "@/components/task/task-create-form"
import { useFindManyTask } from "@/database/generated/hooks"

export default function Page() {
  const { data: tasks } = useFindManyTask({
    take: 5,
    orderBy: { created_at: "desc" },
  })
  return (
    <div className="grid gap-2">
      {tasks?.map((task) => {
        return <div key={task.id}>{task.title}</div>
      })}
      <TaskCreateForm />
    </div>
  )
}
