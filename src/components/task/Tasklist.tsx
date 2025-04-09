// E: To refactor

import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Tasklist as ITasklist, Topic } from "@zenstackhq/runtime/models"
import MetadataPopover from "../common/MetadataPopover"
import TaskIndicator from "./TaskIndicator"
import { useUpdateTasklist } from "@/database/generated/hooks"
import EditableText from "@/components/common/EditableText"
import TasklistTasksContent from "@/components/task/TasklistTasksContent"

export default function Tasklist({ tasklist, topic }: { tasklist: ITasklist; topic: Topic }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const updateTasklist = useUpdateTasklist()

  const handleTitleUpdate = (value: string) => {
    updateTasklist.mutate({
      where: { id: tasklist.id },
      data: { title: value },
    })
  }

  return (
    <Disclosure
      className="rounded-lg border bg-neutral-100 p-1"
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
    >
      <Heading className="flex items-start gap-2 p-2">
        <div className="flex grow gap-2 @sm:items-start">
          {/* Extra space for drag grip */}
          <div className="size-[20px]"></div>
          <div className="flex grow items-start gap-2">
            <EditableText
              initialValue={tasklist.title}
              onSave={handleTitleUpdate}
              className="bg-neutral-100"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TaskIndicator whereClause={{ tasklist_id: tasklist.id }} />
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
