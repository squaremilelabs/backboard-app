import { twMerge } from "tailwind-merge"
import TasksNav from "@/components/task/tasks-nav"

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-0 overflow-auto">
      <TasksNav />
      <div
        className={twMerge(
          "@container/task-panel-content h-full w-full overflow-auto p-2 @5xl:p-4"
        )}
      >
        {children}
      </div>
    </div>
  )
}
