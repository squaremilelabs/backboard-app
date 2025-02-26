import {
  Button,
  Disclosure,
  DisclosurePanel,
  Heading,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { RelativeTarget } from "@prisma/client"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import CreateByTitleForm from "@/components/create-by-title-form"
import { useCreateTasklist, useUpdateTasklist } from "@/database/generated/hooks"
import { RELATIVE_TARGETS_UI_ENUM } from "@/lib/constants"
import { TasklistData, useTaskslistsData } from "@/lib/data/tasklist"
import EditableTitle from "@/components/editable-title"

export default function TopicTasklists({ topicId }: { topicId: string }) {
  const { data: tasklists } = useTaskslistsData({ where: { topic_id: topicId, archived_at: null } })
  const createTasklist = useCreateTasklist()
  return (
    <div className="flex flex-col gap-2">
      {tasklists?.map((tasklist) => <Tasklist key={tasklist.id} tasklist={tasklist} />)}
      <CreateByTitleForm
        createMutation={createTasklist}
        additionalData={{ topic_id: topicId }}
        placeholder="New Tasklist"
      />
    </div>
  )
}

function Tasklist({ tasklist }: { tasklist: TasklistData }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const updateTasklist = useUpdateTasklist()
  return (
    <Disclosure
      className="rounded-lg border bg-neutral-100 p-1"
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
    >
      <Heading className="flex items-start gap-2 p-2">
        <div className="flex grow flex-col gap-2 @sm:flex-row @sm:items-start">
          <TasklistTargetSelect tasklist={tasklist} />
          <EditableTitle record={tasklist} updateMutation={updateTasklist} />
        </div>
        <div className="flex items-center gap-2">
          <div
            className={
              "flex h-[20px] items-center justify-center rounded-lg bg-neutral-200 px-2 text-sm"
            }
          >
            {tasklist._computed.undone_task_count}
          </div>
          <Button slot="trigger">
            <ChevronDown
              size={20}
              className={twMerge("transition-transform", isExpanded ? "rotate-0" : "rotate-90")}
            />
          </Button>
        </div>
      </Heading>
      <DisclosurePanel>
        <TasklistTasks />
      </DisclosurePanel>
    </Disclosure>
  )
}

function TasklistTargetSelect({ tasklist }: { tasklist: TasklistData }) {
  const options = Object.entries(RELATIVE_TARGETS_UI_ENUM).map(([key, value]) => ({
    id: key,
    ...value,
  }))

  const updateMutation = useUpdateTasklist()
  const handleSelect = (target: RelativeTarget) => {
    updateMutation.mutate({ where: { id: tasklist.id }, data: { target } })
  }

  const baseClassName = twMerge(
    "border text-sm rounded-full w-[90px] h-[20px] flex items-center justify-center outline-neutral-500"
  )
  const selectedClassName = RELATIVE_TARGETS_UI_ENUM[tasklist.target].className

  return (
    <Select
      aria-label="Select Target"
      selectedKey={tasklist.target}
      onSelectionChange={(id) => handleSelect(id as RelativeTarget)}
    >
      <Button className={twMerge(baseClassName, selectedClassName, "px-3")}>
        <SelectValue className={"text-sm"} />
      </Button>
      <Popover
        placement="bottom left"
        offset={2}
        className="bg-canvas/50 flex flex-col gap-2 rounded-lg border p-2 backdrop-blur-lg"
      >
        <div className="flex items-center gap-1 text-sm text-neutral-500">
          Next time in focus...
        </div>
        <ListBox className="grid grid-cols-2 gap-1">
          {options.map((option) => {
            const isSelected = tasklist.target === option.id
            return (
              <ListBoxItem
                key={option.id}
                id={option.id}
                className={twMerge(
                  baseClassName,
                  option.className,
                  "h-fit cursor-pointer border py-1 hover:opacity-60",
                  isSelected ? "ring-2 ring-neutral-300 ring-offset-1" : null,
                  option.id === "NONE" ? "col-span-2" : null
                )}
              >
                {option.label}
              </ListBoxItem>
            )
          })}
        </ListBox>
      </Popover>
    </Select>
  )
}

function TasklistTasks() {
  return <div className="bg-canvas rounded-lg border p-8">tasks</div>
}
