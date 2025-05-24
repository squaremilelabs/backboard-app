"use client"

import { Task, Tasklist, Timeslot } from "@zenstackhq/runtime/models"
import { getTemporalStatus, Timeblock } from "./utils-temporal"
import {
  useCreateTimeslot,
  useDeleteTimeslot,
  useFindManyTimeslot,
  useUpdateManyTask,
  useUpdateTimeslot,
} from "@/database/generated/hooks"

type ExpandedTimeslot = Timeslot & { tasklist: Tasklist; tasks: Task[] }

export function useTimeblockDrop({
  date,
  timeblock,
  disableAutoDelete,
}: {
  date: string
  timeblock: Timeblock
  disableAutoDelete?: boolean
}) {
  const temporalStatus = getTemporalStatus({ date, ...timeblock })
  const { data: existingTimeslots } = useFindManyTimeslot({
    where: { date: date, start_time: timeblock.startTime },
    include: { tasklist: true, tasks: true },
  })

  const { mutate: createTimeslot, ...createTimeslotMutation } = useCreateTimeslot()
  const { mutate: updateTimeslot, ...updateTimeslotMutation } = useUpdateTimeslot()
  const { mutate: deleteTimeslot, ...deleteTimeslotMutation } = useDeleteTimeslot()
  const { mutate: updateManyTasks, ...updateManyTasksMutation } = useUpdateManyTask()

  const handleTimeslotDrop = (droppedTimeslot: ExpandedTimeslot) => {
    // End function if timeslot was dropped into the same timeblock
    if (droppedTimeslot.date === date && droppedTimeslot.start_time === timeblock.startTime) return

    const tasks = droppedTimeslot.tasks
    const doneTasks = tasks.filter((task) => task.status === "DONE")
    const undoneTasks = tasks.filter((task) => task.status !== "DONE")

    const hasTasks = tasks.length > 0
    const hasOnlyDoneTasks = hasTasks && doneTasks.length === tasks.length
    const hasOnlyUndoneTasks = hasTasks && undoneTasks.length === tasks.length
    const hasMixedStatusTasks = hasTasks && !hasOnlyDoneTasks && !hasOnlyUndoneTasks

    const targetTimeslot = existingTimeslots?.find(
      (timeslot) => timeslot.tasklist_id === droppedTimeslot.tasklist_id
    )

    /**
     * NO TARGET TIMESLOT LOGIC
     * There is no corresponding timeslot for the same tasklist in the current timeblock
     */

    if (!targetTimeslot) {
      // If timeblock is in the past...
      if (temporalStatus === "past") {
        // If all tasks are undone, ignore the drop operation
        if (hasOnlyUndoneTasks) return
        // If all tasks are done, move the timeslot normally
        if (hasOnlyDoneTasks) {
          updateTimeslot({
            where: { id: droppedTimeslot.id },
            data: { date, start_time: timeblock.startTime, end_time: timeblock.endTime },
          })
        }
        // If mixed, create a new timeslot for the done tasks only
        if (hasMixedStatusTasks) {
          createTimeslot({
            data: {
              date,
              start_time: timeblock.startTime,
              end_time: timeblock.endTime,
              tasklist: { connect: { id: droppedTimeslot.tasklist_id } },
              tasks: {
                connect: doneTasks.map((task) => ({ id: task.id })),
              },
            },
          })
        }
      }

      // If timeblock is not in the past...
      if (temporalStatus !== "past") {
        // If all tasks are undone or there are no tasks, move the timeslot normally
        if (hasOnlyUndoneTasks || !hasTasks) {
          updateTimeslot({
            where: { id: droppedTimeslot.id },
            data: { date, start_time: timeblock.startTime, end_time: timeblock.endTime },
          })
        }
        // If all tasks are done, create a new empty timeslot (a copy)
        if (hasOnlyDoneTasks) {
          createTimeslot({
            data: {
              date,
              start_time: timeblock.startTime,
              end_time: timeblock.endTime,
              tasklist: { connect: { id: droppedTimeslot.tasklist_id } },
            },
          })
        }
        // If mixed, create a new timeslot for the undone tasks only
        if (hasMixedStatusTasks) {
          createTimeslot({
            data: {
              date,
              start_time: timeblock.startTime,
              end_time: timeblock.endTime,
              tasklist: { connect: { id: droppedTimeslot.tasklist_id } },
              tasks: {
                connect: undoneTasks.map((task) => ({ id: task.id })),
              },
            },
          })
        }
      }
    }

    /**
     * HAS TARGET TIMESLOT LOGIC
     * There is a corresponding timeslot for the same tasklist in the current timeblock
     */

    if (targetTimeslot) {
      // If timeblock is in the past...
      if (temporalStatus === "past") {
        // If all tasks are undone, ignore the drop operation
        if (hasOnlyUndoneTasks) return
        // If there are done tasks, move them to the target timeslot
        if (doneTasks.length > 0) {
          updateManyTasks({
            where: { id: { in: doneTasks.map((task) => task.id) } },
            data: {
              tasklist_id: targetTimeslot.tasklist_id,
              timeslot_id: targetTimeslot.id,
              timeslot_tasklist_id: targetTimeslot.tasklist_id,
            },
          })
          // If all tasks were done, so the timeslot is now empty, delete the original timeslot
          if (hasOnlyDoneTasks) {
            if (!disableAutoDelete) deleteTimeslot({ where: { id: droppedTimeslot.id } })
          } else {
            // Otherwise the original timeslot will retain the undone tasks
          }
        }
      }
      // If timeblock is not in the past...
      if (temporalStatus !== "past") {
        // If all tasks are done, ignore the drop operation
        if (hasOnlyDoneTasks) return
        // If there are undone tasks, move them to the target timeslot
        if (undoneTasks.length > 0) {
          updateManyTasks({
            where: { id: { in: undoneTasks.map((task) => task.id) } },
            data: {
              tasklist_id: targetTimeslot.tasklist_id,
              timeslot_id: targetTimeslot.id,
              timeslot_tasklist_id: targetTimeslot.tasklist_id,
            },
          })
          // If all tasks were undone, so the timeslot is now empty, delete the original timeslot
          if (hasOnlyUndoneTasks) {
            if (!disableAutoDelete) deleteTimeslot({ where: { id: droppedTimeslot.id } })
          } else {
            // Otherwise the original timeslot will retain the done tasks
          }
        }
      }
    }
  }

  const handleTasklistDrop = (tasklist: Tasklist) => {
    const isAlreadyExisting = existingTimeslots?.find(
      (timeslot) => timeslot.tasklist_id === tasklist.id
    )
    if (isAlreadyExisting) return
    createTimeslot({
      data: {
        date: date,
        start_time: timeblock.startTime,
        end_time: timeblock.endTime,
        tasklist: { connect: { id: tasklist.id } },
      },
    })
  }

  const isDropPending =
    createTimeslotMutation.isPending ||
    updateTimeslotMutation.isPending ||
    updateManyTasksMutation.isPending ||
    deleteTimeslotMutation.isPending

  return {
    handleTimeslotDrop,
    handleTasklistDrop,
    isDropPending,
  }
}
