import { TasksNav } from "@/components/task/tasks-nav"

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-2 overflow-auto">
      <TasksNav />
      <div className="h-full overflow-auto px-2">{children}</div>
    </div>
  )
}
