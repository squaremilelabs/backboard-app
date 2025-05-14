"use client"
import { GridList, GridListItem, isTextDropItem, useDragAndDrop } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { useParams } from "next/navigation"
import { Task } from "@zenstackhq/runtime/models"
import { Emoji } from "../../primitives/common/emoji"
import { TaskSizeSummaryChips } from "../../primitives/task/task-size"
import { interactive } from "@/styles/class-names"
import { defaultTasklistEmojiCode, sortTasklists } from "@/lib/utils-tasklist"
import { useFindManyTasklist, useUpdateManyTask } from "@/database/generated/hooks"

export default function BacklogTasklistGridList() {
  const params = useParams<{ tasklist_id: string }>()
  const tasklistsQuery = useFindManyTasklist({
    where: { archived_at: null },
    include: { tasks: { where: { timeslot_id: null } } },
  })
  const sortedTasklists = sortTasklists(tasklistsQuery.data ?? [])
  const activeTasklistId = params.tasklist_id ?? null

  const { dragAndDropHooks } = useDragAndDrop({
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

  const updateTasksMutation = useUpdateManyTask()

  const handleTasksDrop = (tasklistId: string, tasks: Task[]) => {
    // handle done tasks
    const doneTasks = tasks.filter(
      (task) => task.status === "DONE" && task.tasklist_id !== tasklistId
    )
    if (doneTasks.length > 0) {
      updateTasksMutation.mutate({
        where: { id: { in: doneTasks.map((task) => task.id) } },
        data: { status: "TODO", tasklist_id: tasklistId, timeslot_id: null },
      })
    }
    // handle undone tasks
    const undoneTasks = tasks.filter(
      (task) => task.status !== "DONE" && task.tasklist_id !== tasklistId
    )
    if (undoneTasks.length > 0) {
      updateTasksMutation.mutate({
        where: { id: { in: undoneTasks.map((task) => task.id) } },
        data: { tasklist_id: tasklistId, timeslot_id: null },
      })
    }
  }

  return (
    <GridList
      aria-label="Tasklists"
      items={sortedTasklists}
      dependencies={[activeTasklistId]}
      dragAndDropHooks={dragAndDropHooks}
      className="flex flex-col gap-8"
      renderEmptyState={() => (
        <div className="p-8">{tasklistsQuery.isLoading ? "Loading..." : "No tasklists"}</div>
      )}
    >
      {(tasklist) => (
        <GridListItem
          id={tasklist.id}
          href={`/backlog/tasklist/${tasklist.id}`}
          textValue={tasklist.title}
          className={({ isDropTarget }) =>
            twMerge(
              interactive(),
              "flex items-start px-4 py-6",
              "rounded-lg border border-neutral-200 bg-neutral-100",
              activeTasklistId === tasklist.id ? "bg-canvas" : "",
              isDropTarget ? "outline" : ""
            )
          }
        >
          <Emoji code={tasklist.emoji?.code ?? defaultTasklistEmojiCode} />
          <p className="ml-4 grow truncate font-medium">{tasklist.title}</p>
          <TaskSizeSummaryChips tasks={tasklist.tasks} consistentWeightVariant="medium" />
        </GridListItem>
      )}
    </GridList>
  )
}
