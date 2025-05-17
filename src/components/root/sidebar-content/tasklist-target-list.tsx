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
import { TaskSizeSummaryChips } from "@/components/primitives/task-size"
import { useWeekState } from "@/lib/week-state"
import { useRouterUtility } from "@/lib/router-utility"
import { getTaskSummary } from "@/lib/utils-task"

type TasklistQueryResult = Tasklist & {
  tasks: Task[]
  _count: {
    tasks: number
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
        where: { timeslot: { date: { in: datesFilter } } },
      },
      _count: {
        select: {
          tasks: { where: { timeslot_id: null, status: "TODO" } },
          timeslots: { where: { date: { in: datesFilter } } },
        },
      },
    },
  })

  const sortedTasklists = sortTasklists(tasklistsQuery.data ?? [])

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
        tasklistsQuery.isLoading ? <div className="text-neutral px-16 py-8">Loading...</div> : null
      }
    >
      {(tasklist) => {
        const isActive = router.params.tasklist_id === tasklist.id
        const isFaded = !isActive && router.params.tasklist_id
        return (
          <GridListItem
            id={tasklist.id}
            href={`/tasklist/${tasklist.id}`}
            textValue={tasklist.title}
            className={({ isDropTarget }) =>
              twMerge(
                interactive(),
                "flex items-start px-4 py-6",
                "rounded-lg",
                "-outline-offset-2",
                isDropTarget ? "outline" : "",
                isFaded ? "opacity-50" : ""
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
            <p className={twMerge("ml-4 truncate font-medium")}>{tasklist.title}</p>
            {tasklist._count.tasks > 0 ? (
              <div className={iconBox({ className: "text-gold-500" })}>
                <AsteriskIcon />
              </div>
            ) : null}
            <div className="grow" />
            <TaskSizeSummaryChips
              tasks={tasklist.tasks}
              useOverdueColor={isPastWeek}
              consistentWeightVariant="medium"
              showEmptyChip={tasklist._count.timeslots > 0}
            />
          </GridListItem>
        )
      }}
    </GridList>
  )
}

function sortTasklists(tasklists: TasklistQueryResult[]) {
  return tasklists.sort((a, b) => {
    const aTasksSummary = getTaskSummary(a.tasks)
    const bTasksSummary = getTaskSummary(b.tasks)
    const aTodoMinutes = aTasksSummary.status.TODO.minutes
    const bTodoMinutes = bTasksSummary.status.TODO.minutes
    const aDoneMinutes = aTasksSummary.status.DONE.minutes
    const bDoneMinutes = bTasksSummary.status.DONE.minutes

    // Compare by TODO minutes in descending order
    if (bTodoMinutes !== aTodoMinutes) {
      return bTodoMinutes - aTodoMinutes
    }

    // Compare by count of timeslots in descending order
    if (b._count.timeslots !== a._count.timeslots) {
      return b._count.timeslots - a._count.timeslots
    }

    // Compare by count of backlog tasks in descending order
    if (b._count.tasks !== a._count.tasks) {
      return b._count.tasks - a._count.tasks
    }

    // Compare by DONE minutes in descending order
    if (bDoneMinutes !== aDoneMinutes) {
      return bDoneMinutes - aDoneMinutes
    }

    // Fallback to comparing by created_at in ascending order
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })
}
