"use client"

import { useAsyncList } from "react-stately"
import { useEffect } from "react"
import { DropPosition, Key } from "react-aria"
import { useFindUniqueTopic, useUpdateTopic } from "@/database/generated/hooks"

export default function useReorderableList<T>({
  topicId,
  itemOrderKey,
  items,
}: {
  topicId: string
  itemOrderKey: string
  items: Array<{ id: string; created_at: Date } & T>
}) {
  const topicQuery = useFindUniqueTopic({ where: { id: topicId } })
  const itemOrders = topicQuery.data?.item_orders.items ?? []
  const itemOrder: string[] = itemOrders.find((item) => item.key === itemOrderKey)?.order ?? []

  const updateTopicMutation = useUpdateTopic()
  const saveItemOrder = (order: string[]) => {
    const value = [...itemOrders]
    const currentIndex = value.findIndex((i) => i.key === itemOrderKey)
    if (currentIndex === -1) {
      value.push({ key: itemOrderKey, order })
    } else {
      value[currentIndex].order = order
    }
    updateTopicMutation.mutate({
      where: { id: topicId },
      data: { item_orders: { items: value } },
    })
  }

  const list = useAsyncList({
    load: () => {
      const sortedItems = items.sort((a, b) => {
        const aIndex = itemOrder.indexOf(a.id)
        const bIndex = itemOrder.indexOf(b.id)
        if (aIndex !== -1 && bIndex === -1) return -1
        if (aIndex === -1 && bIndex !== -1) return 1
        if (a.created_at > b.created_at) return -1
        if (a.created_at < b.created_at) return 1
        return 0
      })
      return { items: sortedItems }
    },
    getKey: (item) => item.id,
  })

  // Reloads list when items are added or removed
  useEffect(() => {
    if (list.loadingState === "idle") {
      if (items.length !== list.items.length) {
        list.reload()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  // Handles reordering within list
  const onReorder = ({
    droppedOnItemKey,
    droppedItemKeys,
    droppedOnPosition,
  }: {
    droppedOnItemKey: Key
    droppedOnPosition: DropPosition
    droppedItemKeys: Iterable<Key>
  }) => {
    if (droppedOnPosition === "on") return
    if (droppedOnPosition === "before") {
      list.moveBefore(droppedOnItemKey, droppedItemKeys)
    }
    if (droppedOnPosition === "after") {
      list.moveAfter(droppedOnItemKey, droppedItemKeys)
    }
    const updatedOrder = list.items.map((item) => item.id)
    saveItemOrder(updatedOrder)
  }

  return {
    items: list.items,
    getItem: (id: string) => list.getItem(id),
    onReorder,
  }
}
