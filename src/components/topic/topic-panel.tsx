// E: This is too big of a component. Will refactor later.

"use client"
import { useFormik } from "formik"
import { Task, TaskTarget } from "@prisma/client"
import { TaskCreateScalarSchema, TaskUpdateScalarSchema } from "@zenstackhq/runtime/zod/models"
import { toFormikValidate } from "zod-formik-adapter"
import { ArrowRight, Bookmark, Check, Loader, Plus, Trash2 } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { useState } from "react"
import Collapsible from "../primitives/collapsible"
import { Button } from "../primitives/button"
import Popover from "../primitives/popover"
import {
  useCreateTask,
  useDeleteTask,
  useFindManyTask,
  useUpdateTask,
} from "@/database/generated/hooks"
import { TopicListItemData, useTopicsListItem } from "@/lib/topic-utils"
import { formatDate } from "@/lib/utils"
import { ORDERED_TASK_TARGETS, TASK_TARGET_DISPLAY_MAP } from "@/lib/task-utils"

export default function TopicPanel({ id }: { id: string }) {
  const topicQuery = useTopicsListItem(id)
  const tasksQuery = useFindManyTask({
    where: { topic_id: id, is_done: true },
    orderBy: { done_at: "desc" },
  })

  const topic = topicQuery.itemData
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Bookmark size={24} />
        <h1 className="text-xl font-semibold">{topic?.title ?? "-"}</h1>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <TopicNextTaskForm topic={topic} />
          {topic?._count_done_tasks ? (
            <Collapsible
              defaultOpen
              titleClassName="w-full py-2 pr-2"
              titleContent={
                <div className="flex w-full items-end gap-4">
                  <p className="font-medium">Done tasks</p>
                  {/* <TopicDoneTasksBadge topic={topic} /> */}
                </div>
              }
              panelContent={
                <div className="flex flex-col gap-1 p-0">
                  {tasksQuery?.data?.map((task) => {
                    return <DoneTaskListItem key={task.id} task={task} />
                  })}
                </div>
              }
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

type NextTaskFormValues = Pick<Task, "title" | "target">

function TopicNextTaskForm({ topic }: { topic: TopicListItemData | undefined }) {
  const currentTask = topic?._next_task

  const Schema = currentTask ? TaskUpdateScalarSchema : TaskCreateScalarSchema

  const formik = useFormik<NextTaskFormValues>({
    initialValues: {
      title: currentTask?.title || "",
      target: currentTask?.target || "NO_TARGET",
    },
    enableReinitialize: true,
    validate: toFormikValidate(Schema),
    onSubmit: (values) => {
      if (currentTask) {
        updateMutation.mutate({ where: { id: currentTask.id }, data: values })
      } else {
        if (!topic) return
        createMutation.mutate({
          data: {
            title: values.title,
            target: values.target,
            topic_id: topic?.id,
            current_for_topic: { connect: { id: topic.id } },
          },
        })
      }
    },
  })

  const updateMutation = useUpdateTask()
  const createMutation = useCreateTask()
  const deleteMutation = useDeleteTask()

  const isPending = updateMutation.isPending || createMutation.isPending || deleteMutation.isPending

  const Icon = isPending ? Loader : currentTask ? ArrowRight : Plus

  return (
    <div className="flex flex-col gap-1">
      {/* header */}
      {currentTask ? (
        <div className="flex items-center gap-1 pr-1 @sm:items-end @sm:justify-between">
          <p className="font-medium">{topic._count_done_tasks === 0 ? "First" : "Next"} task</p>
          <p className="rounded pl-2 text-sm text-neutral-600">
            Last edited {formatDate(currentTask.updated_at)}
          </p>
        </div>
      ) : null}
      {/* input form */}
      <div className="flex flex-col gap-1">
        <form
          className={twMerge(
            "bg-canvas flex w-full items-center rounded border pr-1 pl-2",
            "ring-gold-600 focus-within:bg-canvas focus-within:ring-1"
          )}
          onSubmit={formik.handleSubmit}
        >
          <div className="flex size-[20px] items-center justify-center">
            <Icon
              size={16}
              className={twMerge("text-gold-600", isPending ? "animate-spin" : null)}
            />
          </div>
          <input
            {...formik.getFieldProps("title")}
            className="placeholder-gold-600/80 grow p-2 !ring-0 !outline-0"
            placeholder={
              currentTask
                ? "Title required!"
                : `${topic?._count_done_tasks ? "What's the next task?" : "What's the first task?"}`
            }
          />
          {formik.values.title ? (
            <TaskTargetSelect
              selected={formik.values.target}
              onSelect={(target) => {
                formik.setFieldTouched("target")
                formik.setFieldValue("target", target)
                formik.submitForm()
              }}
            />
          ) : null}
        </form>
        {/* existing task actions */}
        {currentTask ? (
          <div className="flex items-start justify-between">
            <div className="flex justify-end gap-1">
              <Button
                className="bg-canvas flex items-center gap-1 rounded border px-2 py-1 text-sm text-neutral-500"
                onPress={() =>
                  updateMutation.mutate({
                    where: { id: currentTask.id },
                    data: {
                      is_done: true,
                      done_at: new Date(),
                      current_for_topic: { disconnect: { id: topic.id } },
                    },
                  })
                }
              >
                <Check size={16} />
                Mark as done
              </Button>
              <Button
                className="bg-canvas flex items-center gap-1 rounded border px-2 py-1 text-sm text-neutral-500"
                onPress={() => deleteMutation.mutate({ where: { id: currentTask.id } })}
              >
                <Trash2 size={16} />
                Delete task
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function TaskTargetSelect({
  selected,
  onSelect,
}: {
  selected: TaskTarget
  onSelect: (target: TaskTarget) => void
}) {
  const [open, setOpen] = useState(false)

  const buttonBaseClassName = "py-0.5 rounded px-4"

  const selectedDisplay = TASK_TARGET_DISPLAY_MAP[selected]
  const triggerContent = (
    <div className={twMerge(buttonBaseClassName, selectedDisplay.className, "border")}>
      {selectedDisplay.label}
    </div>
  )

  const popoverClassName = twMerge("grid grid-cols-1 gap-2 p-2")
  const popoverContent = ORDERED_TASK_TARGETS.map((target) => {
    const display = TASK_TARGET_DISPLAY_MAP[target]
    return (
      <Button
        key={target}
        className={twMerge(
          buttonBaseClassName,
          display.className,
          "px-4",
          selected === target ? "ring-2 ring-neutral-400 ring-offset-2" : ""
        )}
        onPress={() => {
          onSelect(target)
          setOpen(false)
        }}
      >
        {display.label}
      </Button>
    )
  })

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      triggerContent={triggerContent}
      popoverContent={popoverContent}
      popoverClassName={popoverClassName}
      placement="right-start"
    />
  )
}

function DoneTaskListItem({ task }: { task: Task }) {
  return (
    <div className="flex items-center rounded border px-2 pr-1">
      <div className="flex size-[20px] items-center justify-center">
        <Check size={16} />
      </div>
      <p className="grow p-2">{task.title}</p>
      {task.done_at ? (
        <span className="p-2 text-sm text-neutral-600">{formatDate(task.done_at)}</span>
      ) : null}
    </div>
  )
}
