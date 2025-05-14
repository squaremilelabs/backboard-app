"use client"

import { TasklistCreate } from "./tasklist-create"
import { TriageTarget } from "./triage-target"
import { TasklistTargetList } from "./tasklist-target-list"

export function SidebarContent() {
  return (
    <div className="flex flex-col gap-4 overflow-auto p-16">
      <TriageTarget />
      <div className="h-1 bg-neutral-200" />
      <TasklistTargetList />
      <div className="h-1 bg-neutral-200" />
      <TasklistCreate />
    </div>
  )
}
