"use client"
import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { ChevronLeft } from "lucide-react"
import { TasklistTimeslotPanel } from "./tasklist-timeslot-panel"
import { TasklistBacklogPanel } from "./tasklist-backlog-panel"
import TasklistCalendarGrid from "./tasklist-calendar-grid"
import { TasklistHeader } from "./tasklist-header"
import { useRouterUtility } from "@/lib/router-utility"
import { WeekNavigator } from "@/components/portables/week-navigator"
import { useLocalStorageUtility } from "@/lib/storage-utility"
import { iconBox, interactive } from "@/styles/class-names"

export function TasklistPage() {
  const router = useRouterUtility()
  const tasklistId = router.params.tasklist_id
  const timeslotId = router.query.timeslot
  const [calendarOpen, setCalendarOpen] = useLocalStorageUtility("tasklist-calendar-open", false)

  return (
    <div
      className={twMerge("flex w-sm max-w-full flex-col p-16", calendarOpen ? "gap-24" : "gap-16")}
    >
      <TasklistHeader tasklistId={tasklistId} />
      {/* <div className="h-1 bg-neutral-200" /> */}
      <Disclosure
        isExpanded={calendarOpen}
        onExpandedChange={setCalendarOpen}
        className="flex max-w-full flex-col data-expanded:gap-8"
      >
        <Heading className={twMerge("flex items-center justify-between", calendarOpen ? "" : "")}>
          {calendarOpen && <WeekNavigator className="rounded-md border-none bg-transparent p-0" />}
          <Button
            slot="trigger"
            className={twMerge(
              interactive(),
              "flex items-center gap-4 transition-transform",
              calendarOpen ? "" : "grow"
            )}
          >
            <p
              className={twMerge(
                calendarOpen ? "text-sm text-neutral-500" : "px-8 font-medium text-neutral-500"
              )}
            >
              {calendarOpen ? "Hide calendar" : "Show calendar"}
            </p>
            {!calendarOpen && <div className="h-1 grow bg-neutral-200" />}
            <div
              className={iconBox({
                className: [
                  "transition-transform",
                  calendarOpen ? "-rotate-90 text-neutral-500" : "rotate-0 text-neutral-400",
                ],
              })}
            >
              <ChevronLeft />
            </div>
          </Button>
        </Heading>
        <DisclosurePanel className="max-w-full overflow-auto data-expanded:pb-4">
          <TasklistCalendarGrid tasklistId={tasklistId} />
        </DisclosurePanel>
      </Disclosure>
      {/* <div className="h-1 bg-neutral-200" /> */}
      {timeslotId ? (
        <TasklistTimeslotPanel timeslotId={timeslotId} />
      ) : (
        <TasklistBacklogPanel tasklistId={tasklistId} />
      )}
    </div>
  )
}
