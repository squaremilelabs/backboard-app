"use client"
import { ArchiveIcon, ArchiveRestoreIcon } from "lucide-react"
import { Button } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { TasklistBacklogTarget } from "./tasklist-backlog-target"
import { EmojiSelect } from "@/components/primitives/emoji"
import { EditableText } from "@/components/primitives/editable-text"
import { useFindUniqueTasklist, useUpdateTasklist } from "@/database/generated/hooks"
import { iconBox, interactive } from "@/styles/class-names"
import { defaultTasklistEmojiCode } from "@/lib/utils-tasklist"
import { ConfirmationButton } from "@/components/primitives/confirmation-button"

export function TasklistHeader({ tasklistId }: { tasklistId: string | undefined }) {
  const tasklistQuery = useFindUniqueTasklist({ where: { id: tasklistId } })
  const tasklist = tasklistQuery.data

  const updateTasklistMutation = useUpdateTasklist()

  const handleUpdate = (values: { emoji?: { code: string }; title?: string }) => {
    updateTasklistMutation.mutate({
      where: { id: tasklist?.id },
      data: values,
    })
  }

  const handleArchiveToggle = () => {
    updateTasklistMutation.mutate({
      where: { id: tasklistId },
      data: { archived_at: tasklist?.archived_at ? null : new Date() },
    })
  }

  return (
    <div className="flex grow items-start gap-8">
      <div className="flex min-h-24 items-start gap-4">
        {!!tasklist && (
          <div
            className={twMerge("flex items-start gap-4", tasklist?.archived_at ? "opacity-60" : "")}
          >
            <EmojiSelect
              selected={tasklist.emoji?.code || null}
              fallback={defaultTasklistEmojiCode}
              onSelect={(emoji) => handleUpdate({ emoji: { code: emoji.unified } })}
              size="large"
            />
            <EditableText
              initialValue={tasklist?.title}
              onSave={(title) => handleUpdate({ title })}
              className={() => [
                "grow text-lg font-medium",
                tasklist?.archived_at ? "line-through" : "",
              ]}
            />
          </div>
        )}
      </div>
      <div className="grow" />
      <TasklistBacklogTarget tasklistId={tasklistId} />
      <ConfirmationButton
        onConfirm={handleArchiveToggle}
        content={
          tasklist?.archived_at
            ? "Restore this tasklist? It will reappear in your sidebar."
            : "Archive this tasklist? It will only be visible in weeks where it was active."
        }
        confirmButtonText={tasklist?.archived_at ? "Restore" : "Archive"}
        isDestructive={!tasklist?.archived_at}
      >
        <Button
          className={twMerge(
            iconBox({ size: "large" }),
            interactive({ hover: "background" }),
            tasklist?.archived_at ? "text-neutral-600" : "text-neutral-400"
          )}
        >
          {tasklist?.archived_at ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
        </Button>
      </ConfirmationButton>
    </div>
  )
}
