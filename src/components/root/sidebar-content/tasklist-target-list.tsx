"use client"
import {
  Button,
  GridList,
  GridListItem,
  isTextDropItem,
  useDragAndDrop,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { AsteriskIcon, GripVerticalIcon } from "lucide-react"
import { Task, Tasklist } from "@zenstackhq/runtime/models"
import { useFindManyTasklist, useUpdateManyTask } from "@/database/generated/hooks"
import { defaultTasklistEmojiCode } from "@/lib/utils-tasklist"
import { Emoji } from "@/components/primitives/emoji"
import { iconBox, interactive } from "@/styles/class-names"
import { TaskSizeSummaryChips } from "@/components/portables/task-size"
import { useWeekState } from "@/lib/week-state"
import { useRouterUtility } from "@/lib/router-utility"
import { getTaskSummary } from "@/lib/utils-task"

type TasklistQueryResult = Tasklist & {
  tasks: Task[]
  _count: {
    timeslots: number
  }
}

export function TasklistTargetList() {
  const router = useRouterUtility()
  const { activeWeekDates, activeWeekDisplayedDates, isPastWeek } = useWeekState()

  const datesFilter = router.basePath === "calendar" ? activeWeekDisplayedDates : activeWeekDates

  const tasklistsQuery = useFindManyTasklist({
    where: {
      OR: [{ archived_at: null }, { timeslots: { some: { date: { in: datesFilter } } } }],
    },
    include: {
      tasks: {
        where: {
          OR: [{ timeslot: { date: { in: datesFilter } } }, { timeslot_id: null }],
        },
      },
      _count: {
        select: {
          timeslots: { where: { date: { in: datesFilter } } },
        },
      },
    },
  })

  const sortedTasklists = sortTasklists(tasklistsQuery.data ?? [], { isPastWeek })

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => {
      return [...keys].map((key) => {
        const tasklist = tasklistsQuery.data?.find((t) => t.id === key)
        return {
          "text/plain": tasklist?.title ?? "-",
          "tasklist": JSON.stringify(tasklist),
        }
      })
    },
    acceptedDragTypes: ["task"],
    onItemDrop: async (e) => {
      const tasklistId = e.target.key as string
      const tasks = await Promise.all<Task>(
        e.items.filter(isTextDropItem).map(async (task) => {
          return JSON.parse(await task.getText("task"))
        })
      )
      handleTasksDrop(tasklistId, tasks)
    },
  })

  const updateManyTaskMutation = useUpdateManyTask()
  const handleTasksDrop = (tasklistId: string, tasks: Task[]) => {
    // handle done tasks
    const doneTasks = tasks.filter(
      (task) => task.status === "DONE" && task.tasklist_id !== tasklistId
    )
    if (doneTasks.length > 0) {
      updateManyTaskMutation.mutate({
        where: { id: { in: doneTasks.map((task) => task.id) } },
        data: { status: "TODO", tasklist_id: tasklistId, timeslot_id: null },
      })
    }
    // handle undone tasks
    const undoneTasks = tasks.filter(
      (task) => task.status !== "DONE" && task.tasklist_id !== tasklistId
    )
    if (undoneTasks.length > 0) {
      updateManyTaskMutation.mutate({
        where: { id: { in: undoneTasks.map((task) => task.id) } },
        data: { tasklist_id: tasklistId, timeslot_id: null },
      })
    }
  }

  return (
    <GridList
      aria-label="Tasklists"
      dragAndDropHooks={dragAndDropHooks}
      items={sortedTasklists}
      dependencies={[router.params.tasklist_id]}
      className="flex flex-col gap-2"
      renderEmptyState={() =>
        tasklistsQuery.isLoading ? <div className="p-8 text-neutral-500">Loading...</div> : null
      }
    >
      {(tasklist) => {
        const isActive = router.params.tasklist_id === tasklist.id
        const scheduledTasks = tasklist.tasks.filter((task) => task.timeslot_id !== null)
        const unscheduledTasks = tasklist.tasks.filter((task) => task.timeslot_id === null)
        const todoUnscheduledTasks = unscheduledTasks.filter((task) => task.status === "TODO")

        return (
          <GridListItem
            id={tasklist.id}
            href={`/tasklist/${tasklist.id}`}
            textValue={tasklist.title}
            className={({ isDropTarget }) =>
              twMerge(
                "cursor-pointer",
                "group/tasklist-item",
                "flex items-start px-4 py-6",
                "rounded-md border border-transparent",
                "-outline-offset-2",
                isDropTarget ? "outline" : "",
                tasklist.archived_at ? "opacity-60 hover:opacity-100" : "",
                isActive ? "border-neutral-300 bg-neutral-100 opacity-100" : ""
              )
            }
          >
            <Button
              slot="drag"
              className={twMerge(interactive(), iconBox({ className: "text-neutral-400" }))}
            >
              <GripVerticalIcon />
            </Button>
            <Emoji code={tasklist.emoji?.code ?? defaultTasklistEmojiCode} />
            <div className={twMerge("flex grow items-start truncate")}>
              <p
                className={twMerge(
                  "ml-4 truncate font-medium",
                  "group-hover/tasklist-item:underline",
                  "underline-offset-4",
                  tasklist.archived_at ? "text-neutral-500 line-through" : ""
                )}
              >
                {tasklist.title}
              </p>
              {!isPastWeek && unscheduledTasks.length > 0 ? (
                <div
                  className={iconBox({
                    className:
                      todoUnscheduledTasks.length > 0 ? "text-gold-500" : "text-neutral-400",
                  })}
                >
                  <AsteriskIcon />
                </div>
              ) : null}
              <div className="grow" />
              <TaskSizeSummaryChips
                tasks={scheduledTasks}
                useOverdueColor={isPastWeek}
                consistentWeightVariant="medium"
                showEmptyChip={tasklist._count.timeslots > 0}
              />
            </div>
          </GridListItem>
        )
      }}
    </GridList>
  )
}

function sortTasklists(tasklists: TasklistQueryResult[], { isPastWeek }: { isPastWeek: boolean }) {
  return tasklists.sort((a, b) => {
    const aScheduledTasks = a.tasks.filter((task) => task.timeslot_id !== null)
    const bScheduledTasks = b.tasks.filter((task) => task.timeslot_id !== null)
    const aUnscheduledTasks = a.tasks.filter((task) => task.timeslot_id === null)
    const bUnscheduledTasks = b.tasks.filter((task) => task.timeslot_id === null)
    const aScheduledTasksSummary = getTaskSummary(aScheduledTasks)
    const bScheduledTasksSummary = getTaskSummary(bScheduledTasks)
    const aDoneMinutes = aScheduledTasksSummary.status.DONE.minutes
    const bDoneMinutes = bScheduledTasksSummary.status.DONE.minutes
    const aUnscheduledTasksSummary = getTaskSummary(aUnscheduledTasks)
    const bUnscheduledTasksSummary = getTaskSummary(bUnscheduledTasks)

    const aUnscheduledTodoMinutes = aUnscheduledTasksSummary.status.TODO.minutes
    const bUnscheduledTodoMinutes = bUnscheduledTasksSummary.status.TODO.minutes

    if (a.archived_at || b.archived_at) {
      if (a.archived_at && b.archived_at) {
        return new Date(a.archived_at).getTime() - new Date(b.archived_at).getTime()
      }
      return a.archived_at ? 1 : -1
    }

    if (isPastWeek) {
      if (bDoneMinutes !== aDoneMinutes) {
        return bDoneMinutes - aDoneMinutes
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    }

    // Compare by scheduled TODO minutes in descending order
    const aScheduledTodoMinutes = aScheduledTasksSummary.status.TODO.minutes
    const bScheduledTodoMinutes = bScheduledTasksSummary.status.TODO.minutes
    if (bScheduledTodoMinutes !== aScheduledTodoMinutes) {
      return bScheduledTodoMinutes - aScheduledTodoMinutes
    }

    // Compare by unscheduled TODO minutes in descending order
    if (bUnscheduledTodoMinutes !== aUnscheduledTodoMinutes) {
      return bUnscheduledTodoMinutes - aUnscheduledTodoMinutes
    }

    // Compare by DONE minutes in descending order
    if (bDoneMinutes !== aDoneMinutes) {
      return bDoneMinutes - aDoneMinutes
    }

    // // Compare by count of timeslots in descending order
    // if (b._count.timeslots !== a._count.timeslots) {
    //   return b._count.timeslots - a._count.timeslots
    // }

    // Compare by unscheduled DRAFT minutes in descending order
    const aUnscheduledDraftMinutes = aUnscheduledTasksSummary.status.DRAFT.minutes
    const bUnscheduledDraftMinutes = bUnscheduledTasksSummary.status.DRAFT.minutes
    if (bUnscheduledDraftMinutes !== aUnscheduledDraftMinutes) {
      return bUnscheduledDraftMinutes - aUnscheduledDraftMinutes
    }

    // Fallback to comparing by created_at in ascending order
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}
