"use client"
import InboxTasksPanel from "./inbox-tasks-panel"
import TasklistsList from "./tasklists-list"

export default function TriagePage() {
  return (
    <>
      {/* Desktop layout */}
      <div className="hidden items-start justify-center gap-8 md:flex">
        <div className="w-sm">
          <InboxTasksPanel />
        </div>
        <div className="w-md">
          <TasklistsList />
        </div>
      </div>
      {/* Mobile layout */}
      <div className="flex flex-col gap-8 md:hidden">
        <InboxTasksPanel />
        <TasklistsList />
        <div className="h-16 text-transparent">-</div>
      </div>
    </>
  )
}
