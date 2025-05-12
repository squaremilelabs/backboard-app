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
    <div className="flex h-full flex-col gap-16">
      <TasklistEditableTitle tasklistId={tasklistId} />
      <div className="flex items-start gap-16">
        <div className="flex h-full w-sm flex-col gap-16">
          <TasklistTasksPanel tasklistId={tasklistId} />
        </div>
        <div className="flex w-xs flex-col">
          <TimeslotDropTargets tasklistId={tasklistId} />
        </div>
      </div>
    </div>
  )
}
