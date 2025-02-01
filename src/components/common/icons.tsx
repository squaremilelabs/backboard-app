import { Bookmark, SquareCheck } from "lucide-react"
import { twMerge } from "tailwind-merge"

const boxIconBaseClasses = "w-[32px] h-[32px] flex items-center justify-center rounded-xs"

export function TaskBoxIcon() {
  return (
    <div className={twMerge(boxIconBaseClasses, "bg-gold-600 text-gold-100")}>
      <SquareCheck size={20} strokeWidth={2.5} />
    </div>
  )
}

export function TopicBoxIcon() {
  return (
    <div className={twMerge(boxIconBaseClasses, "bg-blue-600 text-blue-100")}>
      <Bookmark size={20} strokeWidth={2.5} />
    </div>
  )
}
