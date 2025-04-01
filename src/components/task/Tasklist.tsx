import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components"
import { RelativeTarget } from "@prisma/client"
import { ChevronDown, ListTodo } from "lucide-react"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import MetadataPopover from "../common/MetadataPopover"
import { useUpdateTasklist } from "@/database/generated/hooks"
import { TasklistData } from "@/lib/tasklist"
import { TopicData } from "@/lib/topic"
import EditableText from "@/components/common/EditableText"
import RelativeTargetSelect from "@/components/common/RelativeTargetSelect"
import TasklistTasksContent from "@/components/task/TasklistTasksContent"

export default function Tasklist({
  tasklist,
  topic,
}: {
  tasklist: TasklistData
  topic: TopicData
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const updateTasklist = useUpdateTasklist()

  const handleTitleUpdate = (value: string) => {
    updateTasklist.mutate({
      where: { id: tasklist.id },
      data: { title: value },
    })
  }

  const handleTargetSelect = (target: RelativeTarget) => {
    updateTasklist.mutate({
      where: { id: tasklist.id },
      data: { target },
    })
  }

  return (
    <Disclosure
      className="rounded-lg border bg-neutral-100 p-1"
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
    >
      <Heading className="flex items-start gap-2 p-2">
        <div className="flex grow flex-col-reverse gap-2 @sm:flex-row @sm:items-start">
          <div className="flex grow items-start gap-2">
            <div className="flex h-[20px] items-center text-neutral-500">
              <ListTodo size={16} />
            </div>
            <EditableText
              initialValue={tasklist.title}
              onSave={handleTitleUpdate}
              className="bg-neutral-100"
            />
          </div>
          <RelativeTargetSelect selected={tasklist.target} onSelect={handleTargetSelect} />
        </div>
        <div className="flex items-center gap-2">
          <div className="gap flex h-[20px] items-center">
            <MetadataPopover
              recordType="Tasklist"
              record={tasklist}
              updateMutation={updateTasklist}
              parentIsPublic={topic.is_public}
              iconSize={16}
            />
          </div>
          <Button slot="trigger" className="group flex items-center gap-2 !outline-0">
            <div
              className={twMerge(
                "flex h-[20px] w-[30px] items-center justify-center rounded-lg bg-neutral-200 px-2 text-sm",
                "outline-gold-500 group-focus-within:outline-1",
                tasklist.target == "TODAY" || tasklist.target === "THIS_WEEK"
                  ? tasklist._computed.undone_task_count === 0
                    ? "border border-red-200 bg-red-50 text-red-600"
                    : "border-gold-200 bg-gold-50 text-gold-600 border"
                  : ""
              )}
            >
              {tasklist._computed.undone_task_count}
            </div>
            <ChevronDown
              size={20}
              className={twMerge(
                "group-focus-within:text-gold-600 transition-transform",
                isExpanded ? "rotate-0" : "rotate-90"
              )}
            />
          </Button>
        </div>
      </Heading>
      <DisclosurePanel>
        <TasklistTasksContent tasklist={tasklist} />
      </DisclosurePanel>
    </Disclosure>
  )
}
