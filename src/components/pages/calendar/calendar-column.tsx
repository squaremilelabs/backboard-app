import { CalendarTimeblock } from "./calendar-timeblock"
import { presetTimeblocks } from "@/lib/utils-temporal"

export function CalendarColumn({ dateString }: { dateString: string }) {
  return (
    <div className="grid w-xs grid-rows-3 gap-4">
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
