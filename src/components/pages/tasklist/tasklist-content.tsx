import { TextIcon } from "lucide-react"
import TasklistArchive from "./tasklist-archive"
import { EditableText } from "@/components/primitives/editable-text"
import { useFindUniqueTasklist, useUpdateTasklist } from "@/database/generated/hooks"
import { iconBox } from "@/styles/class-names"
import { formatDate } from "@/lib/utils-common"

export default function TasklistContent({ tasklistId }: { tasklistId: string | undefined }) {
  const { data: tasklist } = useFindUniqueTasklist({ where: { id: tasklistId } })

  const { mutate: updateTasklist } = useUpdateTasklist()
  const handleContentUpdate = (content: string) => {
    updateTasklist({
      where: { id: tasklist?.id },
      data: { content },
    })
  }

  return (
    <div className="flex flex-col gap-8 border-b pb-8">
      <div className="flex items-start gap-4">
        <div className={iconBox({ className: "w-24 text-neutral-400" })}>
          <TextIcon />
        </div>
        <EditableText
          initialValue={tasklist?.content ?? ""}
          onSave={handleContentUpdate}
          className={({}) => "grow text-neutral-600"}
          allowEmpty
          isMultiline
          placeholder="Description"
        />
      </div>
      <div className="flex items-center gap-4 px-8">
        <p className="text-sm text-neutral-500">Created: {formatDate(tasklist?.created_at)}</p>
        <div className="grow" />
        <TasklistArchive tasklistId={tasklistId} />
      </div>
    </div>
  )
}
