"use client"

import { Suspense } from "react"
import TimeslotModal from "./timeslot-modal"
import WeekGrid from "./week-grid"

export default function SchedulePage() {
  return (
    <Suspense>
      <div className="grid">
        <WeekGrid />
        <TimeslotModal />
      </div>
    </Suspense>
  )
}
