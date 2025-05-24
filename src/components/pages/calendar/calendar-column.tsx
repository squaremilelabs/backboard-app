import { CalendarTimeblock } from "./calendar-timeblock"
import { presetTimeblocks } from "@/lib/utils-temporal"

export function CalendarColumn({ date }: { date: string }) {
  return (
    <>
      {presetTimeblocks.map((timeblock) => {
        return <CalendarTimeblock key={timeblock.startTime} date={date} timeblock={timeblock} />
      })}
    </>
  )
}
