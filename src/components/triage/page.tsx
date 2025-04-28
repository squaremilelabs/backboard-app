import InboxTasksPanel from "./inbox-tasks-panel"
import TasklistsList from "./tasklists-list"

export default function TriagePage() {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-5">
        <InboxTasksPanel />
      </div>
      <div className="col-span-7">
        <TasklistsList />
      </div>
    </div>
  )
}
