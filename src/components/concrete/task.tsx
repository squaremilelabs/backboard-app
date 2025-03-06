"use client"

import { Task as ITask, Tasklist } from "@prisma/client"
import { ArrowUpToLine, Loader, Square, SquareCheck } from "lucide-react"
import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import EditableText from "../abstract/editable-text"
import MetadataPopover from "../abstract/metadata-popover"
import { formatDate } from "@/lib/utils"
import { useUpdateTask, useUpdateTasklist } from "@/database/generated/hooks"

export default function Task({ task, tasklist }: { task: ITask; tasklist: Tasklist }) {
  const updateTask = useUpdateTask()
  const updateTasklist = useUpdateTasklist()

  const handleCheck = () => {
    updateTask.mutate({
      where: { id: task.id },
      data: { done_at: task.done_at ? null : new Date() },
    })
  }

  const handleMoveToTop = () => {
    const currentTaskOrder = tasklist.task_order
    let updatedTaskOrder = [...currentTaskOrder]

    // if task.id is not in currentTaskOrder, add to front of array
    if (!updatedTaskOrder.includes(task.id)) {
      updatedTaskOrder.unshift(task.id)
    } else {
      // if task.id is in currentTaskOrder – move to front of array
      updatedTaskOrder = updatedTaskOrder.filter((id) => id !== task.id)
      updatedTaskOrder.unshift(task.id)
    }

    updateTasklist.mutate({
      where: { id: tasklist.id },
      data: { task_order: updatedTaskOrder },
    })
  }

  const isPending = updateTask.isPending || updateTasklist.isPending
  const CheckboxIcon = task.done_at ? SquareCheck : Square

  return (
    <div className="group flex items-start gap-2 rounded-lg p-2 outline-neutral-200 hover:outline-2">
      {isPending ? (
        <Loader size={20} className="text-gold-500 animate-spin" />
      ) : (
        <Button onPress={handleCheck} className={twMerge("text-neutral-500")}>
          <CheckboxIcon size={20} />
        </Button>
      )}
      <EditableText record={task} updateMutation={updateTask} updateField="title" />
      <div className="flex min-w-fit items-center gap-2">
        {!task.done_at ? (
          <div className="hidden h-[20px] items-center group-focus-within:flex group-hover:flex">
            <Button onPress={handleMoveToTop} className="text-gold-500">
              <ArrowUpToLine size={16} />
            </Button>
          </div>
        ) : null}
        {task.done_at ? (
          <p className="bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
            {formatDate(task.done_at, { withTime: true })}
          </p>
        ) : null}
        <div className="flex h-[20px] items-center">
          <MetadataPopover
            record={task}
            recordType={"Task"}
            updateMutation={updateTask}
            parentIsPublic={tasklist.is_public}
            iconSize={16}
          />
        </div>
      </div>
    </div>
  )
}
