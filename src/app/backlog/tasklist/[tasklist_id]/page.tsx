import TasklistTasksPanel from "./tasklist-tasks-panel"
import TimeslotDropTargets from "@/components/tasklist-drop-targets/timeslot-drop-targets"
import TasklistEditableTitle from "@/components/primitives/tasklist/tasklist-editable-title"

export default async function TasklistPage({
  params,
}: {
  params: Promise<{ tasklist_id: string }>
}) {
  const { tasklist_id: tasklistId } = await params
  return (
    <div className="grid max-h-full grid-rows-[auto_minmax(0,1fr)] gap-16 p-16">
      <TasklistEditableTitle tasklistId={tasklistId} />
      <div className="flex items-start gap-16">
        <div className="flex max-h-full w-sm gap-16">
          <TasklistTasksPanel tasklistId={tasklistId} />
        </div>
        <div className="flex max-h-full w-xs flex-col overflow-auto p-4">
          <TimeslotDropTargets tasklistId={tasklistId} />
        </div>
      </div>
    </div>
  )
}
