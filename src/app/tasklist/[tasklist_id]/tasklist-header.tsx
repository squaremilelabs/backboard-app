"use client"

import { Archive, EllipsisVertical } from "lucide-react"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import TasklistEditableTitle from "@/components/primitives/tasklist/tasklist-editable-title"
import { useFindUniqueTasklist, useUpdateTasklist } from "@/database/generated/hooks"
import { iconBox, interactive } from "@/styles/class-names"

export default function TasklistHeader({ tasklistId }: { tasklistId: string }) {
  const tasklistQuery = useFindUniqueTasklist({ where: { id: tasklistId } })
  const tasklist = tasklistQuery.data
  const updateTasklistMutation = useUpdateTasklist()
  const handleArchive = () => {
    updateTasklistMutation.mutate({
      where: { id: tasklistId },
      data: { archived_at: tasklist?.archived_at ? null : new Date() },
    })
  }

  return (
    <div className="flex items-start gap-8">
      {tasklist?.archived_at ? (
        <div className={iconBox({ size: "large" })}>
          <Archive />
        </div>
      ) : null}
      <TasklistEditableTitle tasklistId={tasklistId} />
      <div className="grow" />
      <DialogTrigger>
        <Button
          className={twMerge(
            iconBox({ size: "large" }),
            interactive({ hover: "background" }),
            "text-neutral-400"
          )}
        >
          <EllipsisVertical />
        </Button>
        <Popover
          offset={2}
          placement="left"
          className="bg-canvas/30 rounded-md border px-8 py-4 backdrop-blur-lg"
        >
          <Dialog className="!outline-0">
            <Button
              className="flex cursor-pointer items-center gap-4 rounded-md text-neutral-500 !outline-0 hover:text-red-700
                focus-visible:text-red-700"
              onPress={handleArchive}
            >
              {tasklist?.archived_at ? "Unarchive Tasklist" : "Archive Tasklist"}
            </Button>
          </Dialog>
        </Popover>
      </DialogTrigger>
    </div>
  )
}
