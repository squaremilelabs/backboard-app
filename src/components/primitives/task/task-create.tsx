import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { TaskStatus } from "@prisma/client"
import { TaskSizeSelect } from "./task-size"
import { TaskStatusSelect } from "./task-status"
import TextToInput from "@/components/primitives/common/text-to-input"

export interface TaskCreateValues {
  title: string
  status: TaskStatus
  size_minutes: number
}

export default function TaskCreate({
  onSubmit,
  selectableTaskStatuses,
}: {
  onSubmit: (values: TaskCreateValues) => void
  selectableTaskStatuses: TaskStatus[]
}) {
  const [values, setValues] = useState<TaskCreateValues>({
    title: "",
    status: selectableTaskStatuses[0] ?? "DRAFT",
    size_minutes: 5,
  })

  const onPressEnter = () => {
    if (values.title.trim() !== "") {
      onSubmit(values)
      setValues({ ...values, title: "" })
    }
  }

  const onPressEscape = () => {
    setValues({ ...values, title: "" })
  }

  return (
    <div
      className={twMerge(
        "group/task-create flex items-start gap-4",
        "rounded-md p-4 outline-neutral-300",
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
        onValueChange={(status) => setValues({ ...values, status: status })}
        selectableStatuses={selectableTaskStatuses}
      />
      <TextToInput
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
        className="invisible group-focus-within/task-create:visible
          group-has-[button[data-pressed]]/task-create:visible"
      />
    </div>
  )
}
