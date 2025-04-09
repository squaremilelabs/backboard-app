import { DropOptions, isTextDropItem, useDrop } from "react-aria"

export default function useDroppable<T>({
  ref,
  itemType,
  handleInsert,
}: {
  ref: DropOptions["ref"]
  itemType: string
  handleInsert: (items: T[]) => void
}) {
  return useDrop({
    ref,
    getDropOperation: (draggedItemTypes) => {
      if (!draggedItemTypes.has(itemType)) return "cancel"
      return "move"
    },
    onDrop: async (e) => {
      const processedItems = await Promise.all<T>(
        e.items
          .filter(isTextDropItem)
          .filter((item) => {
            const itemTypes = [...item.types]
            return itemTypes.some((type) => itemType === type)
          })
          .map(async (item) => JSON.parse(await item.getText(itemType)))
      )
      handleInsert(processedItems)
    },
  })
}
