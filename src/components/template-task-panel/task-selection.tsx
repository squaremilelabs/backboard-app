import { Task } from "@zenstackhq/runtime/models"
import { XIcon } from "lucide-react"
import { Button } from "react-aria-components"
import { AsyncListData } from "react-stately"
import { twMerge } from "tailwind-merge"
import { iconBox, interactive } from "@/styles/class-names"

export default function TaskSelection({ list }: { list: AsyncListData<Task> }) {
  const selectedIds =
    list.selectedKeys === "all"
      ? list.items.map((task) => task.id)
      : ([...list.selectedKeys] as string[])
  const selectionCount = selectedIds.length
  const isAllSelected = selectedIds.length === list.items.length

  return (
    <div className="flex items-center gap-4 p-4">
      <Button
        onPress={() => list.setSelectedKeys(new Set())}
        className={twMerge(iconBox(), interactive())}
      >
        <XIcon />
      </Button>
      <p className="font-medium">{selectionCount} selected</p>
      {!isAllSelected && (
        <Button
          className={twMerge(interactive({ hover: "underline" }), "ml-4 text-sm text-neutral-500")}
          onPress={() => list.setSelectedKeys("all")}
        >
          Select all
        </Button>
      )}
    </div>
  )
}
