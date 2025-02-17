import { TopicStatus } from "@prisma/client"
import {
  CircleDashed,
  CircleDotDashed,
  CircleDot,
  LucideIcon,
  CircleCheckBig,
  CircleX,
  Radius,
  Diameter,
} from "lucide-react"
import { ClassNameValue, twMerge } from "tailwind-merge"

type TopicStatusDisplayValue = {
  Icon: LucideIcon
  label: string
  color: "neutral" | "blue" | "purple" | "green"
}

const TOPIC_STATUS_DISPLAY_VALUES: Record<TopicStatus, TopicStatusDisplayValue> = {
  FUTURE: {
    Icon: CircleDashed,
    label: "Future",
    color: "neutral",
  },
  TABLED: {
    Icon: CircleDotDashed,
    label: "Tabled",
    color: "purple",
  },
  CURRENT: {
    Icon: CircleDot,
    label: "Current",
    color: "blue",
  },
  CLOSED: {
    Icon: CircleCheckBig,
    label: "Closed",
    color: "green",
  },
  CANCELED: {
    Icon: CircleX,
    label: "Canceled",
    color: "neutral",
  },
  MERGED: {
    Icon: Radius,
    label: "Merged",
    color: "neutral",
  },
  FORKED: {
    Icon: Diameter,
    label: "Forked",
    color: "neutral",
  },
}

export function getTopicStatusDisplayValue(status: TopicStatus) {
  return TOPIC_STATUS_DISPLAY_VALUES[status]
}

export function TopicStatusDisplay({
  status,
  className,
}: {
  status: TopicStatus
  className?: ClassNameValue
}) {
  const { Icon, label, color } = getTopicStatusDisplayValue(status)

  return (
    <div
      className={twMerge(
        "flex items-center space-x-1 rounded px-2 py-1",
        "[&_svg]:w-[16px]",
        color === "neutral" ? "bg-neutral-100 text-neutral-600" : "",
        color === "blue" ? "bg-blue-200 text-blue-700" : "",
        color === "purple" ? "bg-purple-100 text-purple-600" : "",
        color === "green" ? "bg-green-100 text-green-600" : "",
        className
      )}
    >
      <Icon />
      <span>{label}</span>
    </div>
  )
}
