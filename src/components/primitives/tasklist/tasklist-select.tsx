import { ListBox, ListBoxItem, Popover, Selection } from "react-aria-components"
import React, { useMemo } from "react"
import { Tasklist } from "@zenstackhq/runtime/models"
import { FocusScope } from "react-aria"
import { twMerge } from "tailwind-merge"
import { TaskSizeChip } from "../task/task-size"
import TasklistItem from "./tasklist-item"
import { getTaskSummary } from "@/lib/utils-task"
import { sortTasklists } from "@/lib/utils-tasklist"
import { useFindManyTasklist } from "@/database/generated/hooks"

// TODO: Refactor – primitives should not call database hooks directly

export default function TasklistSelect({
  triggerRef,
  isOpen,
  onOpenChange,
  selectedId,
  onSelectionChange,
}: {
  triggerRef: React.RefObject<Element | null>
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedId: string | null
  onSelectionChange: (selection: Tasklist) => void
}) {
  const tasklistsQuery = useFindManyTasklist({
    where: {
      archived_at: null,
    },
    include: {
      tasks: {
        where: { status: "TODO", timeslot_id: null },
      },
    },
  })

  const sortedTasklists = useMemo(() => {
    if (!tasklistsQuery.data) return []
    return sortTasklists(tasklistsQuery.data)
  }, [tasklistsQuery.data])

  const handleSelect = (selection: Selection) => {
    const tasklistId = [...selection][0]
    const tasklist = sortedTasklists.find((tl) => tl.id === tasklistId)
    if (tasklist) onSelectionChange(tasklist)
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      placement="bottom start"
      offset={2}
    >
      <FocusScope autoFocus>
        <ListBox
          aria-label="Select Tasklist"
          items={sortedTasklists}
          selectionMode="single"
          selectedKeys={selectedId ? new Set([selectedId]) : new Set([])}
          onSelectionChange={handleSelect}
          disallowEmptySelection
          autoFocus
          className={twMerge(
            "max-h-400 w-300 max-w-300 truncate overflow-auto p-4",
            "bg-canvas/30 rounded-lg border-2 backdrop-blur-lg"
          )}
        >
          {(tasklist) => {
            const hasTasks = tasklist.tasks.length > 0
            const taskSummary = getTaskSummary(tasklist.tasks)
            return (
              <ListBoxItem
                id={tasklist.id}
                textValue={tasklist.title}
                className={twMerge(
                  "flex w-full truncate",
                  "gap-4 p-4",
                  "rounded-lg hover:bg-neutral-200",
                  "cursor-pointer"
                )}
              >
                <TasklistItem tasklist={tasklist} />
                {hasTasks ? (
                  <>
                    <TaskSizeChip minutes={taskSummary.status.TODO.minutes} status="TODO" />
                    {/* <TaskSizeChip minutes={taskSummary.status.DRAFT.minutes} status="DRAFT" /> */}
                  </>
                ) : null}
              </ListBoxItem>
            )
          }}
        </ListBox>
      </FocusScope>
    </Popover>
  )
}
