"use client"

import { Button, GridList, GridListItem, useDragAndDrop } from "react-aria-components"
import { GripVertical } from "lucide-react"
import { Task } from "@zenstackhq/runtime/models"
import TaskItemContent from "../task-item-content"
import { useFindManyTask } from "@/database/generated/hooks"
import useReorderableList from "@/hooks/useReorderableList"

export default function TaskListReorderable({ tasks }: { tasks: Task[] }) {
  const { items, getItem, onReorder } = useReorderableList({
    topicId: "x",
    itemOrderKey: "",
    items: tasks ?? [],
  })

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ "text/plain": getItem(key as string)?.title ?? "" })),
    onReorder: (e) => {
      onReorder({
        droppedOnItemKey: e.target.key,
        droppedOnPosition: e.target.dropPosition,
        droppedItemKeys: e.keys,
      })
    },
  })

  return (
    <GridList items={items} dragAndDropHooks={dragAndDropHooks}>
      {(item) => (
        <GridListItem className="flex items-start px-1 py-1.5">
          <Button slot="drag" className="cursor-grab text-neutral-500">
            <GripVertical size={16} />
          </Button>
          <TaskItemContent task={item} />
        </GridListItem>
      )}
    </GridList>
  )
}
