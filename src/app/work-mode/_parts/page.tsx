"use client"

import { Check, Loader, Square, SquareCheck, Zap, ZapOff } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { twMerge } from "tailwind-merge"
import { RelativeTarget } from "@prisma/client"
import { Button, Link } from "react-aria-components"
import { getWorkModeTasksWhereParam, TaskData, useTasksData } from "@/lib/data/task"
import { RELATIVE_TARGETS_UI_ENUM } from "@/lib/constants"
import { useUpdateTask } from "@/database/generated/hooks"
import { formatDate } from "@/lib/utils"

export default function WorkModePage() {
  const { user } = useUser()
  const { data: tasks } = useTasksData({
    where: getWorkModeTasksWhereParam(user?.id),
  })

  const nowTasks = tasks
    .filter((task) => !task.done_at && task.tasklist.target === "TODAY")
    .sort(undoneTaskSorter)
  const thisWeekTasks = tasks
    .filter((task) => !task.done_at && task.tasklist.target === "THIS_WEEK")
    .sort(undoneTaskSorter)
  const doneTasks = tasks
    .filter((task) => task.done_at)
    .sort((a, b) => ((a?.done_at ?? 0) > (b?.done_at ?? 0) ? -1 : 1))

  const taskSectionClassName = (taskCount: number) =>
    twMerge(
      "flex flex-col gap-2 bg-neutral-100 p-2 @sm:p-4 rounded-lg border",
      taskCount ? "opacity-100" : "opacity-70 bg-transparent"
    )

  const hasTasks = nowTasks.length + thisWeekTasks.length > 0

  const Icon = hasTasks ? Zap : ZapOff

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className={twMerge(
            "flex items-center gap-2",
            hasTasks ? "text-neutral-950" : "text-neutral-500"
          )}
        >
          <Icon size={24} className={hasTasks ? "text-gold-600" : ""} />
          <h1 className="text-xl font-medium">Work Mode</h1>
        </div>
        <p className="text-neutral-500">
          {hasTasks ? "Your current tasks across topics" : "No current tasks"}
        </p>
      </div>
      <div className={taskSectionClassName(nowTasks.length)}>
        <TargetSectionTitle target="TODAY" />
        {nowTasks.length ? (
          nowTasks.map((task) => <TaskRow key={task.id} task={task} />)
        ) : (
          <p className="px-2 text-sm text-neutral-500">None</p>
        )}
      </div>
      <div className={taskSectionClassName(thisWeekTasks.length)}>
        <TargetSectionTitle target="THIS_WEEK" />
        {thisWeekTasks.length ? (
          thisWeekTasks.map((task) => <TaskRow key={task.id} task={task} />)
        ) : (
          <p className="px-2 text-sm text-neutral-500">None</p>
        )}
      </div>
      <div className={twMerge(taskSectionClassName(doneTasks.length))}>
        <div className="text-gold-600 flex items-center gap-1 pb-1 font-medium @sm:pb-2">
          <Check size={20} />
          <p>Done today...</p>
        </div>
        {doneTasks.length ? (
          doneTasks.map((task) => <TaskRow key={task.id} task={task} />)
        ) : (
          <p className="px-2 text-sm text-neutral-500">None</p>
        )}
      </div>
    </div>
  )
}

const undoneTaskSorter = (a: TaskData, b: TaskData) => {
  const aParent = a.topic.title + a.tasklist.title
  const bParent = b.topic.title + b.tasklist.title
  if (aParent === bParent) {
    const aOrder = a._computed.order_in_tasklist
    const bOrder = b._computed.order_in_tasklist
    if (aOrder === null && bOrder === null) return 0
    if (aOrder !== null && bOrder === null) return -1
    if (aOrder === null && bOrder !== null) return 1
    if (aOrder !== null && bOrder !== null) return aOrder - bOrder
    if (a.created_at < b.created_at) return -1
    if (a.created_at > b.created_at) return 1
  }
  return aParent.localeCompare(bParent)
}

function TargetSectionTitle({ target }: { target: RelativeTarget }) {
  const display = RELATIVE_TARGETS_UI_ENUM[target]
  return (
    <div className="flex items-center pb-1 @sm:pb-2">
      <h1 className={twMerge(display.className, "rounded-full border px-4")}>{display.label}</h1>
    </div>
  )
}

function TaskRow({ task }: { task: TaskData }) {
  const updateTask = useUpdateTask()

  const handleCheck = () => {
    updateTask.mutate({
      where: { id: task.id },
      data: { done_at: task.done_at ? null : new Date() },
    })
  }

  const CheckboxIcon = task.done_at ? SquareCheck : Square

  return (
    <div className="bg-canvas flex flex-col gap-1 rounded-lg border p-2">
      <Link
        href={`/topic/${task.topic.id}`}
        className="self-start text-sm text-neutral-500 hover:underline"
      >
        {task.topic.title} / {task.tasklist.title}
      </Link>
      <div className="flex items-start gap-2 p-1">
        {updateTask.isPending ? (
          <Loader size={20} className="text-gold-500 animate-spin" />
        ) : (
          <Button onPress={handleCheck} className="text-neutral-500">
            <CheckboxIcon size={20} />
          </Button>
        )}
        <p className="grow">{task.title}</p>
        {task.done_at ? (
          <p className="bg-gold-50 text-gold-600 min-w-fit px-2 py-0.5 text-xs">
            {formatDate(task.done_at, { withTime: true })}
          </p>
        ) : null}
      </div>
    </div>
  )
}
