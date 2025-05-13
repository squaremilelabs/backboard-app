"use client"

import CalendarNavigator from "./calendar-navigator"
import CalendarTasklistGridList from "./calendar-tasklists-list"

export default function CalendarSidebar() {
  return (
    <div className="flex flex-col gap-8 overflow-auto p-16">
      <CalendarNavigator />
      <CalendarTasklistGridList />
    </div>
  )
}
