"use client"

import { Button, GridList, GridListItem, useDragAndDrop } from "react-aria-components"
import { useListData } from "react-stately"
import { GripVertical } from "lucide-react"
import EditableText from "@/components/abstract/editable-text"

const textValues = [
  "Lorem ipsum dolor sit amet",
  "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation",
]

export default function Dev() {
  return (
    <div className="flex flex-col gap-8">
      <DragDev />
      <DragDev />
    </div>
  )
}

function DragDev() {
  const list = useListData({
    initialItems: textValues.map((value, index) => ({
      id: index,
      value,
    })),
  })

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": list.getItem(key)?.value ?? "" })),
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys)
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys)
      }
    },
  })
  return (
    <GridList
      items={list.items}
      dragAndDropHooks={dragAndDropHooks}
      className="bg-canvas flex flex-col gap-1 rounded-lg border-2"
    >
      {(item) => (
        <GridListItem className="flex items-start gap-2 p-2">
          <Button slot="drag" className="cursor-grab">
            <GripVertical size={16} />
          </Button>
          {/* eslint-disable-next-line no-console */}
          <EditableText initialValue={item.value} onSave={console.log} />
        </GridListItem>
      )}
    </GridList>
  )
}
