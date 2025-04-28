import { TaskStatus } from "@prisma/client"
import { useEffect, useState } from "react"
import { Button, ListBox, ListBoxItem, Popover, Select, SelectValue } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { taskStatusUIMap } from "./utilities"

export function TaskStatusSelect({
  value,
  onValueChange,
  selectableStatuses,
}: {
  value: TaskStatus
  onValueChange: (value: TaskStatus) => void
  selectableStatuses: TaskStatus[]
}) {
  const [innerValue, setInnerValue] = useState<TaskStatus>(value)
  const selectedUI = taskStatusUIMap[innerValue]

  useEffect(() => {
    if (value !== innerValue) {
      onValueChange(innerValue)
    }
  }, [value, onValueChange, innerValue])

  return (
    <Select
      aria-label="Select Status"
      selectedKey={innerValue}
      onSelectionChange={(selection) => setInnerValue(selection as TaskStatus)}
    >
      <Button
        className={twMerge(
          "flex size-20 min-w-20 items-center justify-center rounded-md",
          "cursor-pointer hover:bg-neutral-200"
        )}
        style={{ color: `var(--bb-${selectedUI.color}-500)` }}
      >
        <SelectValue>
          <selectedUI.Icon size={16} />
        </SelectValue>
      </Button>
      <Popover
        offset={4}
        placement="right"
        className={twMerge("bg-canvas/30 rounded-xl border-2 p-2 backdrop-blur-lg")}
      >
        <ListBox className="flex items-center gap-4" orientation="horizontal">
          {selectableStatuses.map((status) => {
            const optionUI = taskStatusUIMap[status]
            return (
              <ListBoxItem
                key={status}
                id={status}
                textValue={optionUI.label}
                isDisabled={status === innerValue}
                className={twMerge(
                  "flex items-center gap-4 rounded-full border px-8 py-2",
                  "cursor-pointer hover:opacity-70",
                  "data-disabled:cursor-auto",
                  "ring-neutral-500 data-selected:ring-2"
                )}
                style={{
                  color: `var(--bb-${optionUI.color}-50)`,
                  background: `var(--bb-${optionUI.color}-400)`,
                  borderColor: `var(--bb-${optionUI.color}-300)`,
                }}
              >
                <optionUI.Icon size={14} />
                <span className="grow text-center text-sm font-medium">{optionUI.label}</span>
              </ListBoxItem>
            )
          })}
        </ListBox>
      </Popover>
    </Select>
  )
}
