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
import { RelativeTarget } from "@prisma/client"
import { ChevronDown, ListTodo } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Task as ITask } from "@prisma/client"
import { ArrowUpToLine, Loader, Square, SquareCheck } from "lucide-react"
import { twMerge } from "tailwind-merge"
import MetadataPopover from "../../abstract/metadata-popover"
import CreateByTitleForm from "@/components/abstract/create-by-title-form"
import {
  useCreateTask,
  useFindManyTask,
  useUpdateTask,
  useUpdateTasklist,
} from "@/database/generated/hooks"
import { RELATIVE_TARGETS_UI_ENUM } from "@/lib/constants"
import { TasklistData } from "@/lib/data/tasklist"
import EditableText from "@/components/abstract/editable-text"
import { TopicData } from "@/lib/data/topic"
import { formatDate } from "@/lib/utils"

export default function Tasklist({
  tasklist,
  topic,
}: {
  tasklist: TasklistData
  topic: TopicData
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const updateTasklist = useUpdateTasklist()

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
            <EditableText record={tasklist} updateMutation={updateTasklist} />
          </div>
          <TargetSelect tasklist={tasklist} />
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
          <div
            className={twMerge(
              "flex h-[20px] w-[30px] items-center justify-center rounded-lg bg-neutral-200 px-2 text-sm",
              tasklist.target == "TODAY" || tasklist.target === "THIS_WEEK"
                ? tasklist._computed.undone_task_count === 0
                  ? "border border-red-200 bg-red-50 text-red-600"
                  : "border-gold-200 bg-gold-50 text-gold-600 border"
                : ""
            )}
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
        <TasksSection tasklist={tasklist} />
      </DisclosurePanel>
    </Disclosure>
  )
}

function TargetSelect({ tasklist }: { tasklist: TasklistData }) {
  const options = Object.entries(RELATIVE_TARGETS_UI_ENUM).map(([key, value]) => ({
    id: key,
    ...value,
  }))

  const updateMutation = useUpdateTasklist()
  const handleSelect = (target: RelativeTarget) => {
    updateMutation.mutate({ where: { id: tasklist.id }, data: { target } })
  }

  const baseClassName = twMerge(
    "border text-sm rounded-full h-[20px] min-w-[60px] px-2 flex items-center justify-center outline-neutral-500"
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
        <ListBox className="grid grid-cols-2 gap-2">
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
                  isSelected ? "ring-2 ring-neutral-300 ring-offset-1" : null
                  // option.id === "NONE" ? "col-span-2" : null
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

function TasksSection({ tasklist }: { tasklist: TasklistData }) {
  const { user } = useUser()
  const createTask = useCreateTask()
  const [showDoneTasks, setShowDoneTasks] = useState(false)

  useEffect(() => {
    if (!tasklist._computed.done_task_count) {
      setShowDoneTasks(false)
    }
  }, [tasklist._computed.done_task_count])

  const sortedUndoneTasks = useMemo(
    () =>
      [...tasklist._computed.undone_tasks].sort((a, b) => {
        const aOrder = tasklist.task_order.indexOf(a.id)
        const bOrder = tasklist.task_order.indexOf(b.id)
        if (aOrder > -1 && bOrder === -1) return -1
        if (aOrder === -1 && bOrder > -1) return 1
        if (aOrder > -1 && bOrder > -1) {
          return aOrder - bOrder
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }),
    [tasklist]
  )

  const hasTasks =
    tasklist._computed.undone_task_count > 0 || tasklist._computed.done_task_count > 0

  return (
    <div className="bg-canvas flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex flex-col">
        {sortedUndoneTasks.map((task) => {
          return <Task key={task.id} task={task} tasklist={tasklist} />
        })}
        <CreateByTitleForm
          createMutation={createTask}
          additionalData={{
            topic: { connect: { id: tasklist.topic_id } },
            tasklist: { connect: { id: tasklist.id, topic_id: tasklist.topic_id } },
            created_by: { connect: { id: user?.id } },
          }}
          placeholder={hasTasks ? "New Task" : "Add First Task"}
        />
      </div>
      {tasklist._computed.done_task_count ? (
        <div className="flex flex-col gap-2">
          <Button
            isDisabled={!tasklist._computed.done_task_count}
            onPress={() => setShowDoneTasks((prev) => !prev)}
            className={twMerge(
              "flex items-center gap-1 rounded-lg px-2 py-1",
              "focus-visible:text-gold-500 !outline-0",
              showDoneTasks
                ? "mt-2 rounded-b-none border-b pb-2 font-semibold text-neutral-950"
                : "self-start border text-neutral-500"
            )}
          >
            {tasklist._computed.done_task_count ? (
              <ChevronDown
                size={16}
                className={twMerge(showDoneTasks ? "rotate-0" : "-rotate-90")}
              />
            ) : null}
            <p className="text-sm">{tasklist._computed.done_task_count} done</p>
          </Button>
          {showDoneTasks ? <DoneTasks tasklist={tasklist} /> : null}
        </div>
      ) : null}
    </div>
  )
}

function DoneTasks({ tasklist }: { tasklist: TasklistData }) {
  const doneTasksQuery = useFindManyTask({
    where: { tasklist_id: tasklist.id, done_at: { not: null } },
    orderBy: { done_at: "desc" },
  })

  if (doneTasksQuery.isLoading) {
    return <span className="text-sm text-neutral-500">Loading...</span>
  }

  const doneTasks = doneTasksQuery.data || []

  if (doneTasks.length === 0) {
    return <span className="text-sm text-neutral-500">None</span>
  }

  return (
    <div className="flex flex-col">
      {doneTasks.map((task) => (
        <Task key={task.id} task={task} tasklist={tasklist} />
      ))}
    </div>
  )
}

function Task({ task, tasklist }: { task: ITask; tasklist: TasklistData }) {
  const updateTask = useUpdateTask()
  const updateTasklist = useUpdateTasklist()

  const handleCheck = () => {
    updateTask.mutate({
      where: { id: task.id },
      data: { done_at: task.done_at ? null : new Date() },
    })
  }

  const handleMoveToTop = () => {
    const currentTaskOrder = tasklist.task_order
    let updatedTaskOrder = [...currentTaskOrder]

    // if task.id is not in currentTaskOrder, add to front of array
    if (!updatedTaskOrder.includes(task.id)) {
      updatedTaskOrder.unshift(task.id)
    } else {
      // if task.id is in currentTaskOrder – move to front of array
      updatedTaskOrder = updatedTaskOrder.filter((id) => id !== task.id)
      updatedTaskOrder.unshift(task.id)
    }

    updateTasklist.mutate({
      where: { id: tasklist.id },
      data: { task_order: updatedTaskOrder },
    })
  }

  const isPending = updateTask.isPending || updateTasklist.isPending
  const CheckboxIcon = task.done_at ? SquareCheck : Square

  return (
    <div className="group flex items-start gap-2 rounded-lg p-2 outline-neutral-200 hover:outline-2">
      {isPending ? (
        <Loader size={20} className="text-gold-500 animate-spin" />
      ) : (
        <Button onPress={handleCheck} className={twMerge("text-neutral-500")}>
          <CheckboxIcon size={20} />
        </Button>
      )}
      <EditableText record={task} updateMutation={updateTask} updateField="title" />
      <div className="flex min-w-fit items-center gap-2">
        {!task.done_at ? (
          <div className="hidden h-[20px] items-center group-focus-within:flex group-hover:flex">
            <Button onPress={handleMoveToTop} className="text-gold-500">
              <ArrowUpToLine size={16} />
            </Button>
          </div>
        ) : null}
        {task.done_at ? (
          <p className="bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
            {formatDate(task.done_at, { withTime: true })}
          </p>
        ) : null}
        <div className="flex h-[20px] items-center">
          <MetadataPopover
            record={task}
            recordType={"Task"}
            updateMutation={updateTask}
            parentIsPublic={tasklist.is_public}
            iconSize={16}
            hideVisibility
          />
        </div>
      </div>
    </div>
  )
}
