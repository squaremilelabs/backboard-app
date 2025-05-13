import TimeslotTasksPanel from "./timeslot-tasks-panel"
import TasklistHeader from "./tasklist-header"
import TimeslotDropTargets from "@/components/tasklist-drop-targets/timeslot-drop-targets"
import BacklogDropTarget from "@/components/tasklist-drop-targets/backlog-drop-target"

export default async function TasklistPage({
  params,
}: {
  params: Promise<{ tasklist_timeslot_id: string }>
}) {
  const { tasklist_timeslot_id: tasklistTimeslotId } = await params
  const [tasklistId, timeslotId] = tasklistTimeslotId.split("-")
  return (
    <div className="grid max-h-full grid-rows-[auto_minmax(0,1fr)] gap-16 p-16">
      <TasklistHeader tasklistId={tasklistId} />
      <div className="flex items-start gap-16">
        <div className="flex max-h-full w-sm gap-16">
          <TimeslotTasksPanel timeslotId={timeslotId} />
        </div>
        <div className="flex max-h-full w-xs flex-col gap-8 overflow-auto p-4">
          <BacklogDropTarget tasklistId={tasklistId} />
          <TimeslotDropTargets tasklistId={tasklistId} activeTimeslotId={timeslotId} />
        </div>
      </div>
    </div>
  )
}
