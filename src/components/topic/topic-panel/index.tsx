"use client"
import { Topic } from "@prisma/client"
import { useFormik } from "formik"
import { toFormikValidate } from "zod-formik-adapter"
import { TopicUpdateScalarSchema } from "@zenstackhq/runtime/zod/models"
import { twMerge } from "tailwind-merge"
import { Maximize2, X } from "lucide-react"
import Link from "next/link"
import TextareaAutosize from "react-textarea-autosize"
import useAside from "@/hooks/useAside"
import { useFindUniqueTopic, useUpdateTopic } from "@/database/generated/hooks"

export default function TopicPanel({ id }: { id: string }) {
  const topicQuery = useFindUniqueTopic({ where: { id } })
  const topic = topicQuery.data

  const { active } = useAside()
  const showAsideActions = active && active.type === "topic" && active.id === id

  if (!topic) return null
  return (
    <div className="grid w-full grid-rows-[auto_1fr]">
      <div className="flex items-center justify-between space-x-2 p-4">
        <TopicTitleForm topic={topic} />
        {showAsideActions && <TopicAsideActions topic={topic} />}
      </div>
      <div className="px-4">
        <TextareaAutosize className="bg-canvas w-full resize-none" />
      </div>
    </div>
  )
}

function TopicTitleForm({ topic }: { topic: Topic }) {
  const updateMutation = useUpdateTopic()
  const formik = useFormik({
    initialValues: { title: topic.title },
    enableReinitialize: true,
    validate: toFormikValidate(TopicUpdateScalarSchema),
    onSubmit: (values) => {
      updateMutation.mutate({ where: { id: topic.id }, data: values })
    },
  })
  return (
    <form onSubmit={formik.handleSubmit} className="grow">
      <input
        {...formik.getFieldProps("title")}
        className={twMerge(
          "w-full rounded text-lg !ring-0",
          formik.dirty ? "bg-canvas border px-2 py-1" : "",
          "focus:bg-canvas focus:border focus:px-2 focus:py-1"
        )}
        placeholder="Title"
      />
    </form>
  )
}

const asideActionClassName = twMerge(
  "size-[30px]",
  "flex items-center justify-center",
  "hover:opacity-80",
  "cursor-pointer"
)

function TopicAsideActions({ topic }: { topic: Topic }) {
  const { closeAside } = useAside()
  return (
    <div className="flex items-stretch">
      <Link href={`/topic/${topic.id}`} className={twMerge(asideActionClassName)}>
        <Maximize2 size={16} />
      </Link>
      <button onClick={closeAside} className={twMerge(asideActionClassName)}>
        <X size={20} />
      </button>
    </div>
  )
}
