import { twMerge } from "tailwind-merge"
import { useRef } from "react"
import { isTextDropItem, useDrop } from "react-aria"
import { Tasklist, Timeslot } from "@zenstackhq/runtime/models"
import { LoaderIcon } from "lucide-react"
import { CalendarTimeblockTimeslots } from "./calendar-timeblock-timeslots"
import { getTemporalStatus, Timeblock } from "@/lib/utils-temporal"
import { iconBox } from "@/styles/class-names"
import { useCreateTimeslot, useUpdateManyTimeslot } from "@/database/generated/hooks"

export default function CalendarTimeblock({
  dateString,
  timeblock,
}: {
  dateString: string
  timeblock: Timeblock
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { dropProps, isDropTarget } = useDrop({
    ref,
    getDropOperation: (types) => {
      if (types.has("timeslot")) return "move"
      if (types.has("tasklist")) return "copy"
      return "cancel"
    },
    onDrop: async (e) => {
      // handle timeslot drop
      const timeslots = await Promise.all<Timeslot>(
        e.items
          .filter(isTextDropItem)
          .filter((item) => item.types.has("timeslot"))
          .map(async (timeslot) => {
            return JSON.parse(await timeslot.getText("timeslot"))
          })
      )
      if (timeslots.length > 0) {
        if (timeslots[0].date === dateString && timeslots[0].start_time === timeblock.startTime)
          return
        handleTimeslotsDrop(timeslots)
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
        handleTasklistsDrop(tasklists)
      }
    },
  })

  const updateTimeslotsMutation = useUpdateManyTimeslot()
  const handleTimeslotsDrop = (timeslots: Timeslot[]) => {
    updateTimeslotsMutation.mutate({
      where: { id: { in: timeslots.map((timeslot) => timeslot.id) } },
      data: {
        date: dateString,
        start_time: timeblock.startTime,
        end_time: timeblock.endTime,
      },
    })
  }

  const createTimeslotMutation = useCreateTimeslot()
  const handleTasklistsDrop = (tasklists: Tasklist[]) => {
    tasklists.forEach((tasklist) => {
      createTimeslotMutation.mutate({
        data: {
          date: dateString,
          start_time: timeblock.startTime,
          end_time: timeblock.endTime,
          tasklist: { connect: { id: tasklist.id } },
        },
      })
    })
  }

  const isDropPending = createTimeslotMutation.isPending || updateTimeslotsMutation.isPending

  const temporalStatus = getTemporalStatus({
    date: dateString,
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
        <CalendarTimeblockTimeslots dateString={dateString} timeblock={timeblock} />
      </div>
    </div>
  )
}
