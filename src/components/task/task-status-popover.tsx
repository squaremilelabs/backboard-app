import {
  Button,
  Dialog,
  DialogTrigger,
  ListBox,
  ListBoxItem,
  Popover,
  Selection,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"
import { Task, TaskStatus } from "@zenstackhq/runtime/models"
import TaskStatusChip from "./task-status-chip-OLD"
import { formatMinutes } from "@/lib/utils"
import { useDebouncedEffect } from "@/lib/hooks"

type TaskStatusPopoverValues = Pick<Task, "status" | "size_minutes">

export default function TaskStatusPopover({
  initialValues,
  onValuesChange,
  disabledStatuses = [],
  isDebounced,
}: {
  initialValues: TaskStatusPopoverValues
  onValuesChange: (values: TaskStatusPopoverValues) => void
  disabledStatuses?: TaskStatus[]
  isDebounced?: boolean
}) {
  const [innerValues, setInnerValues] = useState<TaskStatusPopoverValues>({
    status: initialValues.status,
    size_minutes: initialValues.size_minutes,
  })

  useEffect(() => {
    setInnerValues({
      status: initialValues.status,
      size_minutes: initialValues.size_minutes,
    })
  }, [initialValues])

  useDebouncedEffect(
    () => {
      if (
        initialValues.status !== innerValues.status ||
        initialValues.size_minutes !== innerValues.size_minutes
      ) {
        onValuesChange(innerValues)
      }
    },
    [innerValues],
    isDebounced ? 1000 : 0
  )

  const handleStatusSelect = (selection: Selection) => {
    const selectedStatus = [...selection][0] as TaskStatus
    setInnerValues((prev) => ({
      ...prev,
      status: selectedStatus,
    }))
  }

  const handleSizeSelect = (selection: Selection) => {
    const selectedSize = [...selection][0] as number
    setInnerValues((prev) => ({
      ...prev,
      size_minutes: selectedSize,
    }))
  }

  return (
    <DialogTrigger>
      <Button
        className={twMerge(
          "flex items-center rounded-md",
          "p-4",
          "cursor-pointer hover:bg-neutral-100"
        )}
      >
        {innerValues.status ? (
          <TaskStatusChip
            status={innerValues.status}
            text={formatMinutes(innerValues.size_minutes)}
          />
        ) : null}
      </Button>
      <Popover placement="right top" offset={8}>
        <Dialog
          className={twMerge(
            "flex flex-col gap-8",
            "bg-canvas/30 rounded-lg border-2 border-neutral-200 p-16 backdrop-blur-lg"
          )}
        >
          <p className="text-sm font-medium text-neutral-600">Status</p>
          <ListBox
            aria-label="Set Status"
            orientation="horizontal"
            selectionMode="single"
            selectedKeys={innerValues.status ? new Set([innerValues.status]) : new Set([])}
            className="flex items-center gap-2"
            onSelectionChange={handleStatusSelect}
            disallowEmptySelection
          >
            {statusOptions.map((option) => {
              const isDisabled = disabledStatuses.includes(option)
              return (
                <ListBoxItem
                  key={option}
                  id={option}
                  className={listBoxItemClassName}
                  isDisabled={isDisabled}
                  textValue={option}
                >
                  <TaskStatusChip status={option} />
                </ListBoxItem>
              )
            })}
          </ListBox>
          <div className="h-1 w-full bg-neutral-300" />
          <p className="text-sm font-medium text-neutral-600">Size</p>
          <ListBox
            aria-label="Set Size"
            orientation="horizontal"
            selectionMode="single"
            selectedKeys={
              innerValues.size_minutes ? new Set([innerValues.size_minutes]) : new Set([])
            }
            className="flex items-center gap-2"
            onSelectionChange={handleSizeSelect}
            disallowEmptySelection
          >
            {sizeOptions.map((option) => (
              <ListBoxItem
                key={option.value}
                id={option.value}
                className={listBoxItemClassName}
                textValue={option.label}
              >
                <span className="text-md rounded-md border bg-neutral-100 px-4 py-2 text-sm">
                  {option.label}
                </span>
              </ListBoxItem>
            ))}
          </ListBox>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

const statusOptions: TaskStatus[] = ["DRAFT", "TODO", "DONE"]

const sizeOptions: { value: number; label: string }[] = [
  { value: 5, label: "5m" },
  { value: 15, label: "15m" },
  { value: 30, label: "30m" },
  { value: 60, label: "1h" },
  { value: 120, label: "2h" },
  { value: 240, label: "4h" },
]

const listBoxItemClassName = twMerge(
  "rounded-md p-4",
  "data-selected:bg-neutral-300",
  "not-data-disabled:hover:bg-neutral-200",
  "not-data-disabled:cursor-pointer",
  "data-disabled:opacity-50"
)
