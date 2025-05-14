"use client"
import BacklogTasklistGridList from "./backlog-tasklist-list"
import BacklogTriageItem from "./backlog-triage-item"
import TasklistCreateModal from "@/components/primitives/tasklist/tasklist-create"

export default function BacklogSidebar() {
  return (
    <div className="flex flex-col gap-8 overflow-auto p-16">
      <div className="flex flex-col">
        <BacklogTriageItem />
        <BacklogTasklistGridList />
      </div>
      <TasklistCreateModal />
    </div>
  )
}
