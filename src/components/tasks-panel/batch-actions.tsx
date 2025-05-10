import { Prisma, Task, TaskStatus } from "@zenstackhq/runtime/models"
import { LoaderIcon, XIcon } from "lucide-react"
import { Button } from "react-aria-components"
import { AsyncListData } from "react-stately"
import { twMerge } from "tailwind-merge"
import { useEffect, useRef, useState } from "react"
import TaskPropertyPicker from "../primitives/task/task-property-picker"
import { chip, ChipProps, iconBox, interactive } from "@/styles/class-names"
import { taskStatusUIMap } from "@/lib/utils-task"
import { useDeleteManyTask, useUpdateManyTask } from "@/database/generated/hooks"

export default function BatchTaskActions({
  list,
  selectableStatuses,
}: {
  list: AsyncListData<Task>
  selectableStatuses: TaskStatus[]
}) {
  const selectionCount = [...list.selectedKeys].length
  const isAllSelected = selectionCount === list.items.length

  const updateTasksMutation = useUpdateManyTask()
  const deleteTasksMutation = useDeleteManyTask()

  const isPending = updateTasksMutation.isPending || deleteTasksMutation.isPending

  const handleBatchDelete = () => {
    const selectedIds = [...list.selectedKeys] as string[]
    deleteTasksMutation.mutate({
      where: { id: { in: selectedIds } },
    })
  }
  useEffect(() => {
    if (deleteTasksMutation.isSuccess) {
      list.reload()
      list.setSelectedKeys(new Set())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- don't run every time list changes
  }, [deleteTasksMutation.isSuccess])

  const handleBatchUpdate = (values: Prisma.TaskUpdateManyMutationInput) => {
    const selectedIds = [...list.selectedKeys] as string[]
    updateTasksMutation.mutate({
      where: { id: { in: selectedIds } },
      data: values,
    })
  }
  useEffect(() => {
    if (updateTasksMutation.isSuccess) {
      list.reload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- don't run every time list changes
  }, [updateTasksMutation.isSuccess])

  const sizePickerRef = useRef<HTMLButtonElement>(null)
  const [sizePickerOpen, setSizePickerOpen] = useState(false)

  return (
    <div className="flex flex-col gap-8 border-b pb-8">
      <div className="flex items-center gap-4">
        <Button
          onPress={() => list.setSelectedKeys(new Set())}
          className={twMerge(iconBox(), interactive())}
        >
          <XIcon />
        </Button>
        <p className="text-medium">{selectionCount} selected</p>
        {!isAllSelected && (
          <Button
            className={twMerge(
              interactive({ hover: "underline" }),
              "ml-4 text-sm text-neutral-500"
            )}
            onPress={() => list.setSelectedKeys("all")}
          >
            Select all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-8">
        {/* Set Status Buttons */}
        {selectableStatuses.map((status) => {
          const statusUI = taskStatusUIMap[status]
          return (
            <Button
              key={status}
              isDisabled={isPending}
              className={twMerge(
                interactive(),
                chip({ color: statusUI.color as ChipProps["color"], weight: "light", shape: "box" })
              )}
              onPress={() => handleBatchUpdate({ status })}
            >
              Mark {statusUI.label}
            </Button>
          )
        })}
        {/* Size Button */}
        <Button
          isDisabled={isPending}
          ref={sizePickerRef}
          onPress={() => setSizePickerOpen(true)}
          className={twMerge(
            interactive(),
            chip({ color: "neutral", weight: "zero", shape: "box" })
          )}
        >
          Set Size
        </Button>
        <TaskPropertyPicker
          triggerRef={sizePickerRef}
          isOpen={sizePickerOpen}
          onOpenChange={setSizePickerOpen}
          onSelect={(values) => handleBatchUpdate({ size_minutes: values.size_minutes })}
          selectableStatuses={[]}
          closeOnSelect
        />
        {/* Delete Button */}
        <Button
          isDisabled={isPending}
          className={twMerge(interactive(), chip({ color: "red", weight: "zero", shape: "box" }))}
          onPress={handleBatchDelete}
        >
          Delete
        </Button>
        {isPending && <LoaderIcon size={16} className="text-gold-500 animate-spin" />}
      </div>
    </div>
  )
}
