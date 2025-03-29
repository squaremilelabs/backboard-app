"use client"

import {
  Button,
  Disclosure,
  DisclosurePanel,
  GridList,
  GridListItem,
  Heading,
  useDragAndDrop,
} from "react-aria-components"
import { useListData } from "react-stately"
import { GripVertical, Menu } from "lucide-react"
import React from "react"
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
      <DragDev content={<DragDev />} />
    </div>
  )
}

function DragDev({ content }: { content?: React.ReactNode }) {
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
          <Disclosure className="grow">
            <Heading className="flex grow items-start">
              {/* eslint-disable-next-line no-console */}
              <EditableText initialValue={item.value} onSave={console.log} />
              <Button slot="trigger">
                <Menu size={16} />
              </Button>
            </Heading>
            <DisclosurePanel>{content && item.id === 1 ? content : "CONTENT"}</DisclosurePanel>
          </Disclosure>
        </GridListItem>
      )}
    </GridList>
  )
}
