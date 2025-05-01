import { Task, TaskStatus } from "@prisma/client"
import { ChevronDownIcon, DeleteIcon, TextIcon } from "lucide-react"
import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { useSessionStorage } from "usehooks-ts"
import { TaskStatusSelect } from "./task-status"
import { TaskSizeSelect } from "./task-size"
import EditableText from "@/components/primitives/common/editable-text"
import { formatDate } from "@/lib/utils-common"

export interface TaskItemValues {
  title?: string
  content?: string | null
  status?: TaskStatus
  size_minutes?: number
}

export default function TaskItem({
  task,
  onUpdate,
  onDelete,
  selectableStatuses,
}: {
  task: Task
  onUpdate: (values: TaskItemValues) => void
  onDelete: () => void
  selectableStatuses: TaskStatus[]
}) {
  const [isExpanded, setIsExpanded] = useSessionStorage(`expanded/task-${task.id}`, false)

  return (
    <Disclosure
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
      className={twMerge("flex grow flex-col", isExpanded ? "0 gap-8 pb-16" : null)}
    >
      <Heading className="flex items-start gap-4">
        <TaskStatusSelect
          value={task.status}
          onValueChange={(status) => onUpdate({ status })}
          selectableStatuses={selectableStatuses}
        />
        <EditableText
          initialValue={task.title}
          onSave={(title) => onUpdate({ title })}
          className={({ isActive, isButton }) =>
            twMerge(
              "grow",
              task.status === "DONE" && isButton && !isActive ? "text-neutral-500" : "",
              isExpanded ? "font-medium" : ""
            )
          }
        />
        <Button
          slot="trigger"
          className="h-20 min-w-fit cursor-pointer rounded-md hover:bg-neutral-100"
        >
          <ChevronDownIcon
            size={16}
            className={twMerge(
              "transition-transform",
              isExpanded ? "rotate-0" : "rotate-90",
              task.content || isExpanded ? "text-neutral-950" : "text-neutral-300"
            )}
          />
        </Button>
        <TaskSizeSelect
          value={task.size_minutes}
          onValueChange={(size_minutes) => onUpdate({ size_minutes })}
          status={task.status}
        />
      </Heading>
      <DisclosurePanel className="flex flex-col gap-4">
        <div className="flex items-center gap-8">
          <span className="text-sm text-neutral-500">
            Created {formatDate(task.created_at, { withTime: true })}
          </span>
          <div className="h-10 w-1 bg-neutral-400" />
          <span className="text-sm text-neutral-500">
            Updated {formatDate(task.updated_at, { withTime: true })}
          </span>
        </div>
        <div
          className={twMerge(
            "flex items-start gap-8 p-4",
            "rounded-md border border-neutral-100 bg-neutral-50",
            "focus-within:outline has-[button[data-pressed]]:outline"
          )}
        >
          <div className="flex h-20 min-w-fit items-center text-neutral-400">
            <TextIcon size={14} />
          </div>
          <EditableText
            initialValue={task.content ?? ""}
            onSave={(content) => onUpdate({ content: content || null })}
            placeholder="Notes..."
            allowEmpty
            isMultiline
            className={({}) => twMerge("min-h-80 grow text-neutral-700", "!no-underline")}
          />
        </div>
        <div className="flex items-center gap-8">
          <div className="grow" />
          <Button
            onPress={onDelete}
            className={twMerge(
              "flex items-center gap-4 rounded-md px-2 text-sm",
              "cursor-pointer",
              "text-neutral-400 hover:text-red-700"
            )}
          >
            Delete task
            <DeleteIcon size={12} />
          </Button>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
