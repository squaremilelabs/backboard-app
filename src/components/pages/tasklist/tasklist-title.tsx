"use client"
import { twMerge } from "tailwind-merge"
import { EmojiSelect } from "@/components/primitives/emoji"
import { EditableText } from "@/components/primitives/editable-text"
import { useFindUniqueTasklist, useUpdateTasklist } from "@/database/generated/hooks"
import { defaultTasklistEmojiCode } from "@/lib/utils-tasklist"

export function TasklistTitle({ tasklistId }: { tasklistId: string | undefined }) {
  const tasklistQuery = useFindUniqueTasklist({ where: { id: tasklistId } })
  const tasklist = tasklistQuery.data

  const updateTasklistMutation = useUpdateTasklist()

  const handleUpdate = (values: { emoji?: { code: string }; title?: string }) => {
    updateTasklistMutation.mutate({
      where: { id: tasklist?.id },
      data: values,
    })
  }

  return (
    <div className={twMerge("flex min-h-24 grow items-start gap-4")}>
      {!!tasklist && (
        <div
          className={twMerge(
            "flex grow items-start gap-4",
            tasklist?.archived_at ? "opacity-60" : ""
          )}
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
  )
}
