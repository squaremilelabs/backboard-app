"use client"

// E: To refactor (implemented drag & drop haphazardly)

import { Tasklist as ITasklist, Topic } from "@zenstackhq/runtime/models"
import { Button, GridList, GridListItem } from "react-aria-components"
import { GripVertical } from "lucide-react"
import { twMerge } from "tailwind-merge"
import CreateByTitleLine from "@/components/common/CreateByTitleLine"
import { useCreateTasklist, useFindManyTasklist, useUpdateTopic } from "@/database/generated/hooks"
import useDragAndDropList from "@/hooks/useDragAndDropList"
import Tasklist from "@/components/task/Tasklist"

export default function TopicTasklists({ topic }: { topic: Topic }) {
  const tasklistsQuery = useFindManyTasklist({
    where: { topic_id: topic.id, archived_at: null },
    orderBy: [{ created_at: "desc" }],
  })

  const createTasklist = useCreateTasklist()
  return (
    <div className="flex flex-col gap-2">
      {tasklistsQuery.isSuccess ? (
        <TasklistsGridList topic={topic} tasklists={tasklistsQuery?.data} />
      ) : null}
      <CreateByTitleLine
        createMutation={createTasklist}
        additionalData={{ topic_id: topic.id, is_public: topic.is_public }}
        placeholder="New Tasklist"
      />
    </div>
  )
}

function TasklistsGridList({ topic, tasklists }: { topic: Topic; tasklists: ITasklist[] }) {
  const updateTopic = useUpdateTopic()

  const { dragAndDropHooks, list } = useDragAndDropList({
    itemType: "tasklist",
    items: tasklists,
    savedOrder: topic.tasklist_order,
    handleOrderChange: (newOrder) => {
      updateTopic.mutate({
        where: { id: topic.id },
        data: { tasklist_order: newOrder },
      })
    },
    renderDragPreview: ([tasklist]) => {
      return <div className="flex rounded-lg bg-neutral-100 p-2 px-2">{tasklist.title}</div>
    },
  })

  return (
    <GridList
      aria-label="Tasklists"
      items={list.items}
      dragAndDropHooks={dragAndDropHooks}
      className="flex flex-col gap-2"
    >
      {(tasklist) => {
        return (
          <GridListItem textValue={tasklist.title}>
            <Button
              slot="drag"
              className={twMerge(
                "focus-visible:text-gold-500 cursor-grab text-neutral-500 !outline-0",
                "absolute top-3 left-3 z-10"
              )}
            >
              <GripVertical size={20} />
            </Button>
            <Tasklist tasklist={tasklist} topic={topic} />
          </GridListItem>
        )
      }}
    </GridList>
  )
}
