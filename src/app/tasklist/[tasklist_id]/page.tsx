"use client"

import { useParams } from "next/navigation"
import TasklistHeader from "./tasklist-header"
import TimeslotTasksPanel from "./timeslot-tasks-panel"
import BacklogTasksPanel from "./backlog-tasks-panel"
import TimeslotDropTargets from "@/components/tasklist-drop-targets/timeslot-drop-targets"
import useRouterUtility from "@/lib/router-utility"
import BacklogDropTarget from "@/components/tasklist-drop-targets/backlog-drop-target"

export default function TasklistPage() {
  const router = useRouterUtility<{ timeslot: string }>()
  const params = useParams<{ tasklist_id: string }>()

  const tasklistId = params.tasklist_id
  const timeslotId = router.query.timeslot

  return (
    <div className="grid max-h-full grid-rows-[auto_minmax(0,1fr)] gap-16 p-16">
      <TasklistHeader tasklistId={tasklistId} />
      <div className="flex items-start gap-16">
        <div className="flex max-h-full w-sm gap-16">
          {timeslotId ? (
            <TimeslotTasksPanel timeslotId={timeslotId} />
          ) : (
            <BacklogTasksPanel tasklistId={tasklistId} />
          )}
        </div>
        <div className="flex max-h-full w-xs flex-col gap-8 overflow-auto p-4">
          <BacklogDropTarget tasklistId={tasklistId} />
          <TimeslotDropTargets tasklistId={tasklistId} />
        </div>
      </div>
    </div>
  )
}
