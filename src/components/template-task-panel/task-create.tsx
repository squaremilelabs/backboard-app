import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { Form, Input, TextField } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { AsyncListData } from "react-stately"
import { Task } from "@zenstackhq/runtime/models"
import { createId } from "@paralleldrive/cuid2"
import { iconBox } from "@/styles/class-names"
import { draftTask } from "@/lib/utils-task"
import { useCreateTask } from "@/database/generated/hooks"

export default function TaskCreate({
  list,
  defaultTaskValues,
}: {
  list: AsyncListData<Task>
  defaultTaskValues: Partial<Task>
}) {
  const [title, setTitle] = useState("")

  const createTaskMutation = useCreateTask()
  const handleSubmit = () => {
    const id = createId()
    list.prepend(draftTask({ id, title, ...defaultTaskValues }))
    createTaskMutation.mutate({
      data: {
        id,
        title,
        status: defaultTaskValues.status,
        tasklist: defaultTaskValues.tasklist_id
          ? { connect: { id: defaultTaskValues.tasklist_id } }
          : undefined,
        timeslot: defaultTaskValues.timeslot_id
          ? { connect: { id: defaultTaskValues.timeslot_id } }
          : undefined,
      },
    })
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
        setTitle("")
      }}
      className={twMerge(
        "flex items-center gap-4 p-4",
        "bg-canvas",
        "rounded-md border border-transparent",
        "opacity-50",
        "focus-within:border-neutral-200 focus-within:opacity-100",
        "hover:opacity-100 not-focus-within:hover:bg-neutral-100"
      )}
    >
      <div className={iconBox()}>
        <PlusIcon />
      </div>
      <TextField
        aria-label="New task title"
        value={title}
        onChange={setTitle}
        className="flex grow"
        validate={(value) => Boolean(value) || "Title is required"}
      >
        <Input placeholder="Add" className="w-full !outline-0" />
      </TextField>
    </Form>
  )
}
