"use client"

import { Task } from "@prisma/client"
import { Accordion, AccordionItem } from "@szhsin/react-accordion"
import { ChevronRight } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { TaskStatusButton } from "./task-status"
import { TaskSizeDisplay } from "./task-size"

export default function TasksList({ tasks }: { tasks: Task[] }) {
  return (
    <Accordion>
      <AccordionItem
        header={({ state }) => (
          <div
            className={twMerge(
              "flex w-full cursor-pointer items-center space-x-2 rounded p-2 hover:bg-neutral-50"
            )}
          >
            <div className="flex items-center space-x-1">
              <ChevronRight className={twMerge(state.isEnter ? "rotate-90" : null)} size={20} />
              <h1>Tasks</h1>
            </div>
            <div className="flex items-center">
              <TaskSizeDisplay minutes={145} size="sm" />
            </div>
          </div>
        )}
        buttonProps={{
          className: "rounded",
        }}
      >
        <div className={twMerge("border-t-2 border-neutral-100 py-2", "grid grid-cols-1 gap-2")}>
          {tasks.map((task) => {
            return <TaskListItem key={task.id} task={task} />
          })}
        </div>
      </AccordionItem>
    </Accordion>
  )
}

function TaskListItem({ task }: { task: Task }) {
  return (
    <div
      className={twMerge(
        "rounded border bg-neutral-50 p-0.5",
        "flex items-stretch justify-between"
      )}
    >
      <div className="flex items-center px-1">
        <p className="grow">{task.title}</p>
      </div>
      <div className="flex items-stretch space-x-0.5">
        <TaskSizeDisplay minutes={task.size_minutes} />
        <TaskStatusButton status={task.status} />
      </div>
    </div>
  )
}
