"use client"

import { twMerge } from "tailwind-merge"
import TimeslotTaskListPanel from "@/components/schedule/timeslot-tasks-panel"
import { useScheduleParams } from "@/lib/schedule"
import WeekGrid from "@/components/schedule/week-grid"

export default function SchedulePage() {
  const { timeslotId } = useScheduleParams()
  return (
    <div className="grid grid-cols-12 grid-rows-1 gap-8">
      <div className={twMerge("row-span-1", timeslotId ? "col-span-6" : "col-span-12")}>
        <WeekGrid />
      </div>
      {timeslotId ? (
        <div className="col-span-6">
          <TimeslotTaskListPanel timeslotId={timeslotId} />
        </div>
      ) : null}
    </div>
  )
}
