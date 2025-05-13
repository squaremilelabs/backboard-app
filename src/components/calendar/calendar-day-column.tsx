import CalendarTimeblock from "./calendar-timeblock"
import { presetTimeblocks } from "@/lib/utils-timeslot"

export default function CalendarDayColumn({ dateString }: { dateString: string }) {
  return (
    <div className="flex w-xs flex-col gap-4">
      {presetTimeblocks.map((timeblock) => (
        <CalendarTimeblock
          key={timeblock.startTime}
          dateString={dateString}
          timeblock={timeblock}
        />
      ))}
    </div>
  )
}
