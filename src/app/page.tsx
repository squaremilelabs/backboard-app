"use client"
import { TaskStatus } from "@prisma/client"
import { TaskBoxIcon, TopicBoxIcon } from "@/components/common/icons"
import { TaskStatusButton } from "@/components/task/task-status"

const statuses: TaskStatus[] = ["DRAFT", "TO_DO", "BLOCKED", "DONE", "CANCELED"]

export default function Home() {
  return (
    <div className="space-y-2 p-4">
      <h1 className="font-serif text-2xl text-neutral-950">backboard</h1>
      <div
        tabIndex={0}
        className="flex items-center space-x-0.5 rounded-xs border-1 border-neutral-200 bg-neutral-50 p-0.5 hover:bg-neutral-100"
      >
        <TaskBoxIcon />
        <p className="grow px-2">Tasks</p>
        {statuses.map((status) => (
          <TaskStatusButton key={status} status={status} />
        ))}
      </div>
      <div className="flex items-center space-x-1 rounded-xs border-1 border-neutral-200 bg-neutral-50 p-1 hover:bg-neutral-100">
        <TopicBoxIcon />
        <p>Topics</p>
      </div>
    </div>
  )
}
