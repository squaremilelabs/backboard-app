"use"

import { isTextDropItem, useDragAndDrop } from "react-aria-components"
import { useListData } from "react-stately"
import { useEffect, JSX, useMemo, useId } from "react"
import { isEqualStringArrays } from "@/lib/utils"
import { WithMetadata } from "@/lib/types"
import { useCache } from "@/lib/cache-context"
import { useDebouncedEffect } from "@/lib/hooks"

/**
 * @param itemType - the type of the item being dragged and dropped (used to allow accepted items from other lists)
 * @param items - the list of items
 * @param order - the order of the item ids to be persisted
 * @param handleOrderChange - function to save the new item id order
 * @param handleInsert - function to handle the insertion of new items – omit if the list should only allow reordering
 */
export default function useDragAndDropList<T extends WithMetadata>({
  listKey,
  itemType,
  items,
  order,
  isPreintialized = false,
  isInitialized = false,
  handleOrderChange,
  handleInsert,
}: {
  listKey: string
  itemType: string
  items: T[] | null | undefined
  order: string[] | null | undefined
  isInitialized: boolean
  isPreintialized?: boolean
  handleOrderChange: (order: string[]) => void
  handleInsert?: (items: T[]) => void
  renderDragPreview?: (items: T[]) => JSX.Element
}) {
  // const { getCacheValue, setCacheValue } = useCache()
  // const internalInitialized = getCacheValue<boolean>(`${listKey}-initialized`)
  // const setInternalInitialized = (value: boolean) => {
  //   setCacheValue(`${listKey}-initialized`, value)
  // }

  // // List starts as empty until isInitialized becomes true
  // const list = useListData<T>({
  //   initialItems: isPreintialized && items && order ? sortItemsByOrder(items, order) : [],
  // })

  // useEffect(() => {
  //   // Effect should only run on first initialization
  //   if (internalInitialized) return
  //   if (isPreintialized) return

  //   // If is initialized and both items & saved order have been provided, initialize the list
  //   if (isInitialized && items && order) {
  //     const listItems = sortItemsByOrder(items, order)
  //     list.append(...listItems)
  //     setInternalInitialized(true)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps -- only runs for when all items are loaded
  // }, [isInitialized, items, order])

  // // Synchronizes list changes outside of drag and drop operations (only after list has been initialized)
  // useDebouncedEffect(
  //   () => {
  //     // Effect should not run if not yet initialized
  //     if (!isInitialized) return
  //     if (!internalInitialized) return
  //     if (!items) return

  //     const incomingItems = [...items]
  //     const incomingListItemIds = incomingItems.map(({ id }) => id)
  //     const currentListItemIds = list.items.map(({ id }) => id)

  //     // Handle added items (if added via insertion, the current list will have the id, and this section should be skipped)
  //     const addedItems = incomingItems.filter((item) => !currentListItemIds.includes(item.id))

  //     if (addedItems.length > 0) {
  //       list.prepend(...addedItems)
  //     }

  //     // Handle removed items (if removed via insertion, the current list will NOT have the id, and this section should be skipped)
  //     const removedItemIds = currentListItemIds.filter((id) => !incomingListItemIds.includes(id))

  //     if (removedItemIds.length > 0) {
  //       list.remove(...removedItemIds)
  //     }

  //     // Handle updated items (if an item was added via insertion, the item may have stale data [e.g., the previous `tasklist_id`] and this section should update it)
  //     const updatedItems = incomingItems
  //       .filter((item) => currentListItemIds.includes(item.id))
  //       .filter((item) => item.updated_at !== list.getItem(item.id)?.updated_at)

  //     if (updatedItems.length > 0) {
  //       updatedItems.forEach((item) => {
  //         list.update(item.id, item)
  //       })
  //     }
  //   },
  //   [items, list.items],
  //   500
  // )

  const list = useListData({
    initialItems: sortItemsByOrder(items ?? [], order ?? []),
  })

  const saveOrderIfChanged = (newOrder: string[]) => {
    if (!isEqualStringArrays(newOrder, order ?? [])) {
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
    renderDragPreview: (dragItems) => {
      const processedItems: T[] = dragItems
        .filter((item) => item[itemType])
        .map((item) => {
          return JSON.parse(item[itemType])
        })
      const firstItem = processedItems[0]
      return (
        <div className="rounded-lg bg-neutral-700 px-8 py-4 text-neutral-50">{firstItem.title}</div>
      )
    },
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

function sortItemsByOrder<T extends WithMetadata>(items: T[], order: string[]) {
  return items.sort((a, b) => {
    const aIndex = order.indexOf(a.id)
    const bIndex = order.indexOf(b.id)
    if (aIndex !== -1 && bIndex === -1) return -1
    if (aIndex === -1 && bIndex !== -1) return 1
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (a.created_at < b.created_at) return -1
    if (a.created_at > b.created_at) return 1
    return 0
  })
}
