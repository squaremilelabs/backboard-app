import { TaskStatus } from "@zenstackhq/runtime/models"
import { useState } from "react"
import { ListBox, ListBoxItem, Popover, Selection } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import Icon from "@mdi/react"
import { TaskSizeChip } from "./task-size"
import { taskSizeOptions, taskStatusUIMap } from "@/lib/utils-task"
import { chip, ChipProps, interactive, popover } from "@/styles/class-names"

export type TaskPropertyValues = {
  size_minutes: number
  status: TaskStatus
}

export default function TaskPropertyPicker({
  triggerRef,
  isOpen,
  values,
  onOpenChange,
  onSelect,
  closeOnSelect,
  selectableStatuses,
}: {
  triggerRef: React.RefObject<Element | null>
  isOpen: boolean
  values?: TaskPropertyValues
  onOpenChange: (open: boolean) => void
  onSelect: (values: Partial<TaskPropertyValues>) => void
  closeOnSelect?: boolean
  selectableStatuses: TaskStatus[]
}) {
  const [innerValues, setInnerValues] = useState<TaskPropertyValues>(
    values ?? { size_minutes: 5, status: "DRAFT" }
  )

  const showStatusPicker = selectableStatuses.length > 0
  const statusSelection = innerValues.status ? new Set([innerValues.status]) : new Set([])
  const handleStatusSelect = (selection: Selection) => {
    const status = [...selection][0]
    if (!status) return
    setInnerValues((prev) => ({ ...prev, status: status as TaskStatus }))
    onSelect({ status: status as TaskStatus })
    if (closeOnSelect) onOpenChange(false)
  }

  const sizeSelection = innerValues.size_minutes ? new Set([innerValues.size_minutes]) : new Set([])
  const handleSizeSelect = (selection: Selection) => {
    const size = [...selection][0]
    if (typeof size !== "number") return
    setInnerValues((prev) => ({ ...prev, size_minutes: size }))
    onSelect({ size_minutes: size })
    if (closeOnSelect) onOpenChange(false)
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      placement="bottom end"
      offset={2}
      className={twMerge(popover(), "flex flex-col gap-8 p-12")}
    >
      {showStatusPicker && (
        <div className="flex flex-col gap-4">
          <p className="text-medium text-sm text-neutral-500">Status</p>
          <ListBox
            aria-label="Select Status"
            selectionMode="single"
            selectedKeys={statusSelection}
            onSelectionChange={handleStatusSelect}
            orientation="horizontal"
            className="flex items-center gap-8"
          >
            {selectableStatuses.map((status) => {
              const statusUI = taskStatusUIMap[status]
              return (
                <ListBoxItem
                  key={status}
                  id={status}
                  textValue={statusUI.label}
                  className={twMerge(
                    interactive(),
                    chip({ color: statusUI.color as ChipProps["color"], weight: "medium" }),
                    "not-focus-visible:data-selected:outline-2 not-focus-visible:data-selected:outline-neutral-400"
                  )}
                >
                  <Icon path={statusUI.mdiIconPath} />
                  {statusUI.label}
                </ListBoxItem>
              )
            })}
          </ListBox>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <p className="text-medium text-sm text-neutral-500">Size</p>
        <ListBox
          aria-label="Select Size"
          selectionMode="single"
          selectedKeys={sizeSelection}
          onSelectionChange={handleSizeSelect}
          orientation="horizontal"
          className="flex items-center gap-4"
        >
          {taskSizeOptions.map((option) => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              textValue={option.label}
              className={twMerge(
                interactive(),
                "rounded-full",
                "not-focus-visible:data-selected:outline-2 not-focus-visible:data-selected:outline-neutral-400"
              )}
            >
              <TaskSizeChip minutes={option.value} status={innerValues.status ?? "DRAFT"} />
            </ListBoxItem>
          ))}
        </ListBox>
      </div>
    </Popover>
  )
}
