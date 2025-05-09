"use client"

import { ListData } from "react-stately"
import { isTextDropItem, useDragAndDrop } from "react-aria-components"
import { JSX } from "react"
import { DropOptions, useDrop } from "react-aria"
import { GenericListItem } from "./utils-common"

export function useDragAndDropHooks<T extends GenericListItem>({
  list,
  itemKind,
  handleReorder,
  handleInsert,
  renderDragPreview,
  disableRootDrop,
}: {
  list: ListData<T>
  itemKind: string
  handleReorder: (reorderedIds: string[]) => void
  handleInsert?: (items: T[]) => T[]
  renderDragPreview: (items: T[]) => JSX.Element
  disableRootDrop?: boolean
}) {
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) => {
      return [...keys].map((key) => {
        const item = list.getItem(key)
        return {
          "text/plain": item?.title ?? "-",
          [itemKind]: JSON.stringify(item),
        }
      })
    },
    acceptedDragTypes: [itemKind],
    getDropOperation: () => "move",
    renderDragPreview: (dragItems) => {
      const processedItems: T[] = dragItems
        .filter((item) => item[itemKind])
        .map((item) => {
          return JSON.parse(item[itemKind])
        })
      return renderDragPreview(processedItems)
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
              .map(async (item) => JSON.parse(await item.getText(itemKind)))
          )
          const updatedItems = handleInsert(processedItems)
          const currentListItemIds = list.items.map(({ id }) => id)
          const incomingItemIds = updatedItems.map(({ id }) => id)
          if (e.target.dropPosition === "before") {
            list.insertBefore(e.target.key, ...updatedItems)
            // Must also handle order change because onDragEnd below only applies to the source list, not the destination list.
            const insertionIndex = currentListItemIds.indexOf(e.target.key as string)
            const newOrder = currentListItemIds.toSpliced(insertionIndex, 0, ...incomingItemIds)
            handleReorder(newOrder)
          } else if (e.target.dropPosition === "after") {
            list.insertAfter(e.target.key, ...updatedItems)
            // Must also handle order change because onDragEnd below only applies to the source list, not the destination list.
            const insertionIndex = currentListItemIds.indexOf(e.target.key as string) + 1
            const newOrder = currentListItemIds.toSpliced(insertionIndex, 0, ...incomingItemIds)
            handleReorder(newOrder)
          }
        }
      : undefined,
    onRootDrop:
      handleInsert && !disableRootDrop
        ? async (e) => {
            const processedItems = await Promise.all<T>(
              e.items
                .filter(isTextDropItem)
                .map(async (item) => JSON.parse(await item.getText(itemKind)))
            )
            const updatedItems = handleInsert(processedItems)
            list.prepend(...updatedItems)
            const currentListItemIds = list.items.map(({ id }) => id)
            // Must also handle order change because onDragEnd below only applies to the source list, not the destination list.
            const incomingItemIds = updatedItems.map(({ id }) => id)
            const newOrder = [...currentListItemIds, ...incomingItemIds]
            handleReorder(newOrder)
          }
        : undefined,
    onDragEnd: handleReorder
      ? (e) => {
          // FYI: This only applies on the source list (applies to removed items + reordered items)
          let newOrder = list.items.map(({ id }) => id)
          // Remove items from the list if they were dropped outside of the list
          if (e.dropOperation === "move" && !e.isInternal) {
            list.remove(...e.keys)
            newOrder = newOrder.filter((id) => ![...e.keys].includes(id))
          }
          handleReorder(newOrder)
        }
      : undefined,
  })

  return dragAndDropHooks
}

export function useDroppableProps<T extends GenericListItem>({
  ref,
  acceptedItemKind,
  handleDrop,
}: {
  ref: DropOptions["ref"]
  acceptedItemKind: string
  handleDrop: (items: T[]) => void
}) {
  return useDrop({
    ref,
    getDropOperation: (draggedItemTypes) => {
      const isAccepted = draggedItemTypes.has(acceptedItemKind)
      if (!isAccepted) return "cancel"
      return "move"
    },
    onDrop: async (e) => {
      const processedItems = await Promise.all<T>(
        e.items
          .filter(isTextDropItem)
          .filter((item) => {
            const itemTypes = [...item.types]
            const isAccepted = itemTypes.some((type) => type === acceptedItemKind)
            return isAccepted
          })
          .map(async (item) => {
            return JSON.parse(await item.getText(acceptedItemKind))
          })
      )
      handleDrop(processedItems)
    },
  })
}
