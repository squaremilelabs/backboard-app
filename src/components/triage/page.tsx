"use client"

import InboxTasksPanel from "./inbox-tasks-panel"
import TasklistsList from "./tasklists-list"

export default function TriagePage() {
  return (
    <>
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-center">
        <div className="w-full md:sticky md:top-0 md:w-sm">
          <InboxTasksPanel />
        </div>
        <div className="w-full md:w-md">
          <TasklistsList />
        </div>
      </div>
    </>
  )
}
