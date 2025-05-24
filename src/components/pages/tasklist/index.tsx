"use client"
import { TasklistTimeslotPanel } from "./tasklist-timeslot-panel"
import { TasklistBacklogPanel } from "./tasklist-backlog-panel"
import TasklistCalendarGrid from "./tasklist-calendar-grid"
import { TasklistBacklogTarget } from "./tasklist-backlog-target"
import { TasklistHeader } from "./tasklist-header"
import { useRouterUtility } from "@/lib/router-utility"
import { WeekNavigator } from "@/components/portables/week-navigator"

export function TasklistPage() {
  const router = useRouterUtility()
  const tasklistId = router.params.tasklist_id
  const timeslotId = router.query.timeslot

  return (
    <div className="flex w-sm max-w-full flex-col gap-16 p-16">
      <TasklistHeader tasklistId={tasklistId} />
      <div className="h-1 bg-neutral-200" />
      <div className="flex flex-col gap-8">
        <div className="flex items-center">
          <WeekNavigator className="rounded-md border-none bg-transparent p-0" />
          <div className="grow" />
          <TasklistBacklogTarget tasklistId={tasklistId} />
        </div>
        <TasklistCalendarGrid tasklistId={tasklistId} />
      </div>
      <div className="h-1 bg-neutral-200" />
      {timeslotId ? (
        <TasklistTimeslotPanel timeslotId={timeslotId} />
      ) : (
        <TasklistBacklogPanel tasklistId={tasklistId} />
      )}
    </div>
  )
}
