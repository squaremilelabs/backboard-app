import { isTextDropItem, useDragAndDrop } from "react-aria-components"
import { useListData } from "react-stately"
import { useEffect } from "react"
import { isEqualArrays } from "@/lib/utils"

type DragAndDropListItem = {
  id: string
  title: string
  created_at: Date
  updated_at: Date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- to allow for any record type
  [key: string]: any
}

export default function useDragAndDropList<T extends DragAndDropListItem>({
  itemType,
  items,
  savedOrder,
  handleOrderChange,
  handleInsert,
}: {
  itemType: string
  items: T[]
  savedOrder: string[]
  handleOrderChange: (order: string[]) => void
  handleInsert?: (items: T[]) => void
}) {
  const list = useListData({
    initialItems: items.sort((a, b) => {
      const aIndex = savedOrder.indexOf(a.id)
      const bIndex = savedOrder.indexOf(b.id)
      if (aIndex !== -1 && bIndex === -1) return -1
      if (aIndex === -1 && bIndex !== -1) return 1
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (a.created_at < b.created_at) return -1
      if (a.created_at > b.created_at) return 1
      return 0
    }),
  })

  // Handles list updates outside of drag and drop operations
  useEffect(() => {
    const incomingItems = items
    const currentListItemIds = list.items.map(({ id }) => id)
    const incomingListItemIds = incomingItems.map(({ id }) => id)

    // Handle added items (if added via insertion, the current list will have the id, and this section should be skipped)
    const addedItems = incomingItems.filter((item) => !currentListItemIds.includes(item.id))

    if (addedItems.length > 0) {
      list.append(...addedItems)
    }

    // Handle removed items (if removed via insertion, the current list will NOT have the id, and this section should be skipped)
    const removedItemIds = currentListItemIds.filter((id) => !incomingListItemIds.includes(id))

    if (removedItemIds.length > 0) {
      list.remove(...removedItemIds)
    }

    // Handle updated items (if an item was added via insertion, the item may have stale data [e.g., the previous `status`] and this section should update it)
    const updatedItems = incomingItems
      .filter((item) => currentListItemIds.includes(item.id))
      .filter((item) => item.updated_at !== list.getItem(item.id)?.updated_at)

    if (updatedItems.length > 0) {
      updatedItems.forEach((item) => {
        list.update(item.id, item)
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run when items change, not when the list changes
  }, [items])

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => {
      return [...keys].map((key) => {
        const item = list.getItem(key)
        return {
          "text/plain": item?.title ?? "-",
          [itemType]: JSON.stringify(item),
        }
      })
    },
    acceptedDragTypes: handleInsert ? [itemType] : undefined,
    getDropOperation: () => "move",
    onReorder: (e) => {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys)
      }
      if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys)
      }
    },
    onInsert: handleInsert
      ? async (e) => {
          const processedItems = await Promise.all<T>(
            e.items
              .filter(isTextDropItem)
              .map(async (item) => JSON.parse(await item.getText(itemType)))
          )
          if (e.target.dropPosition === "before") {
            list.insertBefore(e.target.key, ...processedItems)
          } else if (e.target.dropPosition === "after") {
            list.insertAfter(e.target.key, ...processedItems)
          }
          handleInsert(processedItems)
        }
      : undefined,
    onRootDrop: handleInsert
      ? async (e) => {
          const processedItems = await Promise.all<T>(
            e.items
              .filter(isTextDropItem)
              .map(async (item) => JSON.parse(await item.getText(itemType)))
          )
          list.append(...processedItems)
          handleInsert(processedItems)
        }
      : undefined,
    onDragEnd: (e) => {
      let newOrder = list.items.map(({ id }) => id)
      // Remove items from the list if they were dropped outside of the list
      if (e.dropOperation === "move" && !e.isInternal) {
        list.remove(...e.keys)
        newOrder = newOrder.filter((id) => ![...e.keys].includes(id))
      }
      // Save the new order (if changed)
      if (!isEqualArrays(newOrder, savedOrder)) {
        handleOrderChange(newOrder)
      }
    },
  })

  return { list, dragAndDropHooks }
}
