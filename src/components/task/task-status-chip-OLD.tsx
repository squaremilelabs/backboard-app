import { TaskStatus } from "@prisma/client"
import { CircleCheckBigIcon, CircleDashedIcon, CircleIcon, LucideIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

const taskStatusUIMap: Record<
  TaskStatus,
  { Icon: LucideIcon; label: string; colorClassName: string }
> = {
  TODO: {
    Icon: CircleIcon,
    label: "To-do",
    colorClassName: "text-gold-500 border-gold-300 bg-gold-100",
  },
  DRAFT: {
    Icon: CircleDashedIcon,
    label: "Draft",
    colorClassName: "text-neutral-500 border-neutral-300 bg-neutral-100",
  },
  DONE: {
    Icon: CircleCheckBigIcon,
    label: "Done",
    colorClassName: "text-blue-500 border-blue-300 bg-blue-100",
  },
}

export default function TaskStatusChip({ status, text }: { status: TaskStatus; text?: string }) {
  const ui = taskStatusUIMap[status]
  return (
    <div
      className={twMerge(
        "flex items-center rounded-md border",
        "h-20 gap-4 px-4",
        ui.colorClassName
      )}
    >
      <div className={"w-14"}>
        <ui.Icon size={14} />
      </div>
      <span className={twMerge("min-w-20 text-sm")}>{text ?? ui.label}</span>
    </div>
  )
}
