import { isTextDropItem, useDragAndDrop } from "react-aria-components"
import { useListData } from "react-stately"
import { useEffect, JSX } from "react"
import { isEqualStringArrays } from "@/lib/utils"
import { GenericRecord } from "@/lib/types"

/**
 * @param itemType - the type of the item being dragged and dropped (used to allow accepted items from other lists)
 * @param items - the list of items
 * @param savedOrder - the order of the item ids to be persisted
 * @param handleOrderChange - function to save the new item id order
 * @param handleInsert - function to handle the insertion of new items – omit if the list should only allow reordering
 */
export default function useDragAndDropList<T extends GenericRecord>({
  itemType,
  items,
  savedOrder,
  handleOrderChange,
  handleInsert,
  renderDragPreview,
}: {
  itemType: string
  items: T[]
  savedOrder: string[]
  handleOrderChange: (order: string[]) => void
  handleInsert?: (items: T[]) => void
  renderDragPreview?: (items: T[]) => JSX.Element
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

  // Synchronizes list changes outside of drag and drop operations
  useEffect(() => {
    const incomingItems = [...items]
    const incomingListItemIds = incomingItems.map(({ id }) => id)
    const currentListItemIds = list.items.map(({ id }) => id)

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

    // Handle updated items (if an item was added via insertion, the item may have stale data [e.g., the previous `tasklist_id`] and this section should update it)
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

  const saveOrderIfChanged = (newOrder: string[]) => {
    if (!isEqualStringArrays(newOrder, savedOrder)) {
      handleOrderChange(newOrder)
    }
  }

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
    renderDragPreview: renderDragPreview
      ? (dragItems) => {
          const processedItems: T[] = dragItems
            .filter((item) => item[itemType])
            .map((item) => {
              return JSON.parse(item[itemType])
            })
          return renderDragPreview(processedItems)
        }
      : undefined,
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
          const currentListItemIds = list.items.map(({ id }) => id)
          const incomingItemIds = processedItems.map(({ id }) => id)
          if (e.target.dropPosition === "before") {
            list.insertBefore(e.target.key, ...processedItems)
            // Must also handle order change because onDragEnd below only applies to the source list, not the destination list.
            const insertionIndex = currentListItemIds.indexOf(e.target.key as string)
            const newOrder = currentListItemIds.toSpliced(insertionIndex, 0, ...incomingItemIds)
            saveOrderIfChanged(newOrder)
          } else if (e.target.dropPosition === "after") {
            list.insertAfter(e.target.key, ...processedItems)
            // Must also handle order change because onDragEnd below only applies to the source list, not the destination list.
            const insertionIndex = currentListItemIds.indexOf(e.target.key as string) + 1
            const newOrder = currentListItemIds.toSpliced(insertionIndex, 0, ...incomingItemIds)
            saveOrderIfChanged(newOrder)
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
          const currentListItemIds = list.items.map(({ id }) => id)
          // Must also handle order change because onDragEnd below only applies to the source list, not the destination list.
          const incomingItemIds = processedItems.map(({ id }) => id)
          const newOrder = [...currentListItemIds, ...incomingItemIds]
          saveOrderIfChanged(newOrder)
        }
      : undefined,
    onDragEnd: (e) => {
      // FYI: This only applies on the source list (applies to removed items + reordered items)
      let newOrder = list.items.map(({ id }) => id)
      // Remove items from the list if they were dropped outside of the list
      if (e.dropOperation === "move" && !e.isInternal) {
        list.remove(...e.keys)
        newOrder = newOrder.filter((id) => ![...e.keys].includes(id))
      }
      saveOrderIfChanged(newOrder)
    },
  })

  return { list, dragAndDropHooks }
}
