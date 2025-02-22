import { Popover as RadixPopover } from "radix-ui"
import React from "react"
import { ClassNameValue, twMerge } from "tailwind-merge"

type PopoverPlacement =
  | "bottom-start"
  | "bottom-center"
  | "bottom-end"
  | "top-start"
  | "top-center"
  | "top-end"
  | "left-start"
  | "left-center"
  | "left-end"
  | "right-start"
  | "right-center"
  | "right-end"

export default function Popover({
  open,
  onOpenChange,
  triggerContent,
  triggerClassName,
  popoverContent,
  popoverClassName,
  placement = "bottom-start",
  offset = [4, 0],
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerContent: React.ReactNode
  triggerClassName?: ClassNameValue
  popoverContent: React.ReactNode
  popoverClassName?: ClassNameValue
  placement?: PopoverPlacement
  offset?: [number, number]
}) {
  const [side, align] = placement.split("-")
  const [sideOffset, alignOffset] = offset
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger
        className={twMerge(
          "cursor-pointer hover:opacity-80",
          "data-[state=open]:scale-95",
          triggerClassName
        )}
      >
        {triggerContent}
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align={align as "start" | "center" | "end"}
          side={side as "bottom" | "top" | "left" | "right"}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className={twMerge("bg-canvas rounded border p-2 shadow-sm", popoverClassName)}
        >
          {popoverContent}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
