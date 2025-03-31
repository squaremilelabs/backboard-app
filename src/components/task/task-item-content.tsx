import { RoutineTask, Task } from "@zenstackhq/runtime/models"
import { Button } from "react-aria-components"
import { CheckSquare, Loader, Square } from "lucide-react"
import { twMerge } from "tailwind-merge"
import EditableText from "@/components/common/editable-text"
import { useUpdateTask } from "@/database/generated/hooks"
import { formatDate } from "@/lib/utils"

export default function TaskItemContent({ task }: { task: Task }) {
  const showCheckbox = task.status !== "PENDING"
  const showRoutineTaskInstanceNumber = task.type === "RoutineTask"
  const showDoneAtTimestamp = !!task.done_at

  return (
    <div className="flex items-start gap-1">
      {showCheckbox ? <Checkbox task={task} /> : null}
      {showRoutineTaskInstanceNumber ? <RoutineTaskInstanceNumber task={task} /> : null}
      {showDoneAtTimestamp ? <DoneTaskTimestamp task={task} /> : null}
      <Title task={task} />
    </div>
  )
}

function Title({ task }: { task: Task }) {
  const updateTask = useUpdateTask()
  const handleUpdateTitle = (title: string) => {
    updateTask.mutate({
      where: { id: task.id },
      data: { title },
    })
  }
  return (
    <EditableText
      initialValue={task.title}
      onSave={handleUpdateTitle}
      className={twMerge("grow text-sm/[16px]")}
    />
  )
}

function Checkbox({ task }: { task: Task }) {
  const updateTask = useUpdateTask()

  const handleToggleCheck = () => {
    updateTask.mutate({
      where: { id: task.id },
      data: task.done_at
        ? { status: "READY", done_at: null }
        : { status: "DONE", done_at: new Date() },
    })
  }

  const DisplayedIcon = updateTask.isPending ? Loader : task.done_at ? CheckSquare : Square

  return (
    <Button
      isDisabled={updateTask.isPending}
      onPress={handleToggleCheck}
      className={twMerge(
        "h-[16px] w-[16px]",
        "text-neutral-950",
        updateTask.isPending ? "text-gold-500 animate-spin" : null
      )}
    >
      <DisplayedIcon size={16} />
    </Button>
  )
}

function RoutineTaskInstanceNumber({ task }: { task: RoutineTask }) {
  return (
    <span
      className="bg-canvas flex h-[16px] items-center rounded-full border border-neutral-950 px-1 font-semibold
        text-neutral-950"
    >
      #{task.instance_number}
    </span>
  )
}

function DoneTaskTimestamp({ task }: { task: Task }) {
  return (
    <span
      className="flex h-[16px] items-center rounded-sm border border-neutral-300 bg-neutral-100 px-1 text-xs
        text-neutral-700"
    >
      {formatDate(task.done_at, { withTime: true })}
    </span>
  )
}
