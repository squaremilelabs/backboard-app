"use client"
import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { ChevronDownIcon } from "lucide-react"
import { TasklistTimeslotPanel } from "./tasklist-timeslot-panel"
import { TasklistBacklogPanel } from "./tasklist-backlog-panel"
import TasklistCalendarGrid from "./tasklist-calendar-grid"
import { TasklistTitle } from "./tasklist-title"
import { TasklistBacklogTarget } from "./tasklist-backlog-target"
import TasklistContent from "./tasklist-content"
import { useRouterUtility } from "@/lib/router-utility"
import { useLocalStorageUtility } from "@/lib/storage-utility"
import { useTimeslotsQuery } from "@/lib/query-timeslots"
import { iconBox, interactive } from "@/styles/class-names"
import { WeekNavigator } from "@/components/portables/week-navigator"

export function TasklistPage() {
  const router = useRouterUtility()
  const tasklistId = router.params.tasklist_id
  const timeslotId = router.query.timeslot
  const [isExpanded, setIsExpanded] = useLocalStorageUtility("tasklist-calendar-open", false)

  const { getTasklistTimeslots } = useTimeslotsQuery()
  const tasks = getTasklistTimeslots(tasklistId ?? "")?.flatMap((timeslot) => timeslot.tasks)

  return (
    <div
      className={twMerge(
        "flex max-h-full w-sm max-w-full flex-col p-8 md:p-16",
        isExpanded ? "gap-24" : "gap-16"
      )}
    >
      <Disclosure
        isExpanded={isExpanded}
        onExpandedChange={setIsExpanded}
        className="@container/tasklist-page-disclosure flex max-w-full flex-col data-expanded:gap-8"
      >
        <Heading className={twMerge("flex items-center gap-8")}>
          <TasklistTitle tasklistId={tasklistId} />
          <Button
            slot="trigger"
            className={twMerge(
              interactive(),
              iconBox({ size: "large" }),
              isExpanded ? "rotate-0" : "rotate-90",
              "transition-transform"
            )}
          >
            <ChevronDownIcon />
          </Button>
        </Heading>
        <DisclosurePanel className="flex flex-col gap-24">
          <TasklistContent tasklistId={tasklistId} />
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-8">
              <WeekNavigator
                className={twMerge("py-2", !timeslotId ? "opacity-60 hover:opacity-100" : "")}
                summaryTasks={tasks}
              />
              <TasklistBacklogTarget tasklistId={tasklistId} />
            </div>
            <div className="max-w-full overflow-auto p-2">
              <TasklistCalendarGrid tasklistId={tasklistId} />
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
      <div className="grow overflow-auto">
        {timeslotId ? (
          <TasklistTimeslotPanel timeslotId={timeslotId} />
        ) : (
          <TasklistBacklogPanel tasklistId={tasklistId} />
        )}
      </div>
    </div>
  )
}
