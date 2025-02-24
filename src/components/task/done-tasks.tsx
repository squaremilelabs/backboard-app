import { Button, GridList, GridListItem } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { Check, Loader, SquareCheck } from "lucide-react"
import { useFindManyTask, useUpdateTask } from "@/database/generated/hooks"
import { TopicItem } from "@/lib/topic/item-data"
import { formatDate } from "@/lib/utils"

export default function DoneTasks({ topic }: { topic: TopicItem }) {
  const tasksQuery = useFindManyTask({
    where: { topic_id: topic.id, done_at: { not: null } },
    orderBy: { done_at: "desc" },
  })

  const tasks = tasksQuery.data || []
  const emptyContent = (
    <div className="p-2">
      {tasksQuery.isLoading ? (
        "Loading..."
      ) : (
        <span className="px-2 text-sm text-neutral-500">No done tasks</span>
      )}
    </div>
  )

  const canUndo = !topic._next_task

  const updateTask = useUpdateTask()
  const handleUndo = (taskId: string) => {
    if (!canUndo) return
    updateTask.mutate({
      where: { id: taskId },
      data: {
        done_at: null,
        current_for_topic: { connect: { id: topic.id } },
      },
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded border bg-neutral-100 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 self-start pl-1 text-neutral-500">
          <Check size={14} />
          <p className="text-sm font-medium">
            {topic._count_done_tasks} Done Task{topic._count_done_tasks > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      {tasks.length && !tasksQuery.isLoading ? (
        <GridList
          aria-label="List of Completed Tasks"
          selectionMode="none"
          renderEmptyState={() => emptyContent}
          className={twMerge("divide-y rounded border")}
        >
          {tasks.map((task, index) => {
            return (
              <GridListItem key={task.id} id={task.id} textValue={task.title}>
                <div className="bg-canvas flex items-center gap-2 p-2">
                  <Button
                    isDisabled={index !== 0 || !canUndo || updateTask.isPending}
                    onPress={() => handleUndo(task.id)}
                    className={twMerge(
                      "cursor-pointer",
                      "disabled:cursor-not-allowed",
                      "not-disabled:hover:text-gold-600"
                    )}
                  >
                    {updateTask.isPending ? (
                      <Loader size={20} className="text-gold-600 animate-spin" />
                    ) : (
                      <SquareCheck size={20} className="text-neutral-500" />
                    )}
                  </Button>
                  <p className="grow">{task.title}</p>
                  <span className="bg-canvas rounded-full border px-3 py-0.5 text-sm">
                    {task.done_at ? formatDate(task.done_at) : null}
                  </span>
                </div>
              </GridListItem>
            )
          })}
        </GridList>
      ) : null}
    </div>
  )
}
