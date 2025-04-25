import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components"
import { useEffect, useState } from "react"
import { Task } from "@zenstackhq/runtime/models"
import { ChevronRightIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { TaskStatus } from "@prisma/client"
import EditableText from "../common/editable-text"
import TaskStatusPopover from "./task-status-popover"

export type TaskItemContentValues = Pick<Task, "title" | "content" | "status" | "size_minutes">

export default function TaskItemContent({
  task,
  onValuesChange,
  disabledStatuses,
}: {
  task: Task
  onValuesChange?: (values: TaskItemContentValues) => void
  disabledStatuses?: TaskStatus[]
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [innerValues, setInnerValues] = useState<TaskItemContentValues>({
    title: task.title,
    content: task.content,
    status: task.status,
    size_minutes: task.size_minutes,
  })

  useEffect(() => {
    setInnerValues({
      title: task.title,
      content: task.content,
      status: task.status,
      size_minutes: task.size_minutes,
    })
  }, [task])

  useEffect(() => {
    if (
      task.title !== innerValues.title ||
      task.content !== innerValues.content ||
      task.status !== innerValues.status ||
      task.size_minutes !== innerValues.size_minutes
    ) {
      if (onValuesChange) onValuesChange(innerValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when innerValues change
  }, [innerValues, onValuesChange])

  return (
    <Disclosure
      className="flex grow flex-col"
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
    >
      <Heading className="flex grow items-start">
        <Button
          slot="trigger"
          className={twMerge(
            "flex cursor-pointer items-center rounded-md p-4 hover:bg-neutral-100"
          )}
        >
          <ChevronRightIcon
            className={twMerge(
              "size-20 transition-transform",
              innerValues.content ? "text-neutral-950" : "text-neutral-300",
              isExpanded ? "rotate-90 text-neutral-950" : "rotate-0"
            )}
          />
        </Button>
        <EditableText
          initialValue={innerValues.title}
          onSave={(value) => setInnerValues({ ...innerValues, title: value })}
          className={({}) => ["grow rounded-md p-4 hover:bg-neutral-100"]}
        />
        <TaskStatusPopover
          initialValues={innerValues}
          onValuesChange={(values) => setInnerValues({ ...innerValues, ...values })}
          isDebounced
          disabledStatuses={disabledStatuses}
        />
      </Heading>
      <DisclosurePanel>
        <EditableText
          initialValue={innerValues.content ?? ""}
          onSave={(value) => setInnerValues({ ...innerValues, content: value })}
          className="w-full rounded-md p-8 text-sm text-neutral-500 hover:bg-neutral-100"
          placeholder="Task notes..."
          allowEmpty
          isMultiline
        />
      </DisclosurePanel>
    </Disclosure>
  )
}
