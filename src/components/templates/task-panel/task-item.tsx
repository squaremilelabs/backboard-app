import { Task, TaskStatus } from "@prisma/client"
import { ChevronDownIcon, DeleteIcon, TextIcon } from "lucide-react"
import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { useRef, useState } from "react"
import { TaskPropertyPicker } from "./task-property-picker"
import { TaskSizeChip } from "@/components/primitives/task-size"
import { ConfirmationButton } from "@/components/primitives/confirmation-button"
import { EditableText } from "@/components/primitives/editable-text"
import { formatDate } from "@/lib/utils-common"
import { interactive } from "@/styles/class-names"

export interface TaskItemValues {
  title?: string
  content?: string | null
  status?: TaskStatus
  size_minutes?: number
}

export function TaskItem({
  task,
  onUpdate,
  onDelete,
  selectableStatuses,
  useOverdueColor,
}: {
  task: Task
  onUpdate: (values: TaskItemValues) => void
  onDelete: () => void
  selectableStatuses: TaskStatus[]
  useOverdueColor?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const propertyPickerRef = useRef<HTMLButtonElement | null>(null)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <Disclosure
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
      className={twMerge("flex grow flex-col", isExpanded ? "0 gap-8 pb-16" : null)}
    >
      <Heading className="flex items-start gap-4">
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
        <Button
          ref={propertyPickerRef}
          onPress={() => setIsPickerOpen(true)}
          className={twMerge(interactive(), "rounded-full")}
        >
          <TaskSizeChip
            minutes={task.size_minutes}
            status={task.status}
            useOverdueColor={useOverdueColor}
          />
        </Button>
        <TaskPropertyPicker
          triggerRef={propertyPickerRef}
          isOpen={isPickerOpen}
          values={{ status: task.status, size_minutes: task.size_minutes }}
          onOpenChange={setIsPickerOpen}
          onSelect={onUpdate}
          selectableStatuses={selectableStatuses}
          useOverdueColor={useOverdueColor}
        />
      </Heading>
      <DisclosurePanel className="flex w-full flex-col gap-4">
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
            "flex w-full items-start gap-8 p-4",
            "rounded-md border border-neutral-100 bg-neutral-50",
            "focus-within:outline has-[button[data-pressed]]:outline",
            "group-data-selected/task-grid-list-item:bg-canvas",
            "group-hover/task-grid-list-item:bg-canvas"
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
            className={({}) => twMerge("min-h-80 w-full grow text-neutral-700", "!no-underline")}
          />
        </div>
        <div className="flex items-center gap-8">
          <div className="grow" />
          <ConfirmationButton
            content="Are you sure you want to delete this task? This action is irreversable."
            isDestructive
            onConfirm={onDelete}
          >
            <Button
              className={twMerge(
                "flex items-center gap-4 rounded-md px-2 text-sm",
                "cursor-pointer",
                "text-neutral-400 hover:text-red-700"
              )}
            >
              Delete task
              <DeleteIcon size={12} />
            </Button>
          </ConfirmationButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
