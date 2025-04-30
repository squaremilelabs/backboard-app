import { TaskStatus } from "@zenstackhq/runtime/models"
import { ReactNode, useEffect, useState } from "react"
import { Button, Dialog, DialogTrigger, ListBox, ListBoxItem, Popover } from "react-aria-components"
import { ClassNameValue, twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"
import { getTaskSizeTier, taskSizeOptions, TaskSizeTier } from "@/lib/utils-task"
import { formatMinutes } from "@/lib/utils-common"

export function TaskSizeChip({
  minutes,
  status,
  children,
  tierOverride,
  className,
  overdue,
}: {
  minutes: number | null | undefined
  status: TaskStatus
  tierOverride?: TaskSizeTier
  children?: ReactNode
  className?: string
  overdue?: boolean
}) {
  const tier = tierOverride ?? getTaskSizeTier(minutes)
  const text = !minutes ? "-" : formatMinutes(minutes)
  return (
    <div className={taskSizeClassName({ status, tier, className, overdue })}>
      {children ?? text}
    </div>
  )
}

export function TaskSizeSelect({
  value,
  onValueChange,
  status,
  className,
  isDisabled,
}: {
  value: number
  onValueChange: (value: number) => void
  status: TaskStatus
  className?: ClassNameValue
  isDisabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [innerValue, setInnerValue] = useState<number>(value)
  const selectedTier = getTaskSizeTier(innerValue)
  const selectedText = formatMinutes(innerValue)

  useEffect(() => {
    if (value !== innerValue) {
      onValueChange(innerValue)
    }
  }, [value, onValueChange, innerValue])

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        isDisabled={isDisabled}
        className={taskSizeClassName({
          status,
          tier: selectedTier,
          class: twMerge("cursor-pointer hover:opacity-70", className),
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
            onSelectionChange={(selection) => {
              setInnerValue([...selection][0] as number)
              setIsOpen(false)
            }}
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
    "border rounded-full truncate",
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
    overdue: {
      true: "bg-red-50 border-red-300 text-red-700",
    },
  },
  compoundVariants: [
    // DRAFT
    {
      status: "DRAFT",
      tier: "zero",
      overdue: false,
      class: `text-neutral-400`,
    },
    {
      status: "DRAFT",
      tier: "low",
      overdue: false,
      class: `bg-neutral-100 text-neutral-600`,
    },
    {
      status: "DRAFT",
      tier: "medium",
      overdue: false,
      class: `bg-neutral-200 text-neutral-600`,
    },
    {
      status: "DRAFT",
      tier: "high",
      overdue: false,
      class: `bg-neutral-400 border-neutral-500 text-neutral-50`,
    },
    // TODO
    {
      status: "TODO",
      tier: "zero",
      overdue: false,
      class: `text-gold-400`,
    },
    {
      status: "TODO",
      tier: "low",
      overdue: false,
      class: `bg-gold-50 text-gold-600`,
    },
    {
      status: "TODO",
      tier: "medium",
      overdue: false,
      class: `bg-gold-200 text-gold-600`,
    },
    {
      status: "TODO",
      tier: "high",
      overdue: false,
      class: `bg-gold-400 border-gold-500 text-gold-50`,
    },
    // DONE
    {
      status: "DONE",
      tier: "zero",
      class: `border-blue-300 text-blue-400`,
    },
    {
      status: "DONE",
      tier: "low",
      class: `bg-blue-50 border-blue-300 text-blue-600`,
    },
    {
      status: "DONE",
      tier: "medium",
      class: `bg-blue-200 border-blue-300 text-blue-600`,
    },
    {
      status: "DONE",
      tier: "high",
      class: `bg-blue-400 border-blue-500 text-blue-50`,
    },
  ],
  defaultVariants: {
    status: "DRAFT",
    tier: "low",
  },
})
