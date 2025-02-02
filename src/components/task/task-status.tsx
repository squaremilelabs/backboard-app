import { TaskStatus } from "@prisma/client"
import {
  CircleCheckBig,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  CircleX,
  LucideIcon,
} from "lucide-react"
import React from "react"
import { Button, ButtonProps } from "react-aria-components"
import { ClassNameValue, twMerge } from "tailwind-merge"

const taskStatusDisplayMap: Record<
  TaskStatus,
  { label: string; Icon: LucideIcon; colorClassName: string }
> = {
  DRAFT: { label: "Draft", Icon: CircleDashed, colorClassName: "bg-neutral-200 text-neutral-700" },
  TO_DO: { label: "To-do", Icon: CircleDot, colorClassName: "bg-gold-200 text-gold-700" },
  BLOCKED: { label: "Blocked", Icon: CircleDotDashed, colorClassName: "bg-red-200 text-red-700" },
  DONE: { label: "Done", Icon: CircleCheckBig, colorClassName: "bg-green-200 text-green-700" },
  CANCELED: { label: "Canceled", Icon: CircleX, colorClassName: "bg-neutral-200 text-neutral-700" },
}

export function TaskStatusButton({
  status,
  className,
  ...buttonProps
}: {
  status: TaskStatus
  className?: ClassNameValue
} & Omit<ButtonProps, "className" | "children">) {
  const { label, Icon, colorClassName } = taskStatusDisplayMap[status]
  return (
    <Button
      className={twMerge(
        "flex h-[30px] cursor-pointer items-center space-x-1 px-2 hover:opacity-80",
        colorClassName,
        className
      )}
      {...buttonProps}
    >
      <Icon size={16} />
      <span>{label}</span>
    </Button>
  )
}
