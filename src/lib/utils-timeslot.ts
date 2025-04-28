"use client"
export const dayHeaderHeight = 40
export const timeslotHeight = 100

export type PresetTimeslot = {
  startTime: string
  endTime: string
  midTime: string
}

export const presetTimeslots: PresetTimeslot[] = [
  { startTime: "07:00", midTime: "08:00", endTime: "09:00" },
  { startTime: "09:00", midTime: "10:00", endTime: "11:00" },
  { startTime: "11:00", midTime: "12:00", endTime: "13:00" },
  { startTime: "13:00", midTime: "14:00", endTime: "15:00" },
  { startTime: "15:00", midTime: "16:00", endTime: "17:00" },
  { startTime: "17:00", midTime: "18:00", endTime: "19:00" },
  { startTime: "19:00", midTime: "20:00", endTime: "21:00" },
]

export type TimeslotStatus = "past" | "current" | "future"

export function getTimeslotStatus({
  date,
  startTime,
  endTime,
}: {
  date: string
  startTime: string
  endTime: string
}): TimeslotStatus {
  const now = new Date()
  const startDateTime = new Date(`${date}T${startTime}`)
  const endDateTime = new Date(`${date}T${endTime}`)

  if (endDateTime < now) {
    return "past"
  } else if (startDateTime <= now && endDateTime >= now) {
    return "current"
  } else {
    return "future"
  }
}
