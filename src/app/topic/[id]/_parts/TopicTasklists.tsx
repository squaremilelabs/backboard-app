"use client"
// E: To refactor (implemented drag & drop haphazardly)

import { Topic } from "@zenstackhq/runtime/models"
import { GridList, GridListItem } from "react-aria-components"
import CreateByTitleLine from "@/components/common/CreateByTitleLine"
import { useCreateTasklist, useFindManyTasklist, useUpdateTopic } from "@/database/generated/hooks"
import useDragAndDropList from "@/hooks/useDragAndDropList"
import Tasklist from "@/components/task/Tasklist"

export default function TopicTasklists({ topic }: { topic: Topic }) {
  const updateTopic = useUpdateTopic()
  const tasklistsQuery = useFindManyTasklist({
    where: { topic_id: topic.id, archived_at: null },
    orderBy: [{ created_at: "desc" }],
  })

  const { dragAndDropHooks, list } = useDragAndDropList({
    itemType: "tasklist",
    items: tasklistsQuery.data,
    savedOrder: topic.tasklist_order,
    isInitialized: tasklistsQuery.isFetched,
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

  const createTasklist = useCreateTasklist()
  return (
    <div className="flex flex-col gap-2">
      <GridList
        aria-label="Tasklists"
        items={list.items}
        dragAndDropHooks={dragAndDropHooks}
        className="flex flex-col gap-2"
      >
        {(tasklist) => {
          return (
            <GridListItem textValue={tasklist.title}>
              <Tasklist tasklist={tasklist} topic={topic} />
            </GridListItem>
          )
        }}
      </GridList>
      <CreateByTitleLine
        createMutation={createTasklist}
        additionalData={{ topic_id: topic.id, is_public: topic.is_public }}
        placeholder="Add Tasklist"
      />
    </div>
  )
}
