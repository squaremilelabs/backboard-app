"use client"

import { ArchiveIcon, EllipsisVertical } from "lucide-react"
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components"
import TasklistEditableTitle from "@/components/primitives/tasklist/tasklist-editable-title"
import { useUpdateTasklist } from "@/database/generated/hooks"

export default function TasklistHeader({ tasklistId }: { tasklistId: string }) {
  const updateTasklistMutation = useUpdateTasklist()
  const handleArchive = () => {
    updateTasklistMutation.mutate({
      where: { id: tasklistId },
      data: { archived_at: new Date() },
    })
  }
  return (
    <div className="flex items-start gap-8">
      <DialogTrigger>
        <Button className="flex h-24 min-w-fit cursor-pointer items-center rounded-md text-neutral-400 hover:bg-neutral-200">
          <EllipsisVertical size={14} />
        </Button>
        <Popover
          offset={2}
          placement="left"
          className="bg-canvas/30 rounded-md border-2 px-8 py-2 backdrop-blur-lg"
        >
          <Dialog className="!outline-0">
            <Button
              className="flex cursor-pointer items-center gap-4 rounded-md text-sm text-neutral-500 !outline-0
                hover:text-red-700 focus-visible:text-red-700"
              onPress={handleArchive}
            >
              Archive
              <ArchiveIcon size={16} />
            </Button>
          </Dialog>
        </Popover>
      </DialogTrigger>
      <TasklistEditableTitle tasklistId={tasklistId} />
    </div>
  )
}
