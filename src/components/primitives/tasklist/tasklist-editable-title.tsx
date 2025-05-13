"use client"

import { EmojiSelect } from "../common/emoji"
import EditableText from "../common/editable-text"
import { defaultTasklistEmojiCode } from "@/lib/utils-tasklist"
import { useFindUniqueTasklist, useUpdateTasklist } from "@/database/generated/hooks"

export default function TasklistEditableTitle({ tasklistId }: { tasklistId: string }) {
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
    <div className="flex min-h-24 items-start gap-4">
      {tasklist ? (
        <>
          <EmojiSelect
            selected={tasklist?.emoji?.code || null}
            fallback={defaultTasklistEmojiCode}
            onSelect={(emoji) => handleUpdate({ emoji: { code: emoji.unified } })}
            size="large"
          />
          <EditableText
            initialValue={tasklist?.title}
            onSave={(title) => handleUpdate({ title })}
            className={() => "text-lg font-medium"}
          />
        </>
      ) : null}
    </div>
  )
}
