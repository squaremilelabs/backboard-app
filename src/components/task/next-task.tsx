import { Check, CircleDashed, Loader, Trash2 } from "lucide-react"
import {
  Button,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { useState } from "react"
import { useFormik } from "formik"
import { TaskUpdateScalarSchema } from "@zenstackhq/runtime/zod/models"
import { z } from "zod"
import { toFormikValidate } from "zod-formik-adapter"
import { TopicItem } from "../../lib/topic/item-data"
import { formatDate } from "../../lib/utils"
import { ORDERED_TASK_DONE_TARGETS, TASK_DONE_TARGET_DISPLAY_MAP } from "../../lib/task/constants"
import { useCreateTask, useDeleteTask, useUpdateTask } from "@/database/generated/hooks"

export default function NextTask({ topic }: { topic: TopicItem }) {
  if (!topic._next_task) {
    return <CreateTask topic={topic} />
  }

  return <EditTask topic={topic} />
}

function CreateTask({ topic }: { topic: TopicItem }) {
  const [title, setTitle] = useState("")
  const create = useCreateTask()

  const handleCreate = () => {
    if (!title) return
    create.mutate({
      data: { title, topic_id: topic.id, current_for_topic: { connect: { id: topic.id } } },
    })
  }

  return (
    <div
      className={twMerge(
        `focus-within:ring-gold-500 bg-canvas/50 focus-within:bg-canvas flex items-center gap-2 rounded
        border p-4 focus-within:ring-1`
      )}
    >
      {create.isPending ? (
        <Loader size={16} className="text-gold-500" />
      ) : (
        <CircleDashed size={14} />
      )}
      <TextField
        value={title}
        onChange={setTitle}
        className="w-full"
        aria-label="Task Title"
        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
      >
        <Input
          className={twMerge("w-full text-sm !ring-0 !outline-0 focus:text-base")}
          placeholder="Add Next Task"
        />
      </TextField>
    </div>
  )
}

type EditTaskValues = z.infer<typeof TaskUpdateScalarSchema>

function EditTask({ topic }: { topic: TopicItem }) {
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const formik = useFormik<EditTaskValues>({
    initialValues: {
      title: topic._next_task?.title,
      done_target: topic._next_task?.done_target ?? "NO_TARGET",
    },
    enableReinitialize: true,
    validate: toFormikValidate(TaskUpdateScalarSchema),
    onSubmit: (values) => {
      updateTask.mutate({
        where: { id: topic._next_task?.id },
        data: values,
      })
    },
  })

  const handleCompleteTask = () => {
    if (!topic._next_task) return
    updateTask.mutate({
      where: { id: topic._next_task.id },
      data: { done_at: new Date(), current_for_topic: { disconnect: { id: topic.id } } },
    })
  }

  if (!topic._next_task) return null

  const isPending = updateTask.isPending || deleteTask.isPending

  const targetDisplay = TASK_DONE_TARGET_DISPLAY_MAP[formik.values.done_target ?? "NO_TARGET"]

  return (
    <div className={twMerge("bg-canvas/60 flex flex-col gap-4 rounded border p-4")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-500">
          <CircleDashed size={14} />
          <p className="text-sm">Next Task</p>
        </div>
        <p className="px-2 text-sm text-neutral-500">Last edited {formatDate(topic.updated_at)}</p>
      </div>
      <form
        className={twMerge(
          "bg-canvas focus-within:border-gold-500 flex items-center gap-2 rounded border p-2"
        )}
        onSubmit={formik.handleSubmit}
      >
        <Input
          {...formik.getFieldProps("title")}
          aria-label="Task Title"
          className={twMerge("grow pl-2 !ring-0 !outline-0")}
          placeholder="Add Next Task"
        />
        <Select
          aria-label="Task Done Target"
          selectedKey={formik.values.done_target}
          onSelectionChange={(key) => {
            formik.setFieldValue("done_target", key)
            formik.submitForm()
          }}
        >
          <Button
            className={twMerge(
              targetDisplay.className,
              "rounded-full px-3 py-0.5",
              "cursor-pointer hover:opacity-80 data-pressed:scale-95"
            )}
          >
            <SelectValue className="text-sm" />
          </Button>
          <Popover placement="bottom end">
            <ListBox className="grid grid-cols-1 gap-2">
              {ORDERED_TASK_DONE_TARGETS.map((doneTarget) => {
                const { label, className } = TASK_DONE_TARGET_DISPLAY_MAP[doneTarget]
                return (
                  <ListBoxItem
                    key={doneTarget}
                    id={doneTarget}
                    className={twMerge(
                      className,
                      "flex items-center justify-center rounded-full px-3 py-0.5 text-sm",
                      "cursor-pointer border",
                      "!ring-neutral-300 data-selected:ring-2 data-selected:ring-offset-1"
                    )}
                  >
                    {label}
                  </ListBoxItem>
                )
              })}
            </ListBox>
          </Popover>
        </Select>
      </form>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            isDisabled={isPending}
            onPress={handleCompleteTask}
            className={twMerge(
              "flex cursor-pointer items-center gap-2 rounded border bg-neutral-100 px-2 py-1",
              "hover:bg-gold-50 hover:text-gold-600"
            )}
          >
            <Check size={16} />
            <span className="text-sm">Mark as Done</span>
          </Button>
          <Button
            isDisabled={isPending}
            onPress={() => {
              deleteTask.mutate({ where: { id: topic._next_task?.id } })
            }}
            className={twMerge(
              "flex cursor-pointer items-center gap-2 rounded border bg-neutral-100 px-2 py-1",
              "hover:bg-red-50 hover:text-red-600"
            )}
          >
            <Trash2 size={16} />
            <span className="text-sm">Cancel Task</span>
          </Button>
        </div>
        {isPending ? <Loader size={20} className="text-gold-500 animate-spin" /> : null}
      </div>
    </div>
  )
}
