import { TaskStatus } from "@prisma/client"
import { useEffect, useState } from "react"
import { Button, ListBox, ListBoxItem, Popover, Select, SelectValue } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { taskStatuses, taskStatusUIMap } from "./utilities"

export function TaskStatusSelect({
  value,
  onValueChange,
  disabledStatuses = [],
}: {
  value: TaskStatus
  onValueChange: (value: TaskStatus) => void
  disabledStatuses?: TaskStatus[]
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
      disabledKeys={disabledStatuses}
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
        className={twMerge("bg-canvas/30 rounded-xl border-2 p-4 backdrop-blur-lg")}
      >
        <ListBox className="flex flex-col gap-4">
          {taskStatuses.map((status) => {
            const optionUI = taskStatusUIMap[status]
            return (
              <ListBoxItem
                key={status}
                id={status}
                textValue={optionUI.label}
                className={twMerge(
                  "flex items-center gap-2 rounded-full border px-4 py-2",
                  "cursor-pointer hover:opacity-70",
                  "data-disabled:cursor-not-allowed data-disabled:opacity-30",
                  "data-selected:outline-2"
                )}
                style={{
                  color: `var(--bb-${optionUI.color}-50)`,
                  background: `var(--bb-${optionUI.color}-500)`,
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
