"use client"

import { TasklistHeader } from "./tasklist-header"
import { TasklistTimeslotPanel } from "./tasklist-timeslot-panel"
import { TasklistBacklogPanel } from "./tasklist-backlog-panel"
import { TasklistTargets } from "./tasklist-targets"
import { useRouterUtility } from "@/lib/router-utility"

export function TasklistPage() {
  const router = useRouterUtility()
  const tasklistId = router.params.tasklist_id
  const timeslotId = router.query.timeslot

  return (
    <div className="grid max-h-full grid-rows-[auto_minmax(0,1fr)] gap-16 p-16">
      <TasklistHeader tasklistId={tasklistId} />
      <div className="flex items-start gap-16">
        <div className="flex max-h-full w-sm gap-16">
          {timeslotId ? (
            <TasklistTimeslotPanel timeslotId={timeslotId} />
          ) : (
            <TasklistBacklogPanel tasklistId={tasklistId} />
          )}
        </div>
        <div className="flex max-h-full w-xs flex-col overflow-auto p-2">
          <TasklistTargets tasklistId={tasklistId} />
        </div>
      </div>
    </div>
  )
}
