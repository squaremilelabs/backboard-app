import { Prisma, Task } from "@zenstackhq/runtime/models"
import { Loader, Square, SquareCheck } from "lucide-react"
import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import EditableText from "../common/EditableText"
import MetadataPopover from "../common/MetadataPopover"
import { formatDate } from "@/lib/utils"
import { TasklistData } from "@/lib/tasklist"
import { useUpdateTask } from "@/database/generated/hooks"

export default function TaskItem({ task, tasklist }: { task: Task; tasklist: TasklistData }) {
  const updateTaskMutation = useUpdateTask()

  const updateTask = (data: Prisma.TaskUpdateInput) => {
    updateTaskMutation.mutate({ where: { id: task.id }, data })
  }

  const handleCheck = () => {
    updateTask({
      done_at: task.done_at ? null : new Date(),
    })
  }

  const handleTitleUpdate = (title: string) => {
    updateTask({ title })
  }

  const CheckboxIcon = task.done_at ? SquareCheck : Square

  return (
    <div className="group flex grow items-start gap-2">
      {updateTaskMutation.isPending ? (
        <Loader size={20} className="text-gold-500 animate-spin" />
      ) : (
        <Button onPress={handleCheck} className={twMerge("text-neutral-500")}>
          <CheckboxIcon size={20} />
        </Button>
      )}
      <EditableText initialValue={task.title} onSave={handleTitleUpdate} className="bg-canvas" />
      <div className="flex min-w-fit items-center gap-2">
        {task.done_at ? (
          <p className="bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
            {formatDate(task.done_at, { withTime: true })}
          </p>
        ) : null}
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
