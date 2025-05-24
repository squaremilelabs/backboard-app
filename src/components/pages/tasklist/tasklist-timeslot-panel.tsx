"use client"

import { parse } from "date-fns"
import { CalendarIcon, XIcon } from "lucide-react"
import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { useDrag } from "react-aria"
import { TaskPanel } from "@/components/templates/task-panel"
import {
  useDeleteTimeslot,
  useFindManyTask,
  useFindUniqueTimeslot,
  useUpdateTimeslot,
} from "@/database/generated/hooks"
import { formatDate } from "@/lib/utils-common"
import { iconBox, interactive } from "@/styles/class-names"
import { getTimeblock, TemporalStatus, getTemporalStatusFromTimeslot } from "@/lib/utils-temporal"
import { useRouterUtility } from "@/lib/router-utility"
import { ConfirmationButton } from "@/components/primitives/confirmation-button"

export function TasklistTimeslotPanel({ timeslotId }: { timeslotId: string }) {
  const router = useRouterUtility()
  const timeslotQuery = useFindUniqueTimeslot({
    where: { id: timeslotId },
    include: { tasklist: true, tasks: true },
  })
  const tasksQuery = useFindManyTask({ where: { timeslot_id: timeslotId } })
  const taskOrder = timeslotQuery.data?.task_order ?? []

  const { dragProps } = useDrag({
    getItems: () => {
      return [
        {
          "text/plain": timeslotQuery.data?.date + " " + timeslotQuery.data?.start_time,
          "timeslot": JSON.stringify(timeslotQuery.data),
        },
      ]
    },
  })

  const updateTimeslotMutation = useUpdateTimeslot()
  const handleReorder = (reorderedIds: string[]) => {
    updateTimeslotMutation.mutate({
      where: { id: timeslotId },
      data: { task_order: reorderedIds },
    })
  }

  const deleteTimeslotMutation = useDeleteTimeslot()
  const handleDeleteTimeslot = () => {
    if (timeslotId) {
      router.push({ path: `/tasklist/${timeslotQuery.data?.tasklist_id}` })
      deleteTimeslotMutation.mutate({ where: { id: timeslotId } })
    }
  }

  const hasDoneTasks = tasksQuery.data?.some((task) => task.status === "DONE")
  const hasNoTasks = tasksQuery.data?.length === 0

  const timeslot = timeslotQuery.data
  const isLoading = timeslotQuery.isLoading || tasksQuery.isLoading

  const timeblock = timeslot
    ? getTimeblock({ startTime: timeslot.start_time, endTime: timeslot.end_time })
    : null

  const temporalStatus: TemporalStatus = timeslot
    ? getTemporalStatusFromTimeslot(timeslot)
    : "future"

  return (
    <TaskPanel
      tasksQuery={tasksQuery}
      taskOrder={taskOrder}
      isLoading={isLoading}
      handleReorder={handleReorder}
      isReorderPending={updateTimeslotMutation.isPending}
      defaultTaskValues={{
        status: "TODO",
        tasklist_id: timeslot?.tasklist_id,
        timeslot_id: timeslotId,
      }}
      selectableStatuses={["DONE", "TODO"]}
      useOverdueColor={temporalStatus === "past"}
      headerContent={
        timeblock ? (
          <div className="flex w-full items-center gap-4 pr-8">
            <div {...dragProps} className={iconBox({ className: "!cursor-move !select-auto" })}>
              <CalendarIcon />
            </div>
            <h2 className="font-semibold">
              {formatDate(parse(timeslot?.date ?? "", "yyyy-MM-dd", new Date()), {
                withWeekday: true,
              })}
            </h2>
            <div className="flex items-center gap-2">
              <div className={iconBox({ size: "small" })}>
                {timeblock.Icon && <timeblock.Icon />}
              </div>
              <p className="text-neutral-600">{timeblock.label}</p>
            </div>
            <div className="grow" />
            {!hasDoneTasks &&
              (hasNoTasks ? (
                <UnscheduleButton onPress={handleDeleteTimeslot} />
              ) : (
                <ConfirmationButton
                  onConfirm={handleDeleteTimeslot}
                  content="All tasks will be moved to the Backlog."
                  confirmButtonText="Unschedule"
                  isDestructive
                >
                  <UnscheduleButton />
                </ConfirmationButton>
              ))}
          </div>
        ) : (
          "Loading..."
        )
      }
    />
  )
}

function UnscheduleButton({ onPress }: { onPress?: () => void }) {
  return (
    <Button
      onPress={onPress}
      className={twMerge(
        interactive({ hover: "underline" }),
        "flex items-center gap-2",
        "text-sm text-neutral-500"
      )}
    >
      Unschedule
      <XIcon size={14} />
    </Button>
  )
}
