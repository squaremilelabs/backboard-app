import { Timeblock } from "./utils-temporal"
import { useWeekState } from "./week-state"
import { useFindManyTimeslot } from "@/database/generated/hooks"

export function useTimeslotsQuery() {
  const { activeWeekDates } = useWeekState()
  const { data: timeslots, ...timeslotsQuery } = useFindManyTimeslot({
    where: { date: { in: activeWeekDates } },
    include: { tasklist: true, tasks: true },
  })

  const getDateTimeslots = (date: string) => {
    return timeslots?.filter((timeslot) => timeslot.date === date)
  }

  const getTimeblockTimeslots = (date: string, timeblock: Timeblock) => {
    return timeslots?.filter(
      (timeslot) => timeslot.date === date && timeslot.start_time === timeblock.startTime
    )
  }

  const getTasklistTimeslots = (tasklistId: string) => {
    return timeslots?.filter((timeslot) => timeslot.tasklist_id === tasklistId)
  }

  return {
    timeslots,
    getDateTimeslots,
    getTimeblockTimeslots,
    getTasklistTimeslots,
    timeslotsQuery,
  }
}
