"use client"

import { twMerge } from "tailwind-merge"
import InboxTasksPanel from "./inbox-tasks-panel"
import TasklistsList from "./tasklists-list"

export default function TriagePage() {
  return (
    <>
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-center">
        <InboxTasksPanel
          className={({ isExpanded }) =>
            twMerge(["md:sticky md:top-0", isExpanded ? "w-full md:w-sm" : "w-fit md:w-fit"])
          }
        />
        <div className="w-full md:w-md">
          <TasklistsList />
        </div>
      </div>
    </>
  )
}
