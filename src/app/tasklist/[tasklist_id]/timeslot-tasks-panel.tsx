"use client"

import { parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import TasksPanel from "@/components/tasks-panel"
import {
  useFindManyTask,
  useFindUniqueTimeslot,
  useUpdateTimeslot,
} from "@/database/generated/hooks"
import { formatDate } from "@/lib/utils-common"
import { iconBox } from "@/styles/class-names"
import { getTimeblock, getTimeslotStatus } from "@/lib/utils-timeslot"

export default function TimeslotTasksPanel({ timeslotId }: { timeslotId: string }) {
  const timeslotQuery = useFindUniqueTimeslot({ where: { id: timeslotId } })
  const tasksQuery = useFindManyTask({ where: { timeslot_id: timeslotId } })
  const taskOrder = timeslotQuery.data?.task_order ?? []

  const updateTimeslotMutation = useUpdateTimeslot()
  const handleReorder = (reorderedIds: string[]) => {
    updateTimeslotMutation.mutate({
      where: { id: timeslotId },
      data: { task_order: reorderedIds },
    })
  }

  const timeslot = timeslotQuery.data
  const isLoading = timeslotQuery.isLoading || tasksQuery.isLoading

  const timeblock = timeslot
    ? getTimeblock({ startTime: timeslot.start_time, endTime: timeslot.end_time })
    : null

  const timeslotStatus = getTimeslotStatus({
    date: timeslot?.date ?? "",
    startTime: timeslot?.start_time ?? "",
    endTime: timeslot?.end_time ?? "",
  })

  return (
    <TasksPanel
      tasksQuery={tasksQuery}
      taskOrder={taskOrder}
      isLoading={isLoading}
      handleReorder={handleReorder}
      defaultTaskValues={{
        status: "TODO",
        tasklist_id: timeslot?.tasklist_id,
        timeslot_id: timeslotId,
      }}
      selectableStatuses={["DONE", "TODO"]}
      useOverdueColor={timeslotStatus === "past"}
      headerContent={
        timeblock ? (
          <div className="flex items-center gap-4">
            <div className={iconBox()}>
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
          </div>
        ) : (
          "Loading..."
        )
      }
    />
  )
}
