import {
  CircleIcon,
  Clock12Icon,
  Clock5Icon,
  Clock7Icon,
  Clock9Icon,
  LucideIcon,
} from "lucide-react"
import { formatTimeString } from "./utils-common"

export type Timeblock = {
  startTime: string
  endTime: string
  label: string
  subLabel?: string
  Icon: LucideIcon
}

export const presetTimeblocks: Timeblock[] = [
  {
    startTime: "00:00",
    endTime: "09:00",
    label: "Early Morning",
    subLabel: "Before 9am",
    Icon: Clock7Icon,
  },
  {
    startTime: "09:00",
    endTime: "12:00",
    label: "Morning",
    subLabel: "9am to 12pm",
    Icon: Clock9Icon,
  },
  {
    startTime: "12:00",
    endTime: "17:00",
    label: "Afternoon",
    subLabel: "12pm to 5pm",
    Icon: Clock12Icon,
  },
  {
    startTime: "17:00",
    endTime: "23:59",
    label: "Evening",
    subLabel: "After 5pm",
    Icon: Clock5Icon,
  },
]

export const getTimeblock = ({
  startTime,
  endTime,
}: {
  startTime: string
  endTime: string
}): Timeblock => {
  const presetTimeblock = presetTimeblocks.find(
    (t) => t.startTime === startTime && t.endTime === endTime
  )
  if (presetTimeblock) return presetTimeblock
  if (startTime === "00:00" && endTime === "23:59") {
    return {
      startTime,
      endTime,
      label: "Anytime",
      Icon: CircleIcon,
    }
  }
  return {
    startTime: formatTimeString(startTime),
    endTime: formatTimeString(endTime),
    label: `${formatTimeString(startTime)} to ${formatTimeString(endTime)}`,
    Icon: CircleIcon,
  }
}
