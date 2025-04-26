import { TaskStatus } from "@zenstackhq/runtime/models"
import { ReactNode, useEffect, useState } from "react"
import { Button, Dialog, DialogTrigger, ListBox, ListBoxItem, Popover } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"
import { getTaskSizeTier, taskSizeOptions } from "./constants"
import { formatMinutes } from "@/lib/utils"

export function TaskSizeChip({
  minutes,
  status,
  children,
  className,
}: {
  minutes: number | null | undefined
  status: TaskStatus
  children?: ReactNode
  className?: string
}) {
  const tier = getTaskSizeTier(minutes)
  const text = !minutes ? "-" : formatMinutes(minutes)
  return <div className={taskSizeClassName({ status, tier, className })}>{children ?? text}</div>
}

export function TaskSizeSelect({
  value,
  onValueChange,
  status,
}: {
  value: number
  onValueChange: (value: number) => void
  status: TaskStatus
}) {
  const [innerValue, setInnerValue] = useState<number>(value)
  const selectedTier = getTaskSizeTier(innerValue)
  const selectedText = formatMinutes(innerValue)

  useEffect(() => {
    if (value !== innerValue) {
      onValueChange(innerValue)
    }
  }, [value, onValueChange, innerValue])

  return (
    <DialogTrigger>
      <Button
        className={taskSizeClassName({
          status,
          tier: selectedTier,
          class: "cursor-pointer hover:opacity-70",
        })}
      >
        {selectedText}
      </Button>
      <Popover placement="left" offset={4}>
        <Dialog className={twMerge("bg-canvas/30 rounded-xl border-2 p-4 backdrop-blur-lg")}>
          <ListBox
            aria-label="Select Size"
            selectionMode="single"
            orientation="horizontal"
            selectedKeys={new Set([innerValue])}
            onSelectionChange={(selection) => setInnerValue([...selection][0] as number)}
            disallowEmptySelection
            className={twMerge("flex gap-4")}
            autoFocus
          >
            {taskSizeOptions.map((option) => {
              const optionTier = getTaskSizeTier(option.value)
              return (
                <ListBoxItem
                  key={option.value}
                  id={option.value}
                  className={taskSizeClassName({
                    status,
                    tier: optionTier,
                    class: "cursor-pointer ring-neutral-500 hover:opacity-70 data-selected:ring-2",
                  })}
                  textValue={option.label}
                >
                  {option.label}
                </ListBoxItem>
              )
            })}
          </ListBox>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

export const taskSizeClassName = tv({
  base: [
    "flex items-center justify-center",
    "border rounded-full",
    "min-w-40 px-8 py-1",
    "text-sm",
    "font-semibold",
  ],
  variants: {
    status: {
      DRAFT: `border-neutral-300`,
      TODO: `border-gold-300`,
      DONE: `border-blue-300`,
    },
    tier: {
      zero: "bg-transparent",
      low: "",
      medium: "",
      high: "",
    },
  },
  compoundVariants: [
    // DRAFT
    {
      status: "DRAFT",
      tier: "zero",
      class: `text-neutral-300`,
    },
    {
      status: "DRAFT",
      tier: "low",
      class: `bg-neutral-50 text-neutral-600`,
    },
    {
      status: "DRAFT",
      tier: "medium",
      class: `bg-neutral-200 text-neutral-600`,
    },
    {
      status: "DRAFT",
      tier: "high",
      class: `bg-neutral-500 text-neutral-50`,
    },
    // TODO
    {
      status: "TODO",
      tier: "zero",
      class: `text-gold-300`,
    },
    {
      status: "TODO",
      tier: "low",
      class: `bg-gold-50 text-gold-600`,
    },
    {
      status: "TODO",
      tier: "medium",
      class: `bg-gold-200 text-gold-600`,
    },
    {
      status: "TODO",
      tier: "high",
      class: `bg-gold-500 text-gold-50`,
    },
    // DONE
    {
      status: "DONE",
      tier: "zero",
      class: `text-blue-300`,
    },
    {
      status: "DONE",
      tier: "low",
      class: `bg-blue-50 text-blue-600`,
    },
    {
      status: "DONE",
      tier: "medium",
      class: `bg-blue-200 text-blue-600`,
    },
    {
      status: "DONE",
      tier: "high",
      class: `bg-blue-500 text-blue-50`,
    },
  ],
  defaultVariants: {
    status: "DRAFT",
    tier: "low",
  },
})
