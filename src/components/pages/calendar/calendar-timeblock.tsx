import { twMerge } from "tailwind-merge"
import { useRef } from "react"
import { isTextDropItem, useDrop } from "react-aria"
import { Tasklist, Timeslot } from "@zenstackhq/runtime/models"
import { LoaderIcon } from "lucide-react"
import { Task } from "@prisma/client"
import { CalendarTimeblockTimeslots } from "./calendar-timeblock-timeslots"
import { getTemporalStatus, Timeblock } from "@/lib/utils-temporal"
import { iconBox } from "@/styles/class-names"
import { useTimeblockDrop } from "@/lib/timeblock-drop"

type ExpandedTimeslot = Timeslot & { tasklist: Tasklist; tasks: Task[] }

export function CalendarTimeblock({ date, timeblock }: { date: string; timeblock: Timeblock }) {
  const { handleTimeslotDrop, handleTasklistDrop, isDropPending } = useTimeblockDrop({
    date,
    timeblock,
  })

  const ref = useRef<HTMLDivElement>(null)
  const { dropProps, isDropTarget } = useDrop({
    ref,
    getDropOperation: () => "move",
    onDrop: async (e) => {
      // handle timeslot drop
      const timeslots = await Promise.all<ExpandedTimeslot>(
        e.items
          .filter(isTextDropItem)
          .filter((item) => item.types.has("timeslot"))
          .map(async (timeslot) => {
            return JSON.parse(await timeslot.getText("timeslot"))
          })
      )
      if (timeslots.length > 0) {
        handleTimeslotDrop(timeslots[0])
      }
      // handle tasklist drop
      const tasklists = await Promise.all<Tasklist>(
        e.items
          .filter(isTextDropItem)
          .filter((item) => item.types.has("tasklist"))
          .map(async (tasklist) => {
            return JSON.parse(await tasklist.getText("tasklist"))
          })
      )
      if (tasklists.length > 0) {
        handleTasklistDrop(tasklists[0])
      }
    },
  })

  const temporalStatus = getTemporalStatus({
    date: date,
    startTime: timeblock.startTime,
    endTime: timeblock.endTime,
  })

  return (
    <div
      ref={ref}
      {...dropProps}
      className={twMerge(
        "rounded-lg border border-neutral-200",
        "overflow-auto",
        temporalStatus === "past" ? "bg-neutral-100" : "bg-canvas",
        isDropTarget ? "outline" : ""
      )}
    >
      <div
        className={twMerge(
          "sticky top-0 flex items-center gap-4 p-8",
          "z-10 backdrop-blur-lg",
          temporalStatus === "past" ? "bg-neutral-100/50" : "bg-canvas/50"
        )}
      >
        <div className={iconBox({ size: "small" })}>
          <timeblock.Icon />
        </div>
        <p className="text-sm">{timeblock.label}</p>
        <p className="text-sm text-neutral-500">({timeblock.subLabel})</p>
        <div className="grow" />
        {isDropPending && (
          <div className={iconBox({ size: "base", className: "text-gold-500 animate-spin" })}>
            <LoaderIcon />
          </div>
        )}
      </div>
      <div className="h-120 min-h-120">
        <CalendarTimeblockTimeslots date={date} timeblock={timeblock} />
      </div>
    </div>
  )
}
