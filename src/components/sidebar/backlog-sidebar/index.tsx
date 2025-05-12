"use client"
import BacklogTasklistGridList from "./backlog-tasklist-list"
import BacklogTriageItem from "./backlog-triage-item"

export default function BacklogSidebar() {
  return (
    <div className="flex flex-col gap-8 overflow-auto p-16">
      <BacklogTriageItem />
      <BacklogTasklistGridList />
    </div>
  )
}
