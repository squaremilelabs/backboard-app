import TasksNav from "@/components/task/tasks-nav"

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-0 overflow-auto">
      <TasksNav />
      <div className="@container/task-panel-content h-full w-full overflow-auto p-2 @4xl:justify-self-center @5xl:w-5xl">
        {children}
      </div>
    </div>
  )
}
