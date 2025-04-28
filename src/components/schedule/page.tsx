import TimeslotModal from "./timeslot-modal"
import WeekGrid from "./week-grid"

export default function SchedulePage() {
  return (
    <div className="grid">
      <WeekGrid />
      <TimeslotModal />
    </div>
  )
}
