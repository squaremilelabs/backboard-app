import { Button, GridList, GridListItem } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { CircleCheckBig, CircleFadingArrowUp, Loader } from "lucide-react"
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

  const canUndo = !topic._next_task && tasks.length > 0

  const updateTask = useUpdateTask()
  const handleUndo = () => {
    if (!canUndo) return
    updateTask.mutate({
      where: { id: tasks[0].id },
      data: {
        done_at: null,
        current_for_topic: { connect: { id: topic.id } },
      },
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        {tasks.length ? (
          <div className="flex items-center gap-1 self-start pl-1">
            <CircleCheckBig size={14} />
            <p className="text-sm font-medium">{topic._count_done_tasks} Done</p>
          </div>
        ) : (
          <div className="px-2 text-sm text-neutral-500">No Tasks Done</div>
        )}
        {canUndo ? (
          <Button
            className="flex cursor-pointer items-center gap-2 px-2 text-sm text-neutral-500 hover:text-neutral-950"
            onPress={handleUndo}
            isDisabled={updateTask.isPending}
          >
            {updateTask.isPending ? (
              <Loader size={14} className="text-gold-500 animate-spin" />
            ) : (
              <CircleFadingArrowUp size={14} />
            )}
            Undo Last Task
          </Button>
        ) : null}
      </div>
      {tasks.length && !tasksQuery.isLoading ? (
        <GridList
          aria-label="List of Completed Tasks"
          selectionMode="none"
          renderEmptyState={() => emptyContent}
          className={twMerge("divide-y rounded border")}
        >
          {tasks.map((task) => {
            return (
              <GridListItem key={task.id} id={task.id} textValue={task.title}>
                <div className="hover:bg-canvas flex items-center justify-between p-2 pl-3">
                  <p>{task.title}</p>
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
