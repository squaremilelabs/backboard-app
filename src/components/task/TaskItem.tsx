import { Prisma, Task, Tasklist } from "@zenstackhq/runtime/models"
import { Diamond, GripVertical, Loader, Square, SquareCheck } from "lucide-react"
import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import EditableText from "../common/EditableText"
import MetadataPopover from "../common/MetadataPopover"
import { formatDate } from "@/lib/utils"
import { useUpdateTask } from "@/database/generated/hooks"

export default function TaskItem({ task, tasklist }: { task: Task; tasklist: Tasklist }) {
  const updateTaskMutation = useUpdateTask()

  const updateTask = (data: Prisma.TaskUpdateInput) => {
    updateTaskMutation.mutate({ where: { id: task.id }, data })
  }

  const handleCheck = () => {
    const nextStatus = task.status === "LATER" ? "NOW" : task.status === "NOW" ? "DONE" : "NOW"
    updateTask({
      done_at: nextStatus === "DONE" ? new Date() : null,
      status: nextStatus,
    })
  }

  const handleTitleUpdate = (title: string) => {
    updateTask({ title })
  }

  const CheckboxIcon = task.status === "DONE" ? SquareCheck : Square

  return (
    <div className="group flex grow items-start gap-2">
      {task.status !== "DONE" ? (
        <Button slot="drag" className="text-neutral-500">
          <GripVertical size={20} />
        </Button>
      ) : null}
      {updateTaskMutation.isPending ? (
        <Loader size={20} className="text-gold-500 animate-spin" />
      ) : task.status !== "LATER" ? (
        <Button
          onPress={handleCheck}
          className={twMerge("text-neutral-500", task.status === "NOW" ? "text-gold-600" : "")}
        >
          <CheckboxIcon size={20} />
        </Button>
      ) : (
        <div className="flex size-[20px] items-center justify-center">
          <Diamond size={18} className="text-blue-600" />
        </div>
      )}
      {task.done_at ? (
        <p
          className="hidden h-[20px] min-w-fit items-center rounded border bg-neutral-100 px-2 py-0.5 text-xs
            text-neutral-600 @sm:inline-flex"
        >
          {formatDate(task.done_at, { withTime: true })}
        </p>
      ) : null}
      <EditableText initialValue={task.title} onSave={handleTitleUpdate} className="bg-canvas" />
      <div className="grow" />
      <div className="flex min-w-fit items-center gap-2">
        <div className="flex h-[20px] items-center">
          <MetadataPopover
            record={task}
            recordType={"Task"}
            updateMutation={updateTaskMutation}
            parentIsPublic={tasklist.is_public}
            iconSize={16}
            hideVisibility
          />
        </div>
      </div>
    </div>
  )
}
