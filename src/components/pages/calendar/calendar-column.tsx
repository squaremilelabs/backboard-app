import { CalendarTimeblock } from "./calendar-timeblock"
import { presetTimeblocks } from "@/lib/utils-temporal"

export function CalendarColumn({ dateString }: { dateString: string }) {
  return (
    <>
      {presetTimeblocks.map((timeblock) => (
        <CalendarTimeblock key={timeblock.startTime} date={dateString} timeblock={timeblock} />
      ))}
    </>
  )
}
