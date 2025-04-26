import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { TaskStatus } from "@prisma/client"
import { TaskSizeSelect } from "../../task-size"
import { TaskStatusSelect } from "../../task-status"
import TextToInput from "@/components/common/text-to-input"

type UndoneTaskStatus = "TODO" | "DRAFT"

export interface TaskCreateValues {
  title: string
  status: UndoneTaskStatus
  size_minutes: number
}

const initialValues: TaskCreateValues = {
  title: "",
  status: "DRAFT",
  size_minutes: 5,
}

export default function TaskCreateInput({
  onSubmit,
  disabledStatuses,
}: {
  onSubmit: (values: TaskCreateValues) => void
  disabledStatuses?: TaskStatus[]
}) {
  const [values, setValues] = useState<TaskCreateValues>(initialValues)

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
        "flex items-start gap-4",
        "rounded-md p-4 outline outline-neutral-300",
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
        disabledStatuses={disabledStatuses}
      />
      <TextToInput
        value={values.title}
        onValueChange={(title) => setValues({ ...values, title })}
        placeholder="Add Task"
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
