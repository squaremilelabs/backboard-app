import TimeslotTasksPanel from "./timeslot-tasks-panel"
import TimeslotDropTargets from "@/components/tasklist-drop-targets/timeslot-drop-targets"
import TasklistEditableTitle from "@/components/primitives/tasklist/tasklist-editable-title"
import BacklogDropTarget from "@/components/tasklist-drop-targets/backlog-drop-target"

export default async function TasklistPage({
  params,
}: {
  params: Promise<{ tasklist_timeslot_id: string }>
}) {
  const { tasklist_timeslot_id: tasklistTimeslotId } = await params
  const [tasklistId, timeslotId] = tasklistTimeslotId.split("-")
  return (
    <div className="flex h-full flex-col gap-16">
      <TasklistEditableTitle tasklistId={tasklistId} />
      <div className="flex items-start gap-16">
        <div className="flex h-full w-sm flex-col gap-16">
          <TimeslotTasksPanel timeslotId={timeslotId} />
        </div>
        <div className="flex w-xs flex-col gap-8">
          <BacklogDropTarget tasklistId={tasklistId} />
          <TimeslotDropTargets tasklistId={tasklistId} activeTimeslotId={timeslotId} />
        </div>
      </div>
    </div>
  )
}
