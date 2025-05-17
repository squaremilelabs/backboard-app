"use client"

import { TasklistCreate } from "./tasklist-create"
// import { TriageTarget } from "./triage-target"
import { TasklistTargetList } from "./tasklist-target-list"
import { TriageTarget } from "./triage-target"

export function SidebarContent() {
  return (
    <div className="flex flex-col gap-4 overflow-auto p-16">
      <TriageTarget />
      <TasklistTargetList />
      <TasklistCreate />
    </div>
  )
}
