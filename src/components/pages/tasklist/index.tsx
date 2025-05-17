"use client"
import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { TasklistTimeslotPanel } from "./tasklist-timeslot-panel"
import { TasklistBacklogPanel } from "./tasklist-backlog-panel"
import TasklistCalendarGrid from "./tasklist-calendar-grid"
import { TasklistBacklogTarget } from "./tasklist-backlog-target"
import { useRouterUtility } from "@/lib/router-utility"
import { WeekNavigator } from "@/components/portables/week-navigator"
import { useDeleteTimeslot } from "@/database/generated/hooks"
import { ConfirmationButton } from "@/components/primitives/confirmation-button"
import { interactive } from "@/styles/class-names"

export function TasklistPage() {
  const router = useRouterUtility()
  const tasklistId = router.params.tasklist_id
  const timeslotId = router.query.timeslot

  const deleteTimeslotMutation = useDeleteTimeslot()
  const handleDeleteTimeslot = () => {
    if (timeslotId) {
      router.push({ path: `/tasklist/${tasklistId}` })
      deleteTimeslotMutation.mutate({ where: { id: timeslotId } })
    }
  }

  return (
    <div className="flex w-sm max-w-full flex-col gap-16 p-16">
      <div className="flex flex-col gap-8">
        <div className="flex items-center">
          <WeekNavigator className="rounded-md border-none bg-transparent p-0" />
          <div className="grow" />
          <TasklistBacklogTarget tasklistId={tasklistId} />
        </div>
        <TasklistCalendarGrid tasklistId={tasklistId} />
      </div>
      {timeslotId ? (
        <>
          <TasklistTimeslotPanel timeslotId={timeslotId} />
          <ConfirmationButton
            onConfirm={handleDeleteTimeslot}
            content="Any tasks will be moved to the Backlog."
            confirmButtonText="Remove"
            isDestructive
          >
            <Button
              className={twMerge(
                interactive({ hover: "underline" }),
                "self-end text-sm text-neutral-500",
                deleteTimeslotMutation.isPending ? "hidden" : ""
              )}
            >
              Remove from calendar
            </Button>
          </ConfirmationButton>
        </>
      ) : (
        <TasklistBacklogPanel tasklistId={tasklistId} />
      )}
    </div>
  )
}
