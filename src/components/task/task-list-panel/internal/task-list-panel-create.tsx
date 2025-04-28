import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { TaskStatus } from "@prisma/client"
import { useSessionStorage } from "usehooks-ts"
import { TaskSizeSelect } from "../../task-size"
import { TaskStatusSelect } from "../../task-status"
import TextToInput from "@/components/common/text-to-input"

type UndoneTaskStatus = "TODO" | "DRAFT"

export interface TaskCreateValues {
  title: string
  status: UndoneTaskStatus
  size_minutes: number
}

export default function TaskListPanelCreate({
  onSubmit,
  disabledStatuses,
  tasklistUid,
  tasklistIsEmpty,
}: {
  tasklistUid: string
  onSubmit: (values: TaskCreateValues) => void
  disabledStatuses?: TaskStatus[]
  tasklistIsEmpty?: boolean
}) {
  const [values, setValues] = useSessionStorage<TaskCreateValues>(
    `create-values/tasklist-${tasklistUid}`,
    { title: "", status: disabledStatuses?.includes("DRAFT") ? "TODO" : "DRAFT", size_minutes: 5 }
  )

  const onPressEnter = () => {
    if (values.title.trim() !== "") {
      onSubmit(values)
      setValues({ ...values, title: "" })
    }
  }

  const onPressEscape = () => {
    setValues({ ...values, title: "" })
  }

  const [isTitleActive, setIsTitleActive] = useState(false)

  return (
    <div
      className={twMerge(
        "flex items-start gap-4",
        "rounded-md p-4 outline-neutral-300",
        !tasklistIsEmpty ? "outline" : "",
        "opacity-50",
        "hover:opacity-100",
        "focus-within:opacity-100",
        "has-[button[data-pressed]]:opacity-100"
      )}
    >
      <div className="flex h-20 items-center justify-center text-neutral-950">
        <PlusIcon size={16} />
      </div>
      <TaskStatusSelect
        value={values.status}
        onValueChange={(status) => setValues({ ...values, status: status as UndoneTaskStatus })}
        disabledStatuses={[...(disabledStatuses ?? []), "DONE"]}
      />
      <TextToInput
        isActive={isTitleActive}
        onActiveChange={setIsTitleActive}
        value={values.title}
        onValueChange={(title) => setValues({ ...values, title })}
        placeholder="Add task"
        className={twMerge("grow", "placeholder-neutral-500")}
        onPressEnter={onPressEnter}
        onPressEscape={onPressEscape}
      />
      <TaskSizeSelect
        value={values.size_minutes}
        onValueChange={(size) => setValues({ ...values, size_minutes: size })}
        status={values.status}
      />
    </div>
  )
}
