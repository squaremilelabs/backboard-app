"use client"

import { Suspense } from "react"
import TimeslotModal from "./timeslot-modal"
import Week from "./week"

export default function SchedulePage() {
  return (
    <Suspense>
      <Week />
      <TimeslotModal />
    </Suspense>
  )
}
