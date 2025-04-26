"use client"
import { twMerge } from "tailwind-merge"
import { sub } from "date-fns"
import { useEffect, useState } from "react"
import { Tasklist } from "@zenstackhq/runtime/models"
import { Button, Input, TextField } from "react-aria-components"
import { ArchiveIcon, Loader, XIcon } from "lucide-react"
import { EmojiStyle } from "emoji-picker-react"
import Modal from "../common/modal"
import { EmojiDynamic, EmojiSelect } from "../common/emoji-dynamic"
import { sortTasklists } from "./utilities"
import TasklistCreate from "./tasklist-create"
import {
  useCreateTask,
  useDeleteTask,
  useFindManyTasklist,
  useUpdateTask,
  useUpdateTasklist,
} from "@/database/generated/hooks"
import TaskListPanel from "@/components/task/task-list-panel"

const sevenDaysAgo = sub(new Date(), { days: 7 })

export default function TasklistList() {
  const tasklistsQuery = useFindManyTasklist({
    where: { archived_at: null },
    include: {
      tasks: {
        where: {
          OR: [{ completed_at: null }, { completed_at: { gte: sevenDaysAgo } }],
        },
      },
    },
    orderBy: { created_at: "asc" },
  })

  const [tasklistIdOrder, setTasklistIdOrder] = useState<string[] | null>(null)

  useEffect(() => {
    if (!tasklistsQuery.data) return
    const sortedTasklists = sortTasklists(tasklistsQuery.data)
    // If order not set, set for the first time
    const orderNotInitialized = tasklistIdOrder === null
    const tasklistSizeChanged = tasklistIdOrder?.length !== sortedTasklists.length
    if (orderNotInitialized || tasklistSizeChanged) {
      const sortedTasklistIds = sortedTasklists.map((tasklist) => tasklist.id)
      setTasklistIdOrder(sortedTasklistIds)
    }
  }, [tasklistsQuery, tasklistIdOrder, setTasklistIdOrder])

  const updateTasklistMutation = useUpdateTasklist()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  return (
    <div className={twMerge("flex h-full w-full flex-col")}>
      {tasklistsQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={twMerge("flex flex-col gap-8")}>
            {tasklistIdOrder?.map((tasklistId) => {
              const tasklist = tasklistsQuery.data?.find((tl) => tl.id === tasklistId)
              if (!tasklist) return null
              return (
                <TaskListPanel
                  uid={`triage/tasklist/${tasklist.id}`}
                  key={JSON.stringify({ [tasklist.id]: tasklistsQuery.dataUpdatedAt })}
                  tasks={tasklist.tasks}
                  order={tasklist.task_order}
                  isCollapsible
                  headerContent={<TasklistItemContent tasklist={tasklist} />}
                  defaultTaskValues={{
                    tasklist_id: tasklist.id,
                  }}
                  onCreateTask={(values) => {
                    createTaskMutation.mutate({
                      data: { ...values, tasklist: { connect: { id: tasklist.id } } },
                    })
                  }}
                  onUpdateTask={(id, values) => {
                    updateTaskMutation.mutate({
                      where: { id },
                      data: {
                        ...values,
                        completed_at: values.status === "DONE" ? new Date() : undefined,
                      },
                    })
                  }}
                  onDeleteTask={(id) => {
                    deleteTaskMutation.mutate({ where: { id } })
                  }}
                  onReorder={(reorderedIds) => {
                    updateTasklistMutation.mutate({
                      where: { id: tasklist.id },
                      data: { task_order: reorderedIds },
                    })
                  }}
                  onInsert={(task) => {
                    updateTaskMutation.mutate({
                      where: { id: task.id },
                      data: {
                        tasklist: { connect: { id: tasklist.id } },
                        timeslot: { disconnect: true },
                      },
                    })
                  }}
                />
              )
            })}
            <TasklistCreate />
          </div>
        </>
      )}
    </div>
  )
}

function TasklistItemContent({ tasklist }: { tasklist: Tasklist }) {
  const [open, setOpen] = useState(false)
  const [innerValues, setInnerValues] = useState({
    title: tasklist.title,
    emoji_code: tasklist.emoji_code,
    emoji_char: tasklist.emoji_char,
  })

  useEffect(() => {
    setInnerValues({
      title: tasklist.title,
      emoji_code: tasklist.emoji_code,
      emoji_char: tasklist.emoji_char,
    })
  }, [tasklist])

  const updateTasklistMutation = useUpdateTasklist()
  const handleSubmit = () => {
    if (!innerValues.title) return
    updateTasklistMutation.mutate({
      where: { id: tasklist.id },
      data: innerValues,
    })
  }

  const handleArchive = () => {
    updateTasklistMutation.mutate({
      where: { id: tasklist.id },
      data: { archived_at: new Date() },
    })
  }

  useEffect(() => {
    if (
      tasklist.emoji_code !== innerValues.emoji_code ||
      tasklist.emoji_char !== innerValues.emoji_char
    ) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasklist, innerValues])

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      triggerButton={
        <Button
          className={twMerge(
            "flex items-center gap-8",
            "cursor-pointer underline-offset-4 hover:underline",
            "rounded-md"
          )}
        >
          <EmojiDynamic
            unified={innerValues.emoji_code || "1f4cb"}
            emojiStyle={EmojiStyle.APPLE}
            size={16}
          />
          <p className="font-medium">{innerValues.title}</p>
        </Button>
      }
    >
      <div className="flex w-300 flex-col gap-16">
        <div className="flex items-center">
          <h1 className="grow text-lg font-medium text-neutral-700">Edit Tasklist</h1>
          <Button
            onPress={() => setOpen(false)}
            className="cursor-pointer rounded-md hover:opacity-70"
          >
            <XIcon size={20} />
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className={twMerge(
            "flex items-center gap-8 p-8",
            "rounded-md border-2 focus-within:outline"
          )}
        >
          <EmojiSelect
            selected={innerValues.emoji_code}
            fallback="1f4cb"
            onSelect={({ emoji_char, emoji_code }) => {
              setInnerValues((prev) => ({ ...prev, emoji_code, emoji_char }))
            }}
          />
          <TextField
            isDisabled={updateTasklistMutation.isPending}
            aria-label="Tasklist title"
            value={innerValues.title}
            onChange={(value) => setInnerValues((prev) => ({ ...prev, title: value }))}
            className={"flex grow"}
          >
            <Input className="grow !outline-0" placeholder="Enter title" />
          </TextField>
          {updateTasklistMutation.isPending ? (
            <Loader className="text-gold-600 animate-spin" size={20} />
          ) : null}
        </form>
        <Button
          className="flex cursor-pointer items-center gap-4 self-end text-sm text-neutral-400 hover:text-neutral-700"
          onPress={handleArchive}
        >
          Archive tasklist
          <ArchiveIcon size={12} />
        </Button>
      </div>
    </Modal>
  )
}
